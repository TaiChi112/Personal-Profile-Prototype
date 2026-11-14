import { beforeEach, describe, expect, it } from "bun:test";
import { mockGenerateObject, registerAiSdkMocks } from "./helpers/aiSdkMock";

registerAiSdkMocks();

import {
  BridgeCircuitBreaker,
  redactPiiPayload,
  redactPiiString,
  resetAllBridgeCircuits,
} from "@/app/lib/ai/bridgeRuntime";
import { POST as postPmsSynthesize } from "@/app/api/pms/synthesize/route";
import { POST as postStateFlowIntent } from "@/app/api/stateflow/intent/route";

describe("Production AI Bridge Runtime (Circuit Breaker, PII Firewall & Stateless Routes)", () => {
  const originalApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  beforeEach(() => {
    mockGenerateObject.mockReset();
    resetAllBridgeCircuits();
    if (originalApiKey === undefined) {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalApiKey;
    }
  });

  it("redacts emails, phones, Thai 13-digit IDs, and known employee names from nested payloads", () => {
    const rawText =
      "นายสมชาย ใจดี (somchai.k@rsxyz.co.th, โทร 081-234-5678, ID 1-1008-00987-65-4 / 1100800987654) ส่งข้อมูล";
    const { sanitized, redactions } = redactPiiString(rawText, [
      "Somchai Jaidee",
    ]);

    expect(sanitized).not.toContain("somchai.k@rsxyz.co.th");
    expect(sanitized).not.toContain("081-234-5678");
    expect(sanitized).not.toContain("1-1008-00987-65-4");
    expect(sanitized).not.toContain("1100800987654");
    expect(sanitized).not.toContain("นายสมชาย");
    expect(sanitized).toContain("[REDACTED_EMAIL]");
    expect(sanitized).toContain("[REDACTED_PHONE]");
    expect(sanitized).toContain("[REDACTED_THAI_ID]");
    expect(sanitized).toContain("[REDACTED_NAME]");
    expect(redactions).toBeGreaterThanOrEqual(4);

    const nested = redactPiiPayload(
      {
        notes: ["Contact Alice Wonder at alice@example.com or +66891112222"],
        meta: { reviewer: "Alice Wonder" },
      },
      ["Alice Wonder"],
    );

    expect(JSON.stringify(nested.sanitized)).not.toContain("Alice Wonder");
    expect(JSON.stringify(nested.sanitized)).not.toContain("alice@example.com");
    expect(nested.redactionCount).toBe(4);
  });

  it("trips BridgeCircuitBreaker after 3 failures and recovers after cooldown", () => {
    const breaker = new BridgeCircuitBreaker({
      failureThreshold: 3,
      cooldownMs: 60_000,
    });

    const t0 = 1_000_000;
    expect(breaker.canAttempt(t0)).toBe(true);
    expect(breaker.recordFailure(t0 + 10)).toBe("CLOSED");
    expect(breaker.recordFailure(t0 + 20)).toBe("CLOSED");
    expect(breaker.recordFailure(t0 + 30)).toBe("OPEN");

    expect(breaker.getState(t0 + 10_000)).toBe("OPEN");
    expect(breaker.canAttempt(t0 + 10_000)).toBe(false);

    // After 60s cooldown, half-open attempt is permitted
    expect(breaker.canAttempt(t0 + 60_031)).toBe(true);
    breaker.recordSuccess();
    expect(breaker.getState(t0 + 60_040)).toBe("CLOSED");
    expect(breaker.getStats().failures).toBe(0);
  });

  it("returns 400 for malformed payload and FALLBACK_TRIGGERED when API key is missing in /api/stateflow/intent", async () => {
    const badReq = new Request("http://localhost:3000/api/stateflow/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "", nodes: [] }),
    });
    const badRes = await postStateFlowIntent(badReq);
    expect(badRes.status).toBe(400);

    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const req = new Request("http://localhost:3000/api/stateflow/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "แทรกขั้นตอน e-KYC",
        presetId: "ecommerce",
        nodes: [{ id: "start", label: "Order Created" }],
        edges: [],
      }),
    });
    const res = await postStateFlowIntent(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.source).toBe("FALLBACK_TRIGGERED");
    expect(data.reason).toBe("MISSING_API_KEY");
    expect(mockGenerateObject).not.toHaveBeenCalled();
  });

  it("executes LIVE_GEMINI via mocked generateObject and trips circuit after 3 upstream failures", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key-present";

    mockGenerateObject.mockResolvedValueOnce({
      object: {
        addNodes: [
          {
            id: "kyc_check",
            label: "e-KYC Check",
            sub: "Identity Verification",
            x: 420,
            y: 160,
            traffic: "20%",
          },
        ],
        addEdges: [
          {
            id: "e_kyc_1",
            from: "start",
            to: "kyc_check",
            label: "Verify User",
            type: "forward",
            prob: "100%",
          },
        ],
        explanation: "Added e-KYC Check step",
      },
    });

    const makeReq = () =>
      new Request("http://localhost:3000/api/stateflow/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "เพิ่มขั้นตอน e-KYC",
          presetId: "ecommerce",
          nodes: [{ id: "start", label: "Order Created" }],
          edges: [],
        }),
      });

    const liveRes = await postStateFlowIntent(makeReq());
    const liveData = await liveRes.json();
    expect(liveRes.status).toBe(200);
    expect(liveData.ok).toBe(true);
    expect(liveData.source).toBe("LIVE_GEMINI");
    expect(liveData.patch.addNodes[0].id).toBe("kyc_check");

    // Simulate 3 consecutive upstream errors to open circuit breaker
    mockGenerateObject.mockRejectedValue(new Error("Upstream 503"));
    for (let i = 0; i < 3; i += 1) {
      const failRes = await postStateFlowIntent(makeReq());
      const failData = await failRes.json();
      expect(failData.source).toBe("FALLBACK_TRIGGERED");
    }

    // 4th call must short-circuit with CIRCUIT_OPEN without invoking generateObject
    const callsBeforeOpen = mockGenerateObject.mock.calls.length;
    const openRes = await postStateFlowIntent(makeReq());
    const openData = await openRes.json();
    expect(openData.ok).toBe(false);
    expect(openData.source).toBe("FALLBACK_TRIGGERED");
    expect(openData.reason).toBe("CIRCUIT_OPEN");
    expect(openData.circuitState).toBe("OPEN");
    expect(mockGenerateObject.mock.calls.length).toBe(callsBeforeOpen);
  });

  it("enforces Server PII Firewall before calling Gemini in /api/pms/synthesize", async () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key-present";

    mockGenerateObject.mockResolvedValueOnce({
      object: {
        feedbackText: "ผลงานยอดเยี่ยมตามเป้าหมาย latency และพร้อมเติบโตในรอบถัดไป",
        idpActionPlan: "ออกแบบ Event-Driven Gateway และ Load Test Pipeline",
      },
    });

    const req = new Request("http://localhost:3000/api/pms/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SYNTHESIZE_FEEDBACK",
        employeeAnonymizedId: "ENG_ANON_8832",
        tone: "COACHING_GROWTH",
        goalTitle: "ลดความหน่วงระบบหลังบ้านให้ต่ำกว่า 120ms",
        calibratedScore: 4.5,
        managerNote:
          "คุณ Somchai Pattana (somchai@rsxyz.co.th, 081-999-8888, ID 1100800987654) ทำงานได้ดีมาก",
        idpFocusSkill: "Distributed Tracing",
        knownSensitiveNames: ["Somchai Pattana"],
      }),
    });

    const res = await postPmsSynthesize(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(data.source).toBe("LIVE_GEMINI");
    expect(data.piiRedacted).toBe(true);
    expect(data.redactionCount).toBeGreaterThanOrEqual(4);

    // Verify prompt sent to Gemini never contained unredacted PII
    const lastCallArg = mockGenerateObject.mock.calls[0]?.[0] as {
      prompt: string;
    };
    expect(lastCallArg.prompt).not.toContain("Somchai Pattana");
    expect(lastCallArg.prompt).not.toContain("somchai@rsxyz.co.th");
    expect(lastCallArg.prompt).not.toContain("081-999-8888");
    expect(lastCallArg.prompt).not.toContain("1100800987654");
    expect(lastCallArg.prompt).toContain("[REDACTED_NAME]");
    expect(lastCallArg.prompt).toContain("[REDACTED_EMAIL]");
  });
});
