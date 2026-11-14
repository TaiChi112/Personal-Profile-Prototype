import { describe, it, expect, mock, beforeEach } from "bun:test";
import { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AiBridgeHealthDashboardPage from "@/app/projects/(micro-apps)/ai-bridge-health/page";
import type { AiBridgeHealthSnapshot } from "@/app/lib/ai/healthContract";

const mockSnapshot: AiBridgeHealthSnapshot = {
  version: "1.0",
  status: "DEGRADED",
  timestamp: "2026-11-14T05:00:00.000Z",
  environment: {
    geminiKeyConfigured: false,
    glmKeyConfigured: false,
    nodeEnv: "test",
  },
  summary: {
    totalRoutes: 2,
    openCircuits: 1,
    closedCircuits: 1,
    totalRequests: 7,
    liveSuccessCount: 2,
    fallbackCount: 5,
    totalPiiRedacted: 4,
    avgLatencyMs: 28,
  },
  routes: [
    {
      routeKey: "stateflow:intent",
      endpoint: "/api/stateflow/intent",
      provider: "gemini",
      description: "StateFlow bridge",
      circuit: {
        state: "CLOSED",
        failures: 0,
        failureThreshold: 3,
        remainingCooldownMs: 0,
      },
      telemetry: {
        totalRequests: 3,
        liveSuccessCount: 2,
        fallbackCount: 1,
        timeoutCount: 0,
        missingKeyCount: 1,
        circuitOpenRejectedCount: 0,
        upstreamErrorCount: 0,
        piiRedactedCount: 4,
        avgLatencyMs: 32,
        lastLatencyMs: 14,
        lastOutcome: "LIVE_GEMINI",
        lastFallbackReason: null,
        lastUpdatedAt: "2026-11-14T05:00:00.000Z",
      },
    },
    {
      routeKey: "agentic-testing:intent",
      endpoint: "/api/agentic-testing/intent",
      provider: "gemini",
      description: "Agentic testing bridge",
      circuit: {
        state: "OPEN",
        failures: 3,
        failureThreshold: 3,
        remainingCooldownMs: 45_000,
      },
      telemetry: {
        totalRequests: 4,
        liveSuccessCount: 0,
        fallbackCount: 4,
        timeoutCount: 0,
        missingKeyCount: 0,
        circuitOpenRejectedCount: 1,
        upstreamErrorCount: 3,
        piiRedactedCount: 0,
        avgLatencyMs: 25,
        lastLatencyMs: 10,
        lastOutcome: "FALLBACK_TRIGGERED",
        lastFallbackReason: "CIRCUIT_OPEN",
        lastUpdatedAt: "2026-11-14T05:00:00.000Z",
      },
    },
  ],
};

describe("AiBridgeHealthDashboardPage", () => {
  beforeEach(() => {
    global.fetch = mock(async (_url: unknown, init?: RequestInit) => {
      if (init?.method === "POST") {
        return new Response(
          JSON.stringify({
            ok: true,
            actionApplied: "RESET_CIRCUIT",
            affectedRouteKeys: ["agentic-testing:intent"],
            snapshot: {
              ...mockSnapshot,
              status: "HEALTHY",
              summary: { ...mockSnapshot.summary, openCircuits: 0 },
              routes: mockSnapshot.routes.map((route) =>
                route.routeKey === "agentic-testing:intent"
                  ? {
                      ...route,
                      circuit: {
                        ...route.circuit,
                        state: "CLOSED",
                        failures: 0,
                        remainingCooldownMs: 0,
                      },
                    }
                  : route,
              ),
            },
          }),
          { status: 200 },
        );
      }

      return new Response(JSON.stringify(mockSnapshot), { status: 200 });
    }) as unknown as typeof fetch;
  });

  it("renders summary KPIs, route cards, and triggers idempotent RESET_CIRCUIT", async () => {
    render(<AiBridgeHealthDashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId("kpi-total-routes").textContent).toBe("2");
    });

    expect(screen.getByTestId("ai-bridge-global-status").textContent).toBe(
      "DEGRADED",
    );
    expect(screen.getByTestId("kpi-open-circuits").textContent).toBe("1");
    expect(screen.getByTestId("kpi-pii-redacted").textContent).toBe("4");
    expect(screen.getByTestId("route-card-stateflow:intent")).toBeDefined();
    expect(
      screen.getByTestId("route-card-agentic-testing:intent"),
    ).toBeDefined();

    await act(async () => {
      fireEvent.click(
        screen.getByTestId("reset-circuit-agentic-testing:intent"),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("ai-bridge-action-note").textContent).toContain(
        "RESET_CIRCUIT applied to agentic-testing:intent",
      );
    });
    expect(screen.getByTestId("kpi-open-circuits").textContent).toBe("0");
  });
});
