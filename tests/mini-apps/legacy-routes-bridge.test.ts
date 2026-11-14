import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { NextRequest } from "next/server";
import type { ModelMessage } from "ai";
import {
  mockGenerateObject,
  mockStreamText,
  registerAiSdkMocks,
} from "./helpers/aiSdkMock";

const mockOpenAICompletionsCreate = mock();
const mockPrismaUserFindUnique = mock();
const mockFindFinanceAdd = mock();
const mockAddHabit = mock();

registerAiSdkMocks();

mock.module("openai", () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: mockOpenAICompletionsCreate,
      },
    };
  },
}));

mock.module("@line/bot-sdk", () => ({
  validateSignature: mock(() => true),
}));

mock.module("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: mockPrismaUserFindUnique,
    },
  },
}));

mock.module("@/lib/repositories/finance.repository", () => ({
  FinanceRepository: {
    addTransaction: mockFindFinanceAdd,
  },
}));

mock.module("@/lib/repositories/habit.repository", () => ({
  HabitRepository: {
    addHabit: mockAddHabit,
  },
}));

import { AIService } from "@/app/services/AIService";
import { POST as postTerminal } from "@/app/api/terminal/route";
import { POST as postLineWebhook } from "@/app/api/webhooks/line/route";
import { resetAllBridgeCircuits } from "@/app/lib/ai/bridgeRuntime";

describe("Legacy AI Routes Resilience (AIService, Terminal & LINE Webhook)", () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;

  beforeEach(() => {
    resetAllBridgeCircuits();
    mockGenerateObject.mockReset();
    mockStreamText.mockReset();
    mockOpenAICompletionsCreate.mockReset();
    mockPrismaUserFindUnique.mockReset();
    mockFindFinanceAdd.mockReset();
    mockAddHabit.mockReset();

    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";
    delete process.env.GEMINI_API_KEY;
    process.env.GLM_API_KEY = "test-glm-key";
    delete process.env.gGLM_API_KEY;
    process.env.LINE_CHANNEL_ACCESS_TOKEN = "test-line-token";
    process.env.LINE_CHANNEL_SECRET = "test-line-secret";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
  });

  describe("AIService.generateChatResponse (/api/chat)", () => {
    it("returns fallback telemetry headers when Gemini key is missing", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const messages: ModelMessage[] = [
        { role: "user", content: "Tell me about your projects" },
      ];
      const res = await AIService.generateChatResponse(messages);

      expect(res.status).toBe(200);
      expect(res.headers.get("X-AI-Bridge-Source")).toBe("FALLBACK_TRIGGERED");
      expect(res.headers.get("X-AI-Fallback-Reason")).toBe("MISSING_API_KEY");
      expect(res.headers.get("X-AI-Circuit-State")).toBe("CLOSED");
      expect(mockStreamText).not.toHaveBeenCalled();
    });

    it("redacts PII from messages and marks LIVE_GEMINI when streamText succeeds", async () => {
      mockStreamText.mockReturnValue({
        toUIMessageStreamResponse: (opts?: { headers?: HeadersInit }) =>
          new Response("stream-ok", { status: 200, headers: opts?.headers }),
      });

      const messages: ModelMessage[] = [
        {
          role: "user",
          content: "Contact rawin@example.com or 0812345678 about TypeScript",
        },
      ];
      const res = await AIService.generateChatResponse(messages);

      expect(res.status).toBe(200);
      expect(res.headers.get("X-AI-Bridge-Source")).toBe("LIVE_GEMINI");
      expect(mockStreamText).toHaveBeenCalledTimes(1);
      const callArg = mockStreamText.mock.calls[0]?.[0] as {
        messages?: Array<{ content: string }>;
      };
      expect(callArg.messages?.[0]?.content).not.toContain("rawin@example.com");
      expect(callArg.messages?.[0]?.content).not.toContain("0812345678");
    });

    it("opens circuit breaker after 3 stream failures and short-circuits 4th call", async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error("Gemini upstream 503");
      });

      const messages: ModelMessage[] = [{ role: "user", content: "Hello" }];

      for (let i = 0; i < 3; i += 1) {
        const res = await AIService.generateChatResponse(messages);
        expect(res.status).toBe(200);
        expect(res.headers.get("X-AI-Bridge-Source")).toBe(
          "FALLBACK_TRIGGERED",
        );
      }

      expect(mockStreamText).toHaveBeenCalledTimes(3);

      const fourthRes = await AIService.generateChatResponse(messages);
      expect(fourthRes.status).toBe(200);
      expect(fourthRes.headers.get("X-AI-Fallback-Reason")).toBe(
        "CIRCUIT_OPEN",
      );
      expect(fourthRes.headers.get("X-AI-Circuit-State")).toBe("OPEN");
      expect(mockStreamText).toHaveBeenCalledTimes(3);
    });
  });

  describe("POST /api/terminal", () => {
    it("returns deterministic fallback stream with MISSING_API_KEY when key is absent", async () => {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      const req = new NextRequest("http://localhost:3000/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "help", currentPath: "/home/guest" }),
      });

      const res = await postTerminal(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-AI-Bridge-Source")).toBe("FALLBACK_TRIGGERED");
      expect(res.headers.get("X-AI-Fallback-Reason")).toBe("MISSING_API_KEY");
      expect(mockStreamText).not.toHaveBeenCalled();
    });

    it("redacts PII in terminal prompt before invoking Gemini", async () => {
      mockStreamText.mockReturnValue({
        toTextStreamResponse: (opts?: { headers?: HeadersInit }) =>
          new Response("terminal-live", {
            status: 200,
            headers: opts?.headers,
          }),
      });

      const req = new NextRequest("http://localhost:3000/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Inspect account 1100800123456 phone 0891112233",
          currentPath: "/home/guest",
        }),
      });

      const res = await postTerminal(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-AI-Bridge-Source")).toBe("LIVE_GEMINI");
      const callArg = mockStreamText.mock.calls[0]?.[0] as { prompt?: string };
      expect(callArg.prompt).not.toContain("1100800123456");
      expect(callArg.prompt).not.toContain("0891112233");
    });

    it("opens terminal circuit breaker after 3 failures", async () => {
      mockStreamText.mockImplementation(() => {
        throw new Error("Terminal LLM timeout");
      });

      const makeReq = () =>
        new NextRequest("http://localhost:3000/api/terminal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: "whoami",
            currentPath: "/home/guest",
          }),
        });

      for (let i = 0; i < 3; i += 1) {
        const res = await postTerminal(makeReq());
        expect(res.headers.get("X-AI-Bridge-Source")).toBe(
          "FALLBACK_TRIGGERED",
        );
      }

      const fourthRes = await postTerminal(makeReq());
      expect(fourthRes.headers.get("X-AI-Fallback-Reason")).toBe(
        "CIRCUIT_OPEN",
      );
      expect(fourthRes.headers.get("X-AI-Circuit-State")).toBe("OPEN");
      expect(mockStreamText).toHaveBeenCalledTimes(3);
    });
  });

  describe("POST /api/webhooks/line", () => {
    const createLineWebhookRequest = (text: string) =>
      new Request("http://localhost:3000/api/webhooks/line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-line-signature": "valid-signature",
        },
        body: JSON.stringify({
          events: [
            {
              type: "message",
              replyToken: "reply-token-1",
              source: { type: "user", userId: "line-user-1" },
              message: { id: "msg-1", type: "text", text },
            },
          ],
        }),
      });

    it("replies with clean non-emoji Thai fallback when GLM_API_KEY is missing", async () => {
      delete process.env.GLM_API_KEY;
      mockPrismaUserFindUnique.mockResolvedValue({
        id: "user-1",
        name: "Rawin",
        lineUserId: "line-user-1",
      });
      const lineReplies: string[] = [];
      global.fetch = mock(async (_url: unknown, init?: RequestInit) => {
        lineReplies.push(String(init?.body ?? ""));
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }) as unknown as typeof fetch;

      const res = await postLineWebhook(createLineWebhookRequest("สวัสดีครับ"));
      expect(res.status).toBe(200);
      expect(mockOpenAICompletionsCreate).not.toHaveBeenCalled();
      expect(lineReplies[0]).toContain("ระบบ AI ไม่พร้อมใช้งานชั่วคราว");
    });

    it("redacts user PII before sending message to OpenAI GLM client and trips circuit after 3 errors", async () => {
      mockPrismaUserFindUnique.mockResolvedValue({
        id: "user-1",
        name: "Rawin Somchai",
        lineUserId: "line-user-1",
      });
      const lineReplies: string[] = [];
      global.fetch = mock(async (_url: unknown, init?: RequestInit) => {
        lineReplies.push(String(init?.body ?? ""));
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
      }) as unknown as typeof fetch;

      mockOpenAICompletionsCreate.mockRejectedValue(
        new Error("GLM gateway error"),
      );

      for (let i = 0; i < 3; i += 1) {
        const res = await postLineWebhook(
          createLineWebhookRequest(
            "Rawin Somchai email rawin@example.com phone 0812345678",
          ),
        );
        expect(res.status).toBe(200);
      }

      expect(mockOpenAICompletionsCreate).toHaveBeenCalledTimes(3);
      const firstPromptCall = mockOpenAICompletionsCreate.mock
        .calls[0]?.[0] as {
        messages?: Array<{ role: string; content: string }>;
      };
      const userPrompt =
        firstPromptCall.messages?.find((m) => m.role === "user")?.content ?? "";
      expect(userPrompt).not.toContain("rawin@example.com");
      expect(userPrompt).not.toContain("0812345678");
      expect(userPrompt).not.toContain("Rawin Somchai");

      const fourthRes = await postLineWebhook(
        createLineWebhookRequest("เช็คยอดหน่อย"),
      );
      expect(fourthRes.status).toBe(200);
      expect(mockOpenAICompletionsCreate).toHaveBeenCalledTimes(3);
      expect(lineReplies[3]).toContain("Circuit Breaker Active");
    });
  });
});
