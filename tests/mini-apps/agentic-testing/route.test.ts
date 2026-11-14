import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import {
  mockGenerateObject,
  mockStreamText,
  registerAiSdkMocks,
} from "../helpers/aiSdkMock";

registerAiSdkMocks();

import { POST } from "@/app/api/agentic-testing/intent/route";
import { resetAllBridgeCircuits } from "@/app/lib/ai/bridgeRuntime";

describe("POST /api/agentic-testing/intent", () => {
  const originalGoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const originalGeminiKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    resetAllBridgeCircuits();
    mockGenerateObject.mockReset();
    mockStreamText.mockReset();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    if (originalGoogleKey === undefined) {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalGoogleKey;
    }

    if (originalGeminiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalGeminiKey;
    }
  });

  it("returns 400 when prompt is missing or empty", async () => {
    const req = new Request(
      "http://localhost:3000/api/agentic-testing/intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "   ",
          currentNodes: [],
          currentEdges: [],
        }),
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = (await res.json()) as { error?: string };
    expect(data.error).toBeDefined();
  });

  it("returns LIVE_GEMINI patch and redacts PII before calling generateObject", async () => {
    mockGenerateObject.mockResolvedValue({
      object: {
        nodesToAdd: [
          { id: "node_auth_2fa", label: "2FA Check (TC-09)", type: "step" },
        ],
        edgesToAdd: [
          {
            id: "e_2fa",
            source: "node_2",
            target: "node_auth_2fa",
            label: "next",
          },
        ],
        edgesToRemove: [],
        impact: { totalNodesAdded: 1, affectedFlows: ["Auth Flow"] },
      },
    });

    const req = new Request(
      "http://localhost:3000/api/agentic-testing/intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Add 2FA step for user@example.com phone 0812345678",
          currentNodes: [{ id: "node_2", label: "Login" }],
          currentEdges: [],
        }),
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = (await res.json()) as {
      nodesToAdd: Array<{ id: string }>;
      bridgeMeta: {
        source: string;
        circuitState: string;
        piiRedacted: boolean;
        redactionCount: number;
      };
    };

    expect(data.nodesToAdd[0]?.id).toBe("node_auth_2fa");
    expect(data.bridgeMeta.source).toBe("LIVE_GEMINI");
    expect(data.bridgeMeta.circuitState).toBe("CLOSED");
    expect(data.bridgeMeta.piiRedacted).toBe(true);
    expect(data.bridgeMeta.redactionCount).toBeGreaterThanOrEqual(2);

    const callArg = mockGenerateObject.mock.calls[0]?.[0] as
      | { prompt?: string }
      | undefined;
    expect(callArg?.prompt).toBeDefined();
    expect(callArg?.prompt).not.toContain("user@example.com");
    expect(callArg?.prompt).not.toContain("0812345678");
  });

  it("returns HTTP 200 FALLBACK_TRIGGERED deterministic patch when API key is missing", async () => {
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const req = new Request(
      "http://localhost:3000/api/agentic-testing/intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Add OTP timeout validation step",
          currentNodes: [{ id: "node_1", label: "Start" }],
          currentEdges: [],
        }),
      },
    );

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockGenerateObject).not.toHaveBeenCalled();

    const data = (await res.json()) as {
      nodesToAdd: Array<{ id: string; label: string }>;
      edgesToAdd: Array<{ source: string; target: string }>;
      bridgeMeta: { source: string; reason?: string; circuitState: string };
    };

    expect(data.bridgeMeta.source).toBe("FALLBACK_TRIGGERED");
    expect(data.bridgeMeta.reason).toBe("MISSING_API_KEY");
    expect(data.nodesToAdd.length).toBeGreaterThan(0);
    expect(data.edgesToAdd[0]?.source).toBe("node_1");
  });

  it("opens circuit breaker after 3 failures and short-circuits the 4th request", async () => {
    mockGenerateObject.mockRejectedValue(new Error("Upstream quota exceeded"));

    const makeRequest = () =>
      new Request("http://localhost:3000/api/agentic-testing/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Verify payment retry",
          currentNodes: [{ id: "node_start", label: "Start" }],
          currentEdges: [],
        }),
      });

    for (let i = 0; i < 3; i += 1) {
      const res = await POST(makeRequest());
      expect(res.status).toBe(200);
      const data = (await res.json()) as { bridgeMeta: { source: string } };
      expect(data.bridgeMeta.source).toBe("FALLBACK_TRIGGERED");
    }

    expect(mockGenerateObject).toHaveBeenCalledTimes(3);

    const fourthRes = await POST(makeRequest());
    expect(fourthRes.status).toBe(200);
    const fourthData = (await fourthRes.json()) as {
      bridgeMeta: { source: string; reason?: string; circuitState: string };
    };
    expect(fourthData.bridgeMeta.source).toBe("FALLBACK_TRIGGERED");
    expect(fourthData.bridgeMeta.reason).toBe("CIRCUIT_OPEN");
    expect(fourthData.bridgeMeta.circuitState).toBe("OPEN");
    expect(mockGenerateObject).toHaveBeenCalledTimes(3);
  });
});
