"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Database,
  DollarSign,
  History,
  KeyRound,
  RefreshCw,
  RotateCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { AiBridgeHealthSnapshot } from "@/app/lib/ai/healthContract";

type StatusFilter = "ALL" | "OPEN" | "CLOSED";
type AuditSource = "hot" | "archive";
type BridgeControlAction =
  | "RESET_CIRCUIT"
  | "RESET_TELEMETRY"
  | "ARCHIVE_FLUSH"
  | "RESET_DAILY_BUDGET";

export default function AiBridgeHealthDashboardPage() {
  const [snapshot, setSnapshot] = useState<AiBridgeHealthSnapshot | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [auditRouteFilter, setAuditRouteFilter] = useState<string>("ALL");
  const [auditSource, setAuditSource] = useState<AuditSource>("hot");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [lastActionNote, setLastActionNote] = useState<string | null>(null);

  const fetchSnapshot = useCallback(
    async (filter: StatusFilter, source: AuditSource) => {
      setIsLoading(true);
      setErrorBanner(null);
      try {
        const response = await fetch(
          `/api/health/ai-bridge?status=${encodeURIComponent(filter)}&auditSource=${encodeURIComponent(source)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );
        if (!response.ok) {
          const problem = (await response.json()) as { detail?: string };
          throw new Error(problem.detail ?? `HTTP ${response.status}`);
        }
        const data = (await response.json()) as AiBridgeHealthSnapshot;
        setSnapshot(data);
      } catch (err) {
        setErrorBanner(
          err instanceof Error
            ? err.message
            : "Failed to fetch AI Bridge health",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchSnapshot(statusFilter, auditSource);
  }, [fetchSnapshot, statusFilter, auditSource]);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      void fetchSnapshot(statusFilter, auditSource);
    }, 5_000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchSnapshot, statusFilter, auditSource]);

  const executeControlAction = async (
    action: BridgeControlAction,
    routeKey?: string,
  ) => {
    setIsMutating(true);
    setErrorBanner(null);
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (adminToken.trim().length > 0) {
        headers["x-ai-bridge-admin-token"] = adminToken.trim();
      }
      const response = await fetch("/api/health/ai-bridge", {
        method: "POST",
        headers,
        body: JSON.stringify(routeKey ? { action, routeKey } : { action }),
      });
      if (!response.ok) {
        const problem = (await response.json()) as { detail?: string };
        throw new Error(problem.detail ?? `HTTP ${response.status}`);
      }
      const result = (await response.json()) as {
        actionApplied: string;
        authorizedBy?: string;
        affectedRouteKeys: string[];
        archivedCount?: number;
        snapshot: AiBridgeHealthSnapshot;
      };
      const archivedSuffix =
        typeof result.archivedCount === "number"
          ? ` | ${result.archivedCount} archived`
          : "";
      setLastActionNote(
        `${result.actionApplied} applied to ${routeKey ?? `${result.affectedRouteKeys.length} routes`}${result.authorizedBy ? ` (${result.authorizedBy})` : ""}${archivedSuffix}`,
      );
      if (statusFilter === "ALL" && auditSource === "hot") {
        setSnapshot(result.snapshot);
      } else {
        await fetchSnapshot(statusFilter, auditSource);
      }
    } catch (err) {
      setErrorBanner(
        err instanceof Error ? err.message : "Failed to execute bridge action",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const globalStatus = snapshot?.status ?? "DEGRADED";
  const statusStyles =
    globalStatus === "HEALTHY"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
      : globalStatus === "CRITICAL"
        ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700"
        : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Global Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              AI Bridge Health Observatory
            </h1>
            <span
              data-testid="ai-bridge-global-status"
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${statusStyles}`}
            >
              {globalStatus}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time Circuit Breaker state, Fallback diagnostics, Server PII
            Firewall metrics, and latency across all registered LLM routes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchSnapshot(statusFilter, auditSource)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Snapshot
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition ${
              autoRefresh
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Auto-Refresh (5s): {autoRefresh ? "ON" : "OFF"}
          </button>

          <button
            type="button"
            onClick={() => void executeControlAction("RESET_CIRCUIT")}
            disabled={isMutating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Circuits
          </button>

          <button
            type="button"
            onClick={() => void executeControlAction("RESET_TELEMETRY")}
            disabled={isMutating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition disabled:opacity-50"
          >
            Reset Telemetry
          </button>

          <button
            type="button"
            data-testid="flush-archive-btn"
            onClick={() => void executeControlAction("ARCHIVE_FLUSH")}
            disabled={isMutating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition disabled:opacity-50"
          >
            <Archive className="w-3.5 h-3.5" />
            Flush Archive
          </button>

          <button
            type="button"
            data-testid="reset-budget-btn"
            onClick={() => void executeControlAction("RESET_DAILY_BUDGET")}
            disabled={isMutating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition disabled:opacity-50"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Reset Daily Budget
          </button>
        </div>
      </div>

      {/* Environment Readiness & Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-1.5 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>Gemini API Key:</span>
            <span
              data-testid="env-gemini-status"
              className={
                snapshot?.environment.geminiKeyConfigured
                  ? "text-emerald-600 font-semibold"
                  : "text-amber-600 font-semibold"
              }
            >
              {snapshot?.environment.geminiKeyConfigured
                ? "CONFIGURED"
                : "MISSING (FALLBACK READY)"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
            <span>LINE GLM Key:</span>
            <span
              data-testid="env-glm-status"
              className={
                snapshot?.environment.glmKeyConfigured
                  ? "text-emerald-600 font-semibold"
                  : "text-amber-600 font-semibold"
              }
            >
              {snapshot?.environment.glmKeyConfigured
                ? "CONFIGURED"
                : "MISSING (FALLBACK READY)"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Admin Guard:</span>
            <span
              data-testid="env-admin-guard-status"
              className={
                snapshot?.environment.adminGuardEnforced
                  ? "text-indigo-600 font-semibold"
                  : "text-emerald-600 font-semibold"
              }
            >
              {snapshot?.environment.adminGuardEnforced
                ? "ENFORCED"
                : "LOCAL_DEV_OPEN"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>State Store:</span>
            <span
              data-testid="env-persistence-status"
              className={
                snapshot?.persistence.driver === "redis" &&
                snapshot.persistence.connected
                  ? "text-emerald-600 font-semibold"
                  : snapshot?.persistence.driver === "redis"
                    ? "text-amber-600 font-semibold"
                    : "text-slate-700 dark:text-slate-300 font-semibold"
              }
            >
              {snapshot?.persistence.driver === "redis"
                ? snapshot.persistence.connected
                  ? "REDIS_SYNCED"
                  : "REDIS_FAIL_OPEN"
                : "MEMORY_RING_BUFFER"}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono">
            <Archive className="w-3.5 h-3.5 text-slate-500" />
            <span>Cold Archive:</span>
            <span
              data-testid="env-archive-status"
              className={
                snapshot?.archive.driver === "prisma" &&
                snapshot.archive.connected
                  ? "text-emerald-600 font-semibold"
                  : snapshot?.archive.driver === "prisma"
                    ? "text-amber-600 font-semibold"
                    : "text-slate-700 dark:text-slate-300 font-semibold"
              }
            >
              {snapshot?.archive.driver === "prisma"
                ? snapshot.archive.connected
                  ? "PRISMA_ARCHIVE_SYNCED"
                  : "PRISMA_FAIL_OPEN"
                : snapshot?.archive.driver === "memory"
                  ? "MEMORY_ARCHIVE"
                  : "ARCHIVE_DISABLED"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password"
            data-testid="admin-token-input"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Optional Admin Token (x-ai-bridge-admin-token)"
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {(["ALL", "OPEN", "CLOSED"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md font-mono text-xs transition ${
                  statusFilter === tab
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorBanner && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorBanner}</span>
        </div>
      )}

      {lastActionNote && (
        <div
          data-testid="ai-bridge-action-note"
          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{lastActionNote}</span>
        </div>
      )}

      {/* FinOps Daily Budget Quota Card */}
      <div
        data-testid="finops-budget-card"
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              FinOps Daily Budget Guardrail ({snapshot?.finops.dateKey ?? "UTC"}
              )
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                snapshot?.finops.isBudgetExceeded
                  ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700"
                  : snapshot?.finops.enforced
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                    : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
              }`}
            >
              {snapshot?.finops.isBudgetExceeded
                ? "BUDGET_EXCEEDED"
                : snapshot?.finops.enforced
                  ? "GUARD_ACTIVE"
                  : "UNENFORCED"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300">
            <span data-testid="finops-tokens-used">
              Tokens: {(snapshot?.finops.tokensUsed ?? 0).toLocaleString()} /{" "}
              {(snapshot?.finops.dailyTokenLimit ?? 0).toLocaleString()}
            </span>
            <span data-testid="finops-estimated-cost">
              Est. Cost: ${(snapshot?.finops.estimatedCostUsd ?? 0).toFixed(4)}{" "}
              / ${(snapshot?.finops.dailyCostUsdLimit ?? 0).toFixed(2)}
            </span>
            <span>{snapshot?.finops.budgetUtilizationPct ?? 0}% used</span>
          </div>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <div
            data-testid="finops-usage-bar"
            className={`h-full transition-all ${
              (snapshot?.finops.budgetUtilizationPct ?? 0) >= 100
                ? "bg-rose-600"
                : (snapshot?.finops.budgetUtilizationPct ?? 0) >= 70
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{
              width: `${Math.min(100, Math.max(0, snapshot?.finops.budgetUtilizationPct ?? 0))}%`,
            }}
          />
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500">Tracked Routes</div>
          <div
            data-testid="kpi-total-routes"
            className="text-2xl font-bold mt-1 font-mono"
          >
            {snapshot?.summary.totalRoutes ?? 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500">Open Circuits</div>
          <div
            data-testid="kpi-open-circuits"
            className={`text-2xl font-bold mt-1 font-mono ${
              (snapshot?.summary.openCircuits ?? 0) > 0
                ? "text-rose-600"
                : "text-emerald-600"
            }`}
          >
            {snapshot?.summary.openCircuits ?? 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500">Total Requests</div>
          <div
            data-testid="kpi-total-requests"
            className="text-2xl font-bold mt-1 font-mono"
          >
            {snapshot?.summary.totalRequests ?? 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500">PII Tokens Redacted</div>
          <div
            data-testid="kpi-pii-redacted"
            className="text-2xl font-bold mt-1 font-mono text-indigo-600"
          >
            {snapshot?.summary.totalPiiRedacted ?? 0}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500">Avg Latency</div>
          <div
            data-testid="kpi-avg-latency"
            className="text-2xl font-bold mt-1 font-mono"
          >
            {snapshot?.summary.avgLatencyMs ?? 0} ms
          </div>
        </div>
      </div>

      {/* Per-Route Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {snapshot?.routes.map((route) => {
          const isOpen = route.circuit.state === "OPEN";
          return (
            <div
              key={route.routeKey}
              data-testid={`route-card-${route.routeKey}`}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600" />
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                      {route.routeKey}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      {route.provider}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {route.endpoint}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {route.description}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border shrink-0 ${
                    isOpen
                      ? "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700"
                      : "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700"
                  }`}
                >
                  {isOpen ? (
                    <ShieldAlert className="w-3.5 h-3.5" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  {route.circuit.state}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                <div>
                  <div className="text-slate-400">Requests</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {route.telemetry.totalRequests}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Live / Fallback</div>
                  <div className="font-semibold">
                    <span className="text-emerald-600">
                      {route.telemetry.liveSuccessCount}
                    </span>
                    {" / "}
                    <span className="text-amber-600">
                      {route.telemetry.fallbackCount}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">PII Masked</div>
                  <div className="font-semibold text-indigo-600">
                    {route.telemetry.piiRedactedCount}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Tokens / Latency</div>
                  <div className="font-semibold">
                    {route.telemetry.totalTokens.toLocaleString()} /{" "}
                    {route.telemetry.avgLatencyMs} ms
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                <div>
                  Failures: {route.circuit.failures}/
                  {route.circuit.failureThreshold}
                  {route.circuit.remainingCooldownMs > 0
                    ? ` | Cooldown: ${Math.ceil(route.circuit.remainingCooldownMs / 1000)}s`
                    : ""}
                  {route.telemetry.lastFallbackReason
                    ? ` | Last Reason: ${route.telemetry.lastFallbackReason}`
                    : ""}
                </div>
                <button
                  type="button"
                  data-testid={`reset-circuit-${route.routeKey}`}
                  onClick={() =>
                    void executeControlAction("RESET_CIRCUIT", route.routeKey)
                  }
                  disabled={isMutating}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Circuit
                </button>
              </div>
            </div>
          );
        })}

        {snapshot && snapshot.routes.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-500">
            No routes match filter status {statusFilter}.
          </div>
        )}
      </div>

      {/* Zero-Raw-PII Recent Audit Trail */}
      <section
        data-testid="ai-bridge-audit-section"
        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Audit Trail (Zero Raw PII)
            </h2>
            <span
              data-testid="audit-event-count"
              className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300"
            >
              {auditSource === "archive"
                ? `${snapshot?.archive.archivedEventCount ?? 0} archived`
                : `${snapshot?.persistence.auditEventCount ?? 0} total buffered`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              data-testid="audit-source-select"
              value={auditSource}
              onChange={(e) => setAuditSource(e.target.value as AuditSource)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hot">HOT BUFFER</option>
              <option value="archive">COLD ARCHIVE</option>
            </select>

            <select
              data-testid="audit-route-filter"
              value={auditRouteFilter}
              onChange={(e) => setAuditRouteFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ALL ROUTES</option>
              {snapshot?.routes.map((route) => (
                <option key={route.routeKey} value={route.routeKey}>
                  {route.routeKey}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(() => {
          const auditRows = (snapshot?.recentAuditEvents ?? []).filter((ev) =>
            auditRouteFilter === "ALL"
              ? true
              : ev.routeKey === auditRouteFilter,
          );
          if (auditRows.length === 0) {
            return (
              <div className="text-center py-6 text-xs font-mono text-slate-500">
                No audit events recorded yet for this filter.
              </div>
            );
          }
          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 pr-3">Event</th>
                    <th className="py-2 pr-3">Route</th>
                    <th className="py-2 pr-3">Outcome / PII</th>
                    <th className="py-2 pr-3">Tokens</th>
                    <th className="py-2 pr-3">Actor</th>
                    <th className="py-2">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {auditRows.slice(0, 20).map((ev) => (
                    <tr
                      key={ev.id}
                      data-testid={`audit-row-${ev.eventType}`}
                      className="text-slate-700 dark:text-slate-300"
                    >
                      <td className="py-2 pr-3 font-semibold">
                        {ev.eventType}
                      </td>
                      <td className="py-2 pr-3">{ev.routeKey}</td>
                      <td className="py-2 pr-3">
                        {ev.outcome
                          ? `${ev.outcome}${ev.fallbackReason ? ` (${ev.fallbackReason})` : ""}`
                          : ev.piiRedactedCount
                            ? `${ev.piiRedactedCount} redacted`
                            : "-"}
                      </td>
                      <td className="py-2 pr-3">
                        {typeof ev.totalTokens === "number" &&
                        ev.totalTokens > 0
                          ? ev.totalTokens.toLocaleString()
                          : "-"}
                      </td>
                      <td className="py-2 pr-3">{ev.actor ?? "SYSTEM"}</td>
                      <td className="py-2 text-slate-500">
                        {ev.detail ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
