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
    adminGuardEnforced: true,
    nodeEnv: "test",
  },
  persistence: {
    driver: "memory",
    connected: true,
    auditEventCount: 2,
  },
  finops: {
    dateKey: "2026-11-14",
    enforced: true,
    dailyTokenLimit: 500_000,
    tokensUsed: 1200,
    remainingTokens: 498_800,
    dailyCostUsdLimit: 2.0,
    estimatedCostUsd: 0.0012,
    budgetUtilizationPct: 0.2,
    isBudgetExceeded: false,
  },
  archive: {
    driver: "memory",
    connected: true,
    archivedEventCount: 2,
    lastArchivedAt: "2026-11-14T05:00:00.000Z",
  },
  summary: {
    totalRoutes: 2,
    openCircuits: 1,
    closedCircuits: 1,
    totalRequests: 7,
    liveSuccessCount: 2,
    fallbackCount: 5,
    totalPiiRedacted: 4,
    totalTokens: 1200,
    estimatedCostUsd: 0.0012,
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
        budgetExceededCount: 0,
        upstreamErrorCount: 0,
        piiRedactedCount: 4,
        totalTokens: 1200,
        estimatedCostUsd: 0.0012,
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
        budgetExceededCount: 0,
        upstreamErrorCount: 3,
        piiRedactedCount: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        avgLatencyMs: 25,
        lastLatencyMs: 10,
        lastOutcome: "FALLBACK_TRIGGERED",
        lastFallbackReason: "CIRCUIT_OPEN",
        lastUpdatedAt: "2026-11-14T05:00:00.000Z",
      },
    },
  ],
  recentAuditEvents: [
    {
      id: "ev-1",
      timestamp: "2026-11-14T05:00:00.000Z",
      routeKey: "stateflow:intent",
      eventType: "PII_REDACTED",
      piiRedactedCount: 2,
      detail: "Scrubbed 2 sensitive token(s) pre-egress",
    },
    {
      id: "ev-2",
      timestamp: "2026-11-14T05:00:01.000Z",
      routeKey: "agentic-testing:intent",
      eventType: "CIRCUIT_OPENED",
      outcome: "FALLBACK_TRIGGERED",
      fallbackReason: "UPSTREAM_ERROR",
      latencyMs: 25,
      detail: "Circuit tripped OPEN after UPSTREAM_ERROR",
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
    expect(screen.getByTestId("env-admin-guard-status").textContent).toBe(
      "ENFORCED",
    );
    expect(screen.getByTestId("env-persistence-status").textContent).toBe(
      "MEMORY_RING_BUFFER",
    );
    expect(screen.getByTestId("env-archive-status").textContent).toBe(
      "MEMORY_ARCHIVE",
    );
    expect(screen.getByTestId("finops-budget-card")).toBeDefined();
    expect(screen.getByTestId("finops-tokens-used").textContent).toContain(
      "1,200 / 500,000",
    );
    expect(screen.getByTestId("audit-source-select")).toBeDefined();
    expect(screen.getByTestId("ai-bridge-audit-section")).toBeDefined();
    expect(screen.getByTestId("audit-event-count").textContent).toContain("2");
    expect(screen.getByTestId("kpi-open-circuits").textContent).toBe("1");
    expect(screen.getByTestId("kpi-pii-redacted").textContent).toBe("4");
    expect(screen.getByTestId("route-card-stateflow:intent")).toBeDefined();
    expect(
      screen.getByTestId("route-card-agentic-testing:intent"),
    ).toBeDefined();

    fireEvent.change(screen.getByTestId("admin-token-input"), {
      target: { value: "ops-token-123" },
    });

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
