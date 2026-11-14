import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { NextRequest } from "next/server";
import { mockGenerateObject, registerAiSdkMocks } from "./helpers/aiSdkMock";

const mockAuth = mock<() => Promise<{ user?: { role?: string } } | null>>(
  async () => null,
);

mock.module("@/auth", () => ({
  auth: mockAuth,
}));

registerAiSdkMocks();

import {
  executeGeminiBridge,
  getAiBridgeHealthSnapshot,
  redactPiiPayload,
  resetAllBridgeCircuits,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";
import {
  AiBridgeHealthResponseSchema,
  KNOWN_AI_BRIDGE_ROUTES,
  Rfc7807ProblemSchema,
} from "@/app/lib/ai/healthContract";
import { GET, POST } from "@/app/api/health/ai-bridge/route";
import { z } from "zod";

describe("AI Bridge Health Telemetry API (/api/health/ai-bridge)", () => {
  const originalGoogleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const originalGlmKey = process.env.GLM_API_KEY;
  const originalAdminToken = process.env.AI_BRIDGE_ADMIN_TOKEN;
  const originalEnforceGuard = process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD;

  beforeEach(() => {
    resetAllBridgeCircuits();
    mockGenerateObject.mockReset();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-google-key";
    process.env.GLM_API_KEY = "test-glm-key";
    delete process.env.AI_BRIDGE_ADMIN_TOKEN;
    delete process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD;
  });

  afterEach(() => {
    if (originalGoogleKey === undefined) {
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    } else {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalGoogleKey;
    }
    if (originalGlmKey === undefined) {
      delete process.env.GLM_API_KEY;
    } else {
      process.env.GLM_API_KEY = originalGlmKey;
    }
    if (originalAdminToken === undefined) {
      delete process.env.AI_BRIDGE_ADMIN_TOKEN;
    } else {
      process.env.AI_BRIDGE_ADMIN_TOKEN = originalAdminToken;
    }
    if (originalEnforceGuard === undefined) {
      delete process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD;
    } else {
      process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD = originalEnforceGuard;
    }
  });

  it("returns valid contract-first snapshot covering all 8 registered routes", async () => {
    const req = new NextRequest("http://localhost:3000/api/health/ai-bridge");
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("no-store");
    expect(res.headers.get("X-AI-Bridge-Telemetry-Version")).toBe("1.0");

    const json = (await res.json()) as unknown;
    const parsed = AiBridgeHealthResponseSchema.parse(json);

    expect(parsed.status).toBe("HEALTHY");
    expect(parsed.routes.length).toBe(KNOWN_AI_BRIDGE_ROUTES.length);
    expect(parsed.summary.totalRoutes).toBe(8);
    expect(parsed.summary.openCircuits).toBe(0);
  });

  it("accumulates PII redactions, live successes, failures, and circuit-open metrics per routeKey", async () => {
    redactPiiPayload(
      { text: "Contact rawin@example.com phone 0812345678" },
      [],
      { routeKey: "stateflow:intent" },
    );

    mockGenerateObject.mockResolvedValueOnce({ object: { ok: true } });
    await executeGeminiBridge({
      routeKey: "stateflow:intent",
      schema: z.object({ ok: z.boolean() }),
      system: "test",
      prompt: "test prompt",
    });

    for (let i = 0; i < 4; i += 1) {
      await runWithCircuitGuard({
        routeKey: "agentic-testing:intent",
        execute: async () => {
          throw new Error("Simulated upstream 503");
        },
      });
    }

    const req = new NextRequest(
      "http://localhost:3000/api/health/ai-bridge?status=OPEN",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);

    const parsed = AiBridgeHealthResponseSchema.parse(await res.json());
    expect(parsed.status).toBe("CRITICAL");
    expect(parsed.summary.openCircuits).toBe(1);
    expect(parsed.routes.length).toBe(1);

    const openRoute = parsed.routes[0];
    expect(openRoute?.routeKey).toBe("agentic-testing:intent");
    expect(openRoute?.telemetry.totalRequests).toBe(4);
    expect(openRoute?.telemetry.upstreamErrorCount).toBe(3);
    expect(openRoute?.telemetry.circuitOpenRejectedCount).toBe(1);

    const fullSnapshot = getAiBridgeHealthSnapshot({
      routeKey: "stateflow:intent",
    });
    const stateflowEntry = fullSnapshot.routes[0];
    expect(stateflowEntry?.telemetry.liveSuccessCount).toBe(1);
    expect(stateflowEntry?.telemetry.piiRedactedCount).toBe(2);
  });

  it("returns RFC 7807 HTTP 400 for invalid status or unregistered routeKey queries", async () => {
    const badStatusRes = await GET(
      new NextRequest(
        "http://localhost:3000/api/health/ai-bridge?status=BOGUS",
      ),
    );
    expect(badStatusRes.status).toBe(400);
    expect(badStatusRes.headers.get("Content-Type")).toContain(
      "application/problem+json",
    );
    const problem1 = Rfc7807ProblemSchema.parse(await badStatusRes.json());
    expect(problem1.status).toBe(400);

    const unknownRouteRes = await GET(
      new NextRequest(
        "http://localhost:3000/api/health/ai-bridge?routeKey=nonexistent:route",
      ),
    );
    expect(unknownRouteRes.status).toBe(400);
    const problem2 = Rfc7807ProblemSchema.parse(await unknownRouteRes.json());
    expect(problem2.type).toContain("unknown-route-key");
  });

  it("supports idempotent POST RESET_CIRCUIT and RESET_TELEMETRY and validates invalid payloads", async () => {
    for (let i = 0; i < 3; i += 1) {
      await runWithCircuitGuard({
        routeKey: "terminal:stream",
        execute: async () => {
          throw new Error("Failure");
        },
      });
    }

    expect(
      getAiBridgeHealthSnapshot({ routeKey: "terminal:stream" }).routes[0]
        ?.circuit.state,
    ).toBe("OPEN");

    const resetReq = () =>
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESET_CIRCUIT",
          routeKey: "terminal:stream",
        }),
      });

    const firstReset = await POST(resetReq());
    expect(firstReset.status).toBe(200);
    const firstJson = (await firstReset.json()) as {
      ok: boolean;
      actionApplied: string;
      affectedRouteKeys: string[];
      snapshot: unknown;
    };
    expect(firstJson.ok).toBe(true);
    expect(firstJson.actionApplied).toBe("RESET_CIRCUIT");
    expect(firstJson.affectedRouteKeys).toEqual(["terminal:stream"]);

    // Second invocation must be idempotent
    const secondReset = await POST(resetReq());
    expect(secondReset.status).toBe(200);

    expect(
      getAiBridgeHealthSnapshot({ routeKey: "terminal:stream" }).routes[0]
        ?.circuit.state,
    ).toBe("CLOSED");

    const resetTelemetryRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RESET_TELEMETRY",
          routeKey: "terminal:stream",
        }),
      }),
    );
    expect(resetTelemetryRes.status).toBe(200);
    expect(
      getAiBridgeHealthSnapshot({ routeKey: "terminal:stream" }).routes[0]
        ?.telemetry.totalRequests,
    ).toBe(0);

    const invalidBodyRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DROP_DATABASE" }),
      }),
    );
    expect(invalidBodyRes.status).toBe(400);
    expect(invalidBodyRes.headers.get("Content-Type")).toContain(
      "application/problem+json",
    );
  });

  it("enforces Role Guard boundary with RFC 7807 403 Forbidden when AI_BRIDGE_ADMIN_TOKEN is configured", async () => {
    process.env.AI_BRIDGE_ADMIN_TOKEN = "secret-ops-token-2026";

    const snapshotRes = await GET(
      new NextRequest("http://localhost:3000/api/health/ai-bridge"),
    );
    const snapshot = AiBridgeHealthResponseSchema.parse(
      await snapshotRes.json(),
    );
    expect(snapshot.environment.adminGuardEnforced).toBe(true);

    const missingTokenRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_CIRCUIT" }),
      }),
    );
    expect(missingTokenRes.status).toBe(403);
    expect(missingTokenRes.headers.get("Content-Type")).toContain(
      "application/problem+json",
    );
    const problem = Rfc7807ProblemSchema.parse(await missingTokenRes.json());
    expect(problem.type).toContain("forbidden-admin-action");

    const wrongTokenRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ai-bridge-admin-token": "wrong-token",
        },
        body: JSON.stringify({ action: "RESET_CIRCUIT" }),
      }),
    );
    expect(wrongTokenRes.status).toBe(403);

    const validTokenRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ai-bridge-admin-token": "secret-ops-token-2026",
        },
        body: JSON.stringify({ action: "RESET_CIRCUIT" }),
      }),
    );
    expect(validTokenRes.status).toBe(200);
    const validBody = (await validTokenRes.json()) as {
      ok: boolean;
      authorizedBy: string;
    };
    expect(validBody.ok).toBe(true);
    expect(validBody.authorizedBy).toBe("ADMIN_TOKEN");

    // Also allow NextAuth session admin role without token header
    mockAuth.mockResolvedValueOnce({ user: { role: "admin" } });
    const sessionAdminRes = await POST(
      new NextRequest("http://localhost:3000/api/health/ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_CIRCUIT" }),
      }),
    );
    expect(sessionAdminRes.status).toBe(200);
    const sessionAdminBody = (await sessionAdminRes.json()) as {
      ok: boolean;
      authorizedBy: string;
    };
    expect(sessionAdminBody.ok).toBe(true);
    expect(sessionAdminBody.authorizedBy).toBe("SESSION_ADMIN");
  });
});
