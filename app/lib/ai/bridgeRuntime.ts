import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { z } from "zod";
import {
  KNOWN_AI_BRIDGE_ROUTES,
  type AiBridgeGlobalStatus,
  type AiBridgeHealthSnapshot,
  type AiBridgeRouteHealthEntry,
} from "@/app/lib/ai/healthContract";

export type AiExecutionMode = "AUTO" | "LOCAL_ONLY";

export type AiRuntimeSource =
  | "IDLE"
  | "LIVE_GEMINI"
  | "LOCAL_FALLBACK"
  | "LOCAL_ONLY";

export type BridgeCircuitState = "CLOSED" | "OPEN";

export type BridgeFallbackReason =
  | "MISSING_API_KEY"
  | "CIRCUIT_OPEN"
  | "UPSTREAM_ERROR"
  | "TIMEOUT";

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  cooldownMs?: number;
}

export interface CircuitBreakerStats {
  state: BridgeCircuitState;
  failures: number;
  failureThreshold: number;
  remainingCooldownMs: number;
}

export class BridgeCircuitBreaker {
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private failures = 0;
  private openedAt: number | null = null;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.cooldownMs = options.cooldownMs ?? 60_000;
  }

  canAttempt(now = Date.now()): boolean {
    if (this.openedAt === null) {
      return true;
    }
    if (now - this.openedAt >= this.cooldownMs) {
      // Allow half-open recovery probe after cooldown expires
      this.openedAt = null;
      this.failures = Math.max(0, this.failureThreshold - 1);
      return true;
    }
    return false;
  }

  recordSuccess(): void {
    this.failures = 0;
    this.openedAt = null;
  }

  recordFailure(now = Date.now()): BridgeCircuitState {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.openedAt = now;
      return "OPEN";
    }
    return "CLOSED";
  }

  getState(now = Date.now()): BridgeCircuitState {
    if (this.openedAt === null) return "CLOSED";
    if (now - this.openedAt >= this.cooldownMs) return "CLOSED";
    return "OPEN";
  }

  getStats(now = Date.now()): CircuitBreakerStats {
    const state = this.getState(now);
    const remainingCooldownMs =
      state === "OPEN" && this.openedAt !== null
        ? Math.max(0, this.cooldownMs - (now - this.openedAt))
        : 0;
    return {
      state,
      failures: this.failures,
      failureThreshold: this.failureThreshold,
      remainingCooldownMs,
    };
  }

  reset(): void {
    this.failures = 0;
    this.openedAt = null;
  }
}

interface RouteTelemetryRecord {
  totalRequests: number;
  liveSuccessCount: number;
  fallbackCount: number;
  timeoutCount: number;
  missingKeyCount: number;
  circuitOpenRejectedCount: number;
  upstreamErrorCount: number;
  piiRedactedCount: number;
  totalLatencyMs: number;
  lastLatencyMs: number | null;
  lastOutcome: "IDLE" | "LIVE_GEMINI" | "FALLBACK_TRIGGERED";
  lastFallbackReason: BridgeFallbackReason | null;
  lastUpdatedAt: string | null;
}

const routeCircuits = new Map<string, BridgeCircuitBreaker>();
const routeTelemetry = new Map<string, RouteTelemetryRecord>();

function createEmptyTelemetryRecord(): RouteTelemetryRecord {
  return {
    totalRequests: 0,
    liveSuccessCount: 0,
    fallbackCount: 0,
    timeoutCount: 0,
    missingKeyCount: 0,
    circuitOpenRejectedCount: 0,
    upstreamErrorCount: 0,
    piiRedactedCount: 0,
    totalLatencyMs: 0,
    lastLatencyMs: null,
    lastOutcome: "IDLE",
    lastFallbackReason: null,
    lastUpdatedAt: null,
  };
}

function getOrCreateTelemetryRecord(routeKey: string): RouteTelemetryRecord {
  let record = routeTelemetry.get(routeKey);
  if (!record) {
    record = createEmptyTelemetryRecord();
    routeTelemetry.set(routeKey, record);
  }
  return record;
}

export function getRouteCircuitBreaker(routeKey: string): BridgeCircuitBreaker {
  let breaker = routeCircuits.get(routeKey);
  if (!breaker) {
    breaker = new BridgeCircuitBreaker();
    routeCircuits.set(routeKey, breaker);
  }
  return breaker;
}

export function resetAllBridgeCircuits(): void {
  routeCircuits.clear();
  routeTelemetry.clear();
}

export function resetRouteBridgeCircuit(routeKey?: string): string[] {
  if (routeKey) {
    getRouteCircuitBreaker(routeKey).reset();
    return [routeKey];
  }

  const affected = new Set<string>(
    KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
  );
  for (const key of routeCircuits.keys()) {
    affected.add(key);
  }
  for (const key of affected) {
    getRouteCircuitBreaker(key).reset();
  }
  return Array.from(affected);
}

export function resetBridgeTelemetry(routeKey?: string): string[] {
  if (routeKey) {
    routeTelemetry.set(routeKey, createEmptyTelemetryRecord());
    return [routeKey];
  }

  const affected = new Set<string>(
    KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
  );
  for (const key of routeTelemetry.keys()) {
    affected.add(key);
  }
  routeTelemetry.clear();
  return Array.from(affected);
}

export function recordBridgePiiRedactions(
  routeKey: string,
  redactionCount: number,
): void {
  if (redactionCount <= 0) return;
  const record = getOrCreateTelemetryRecord(routeKey);
  record.piiRedactedCount += redactionCount;
  record.lastUpdatedAt = new Date().toISOString();
}

export function hasGoogleGeminiKey(): boolean {
  const key =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim();
  return typeof key === "string" && key.length > 0;
}

export function hasGlmLineKey(): boolean {
  const key = (
    process.env.GLM_API_KEY ||
    process.env.gGLM_API_KEY ||
    ""
  ).trim();
  return key.length > 0 && key !== "dummy_key_for_build";
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strips emails, phone numbers, Thai 13-digit national IDs, Thai honorific names,
 * and explicit employee sensitive tokens before data crosses an external LLM boundary.
 */
export function redactPiiString(
  input: string,
  extraSensitiveTokens: string[] = [],
  options?: { routeKey?: string },
): { sanitized: string; redactions: number } {
  let sanitized = input;
  let redactions = 0;

  const replaceWithCount = (pattern: RegExp, token: string) => {
    sanitized = sanitized.replace(pattern, () => {
      redactions += 1;
      return token;
    });
  };

  // 1. Formatted Thai ID (1-2345-67890-12-3) & continuous 13-digit numeric ID
  replaceWithCount(/\b\d-\d{4}-\d{5}-\d{2}-\d\b/g, "[REDACTED_THAI_ID]");
  replaceWithCount(/(?<!\d)\d{13}(?!\d)/g, "[REDACTED_THAI_ID]");

  // 2. Email addresses
  replaceWithCount(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
    "[REDACTED_EMAIL]",
  );

  // 3. Thai / International mobile & office phone numbers
  replaceWithCount(
    /(?:\+66|0)[689]\d{1}[-\s]?\d{3}[-\s]?\d{4}/g,
    "[REDACTED_PHONE]",
  );

  // 4. Explicit sensitive tokens (e.g., raw employee full names, nicknames)
  const cleanTokens = Array.from(
    new Set(
      extraSensitiveTokens.map((t) => t.trim()).filter((t) => t.length >= 2),
    ),
  ).sort((a, b) => b.length - a.length);

  for (const token of cleanTokens) {
    const pattern = new RegExp(escapeRegExp(token), "gi");
    replaceWithCount(pattern, "[REDACTED_NAME]");
  }

  // 5. Common Thai honorific prefix + personal name patterns (with or without space after prefix)
  replaceWithCount(
    /(?:นาย|นางสาว|นาง)\s*[\u0E01-\u0E4EA-Za-z]{2,}(?:[ \t]+[\u0E01-\u0E4EA-Za-z]{2,})?/g,
    "[REDACTED_NAME]",
  );

  if (options?.routeKey && redactions > 0) {
    recordBridgePiiRedactions(options.routeKey, redactions);
  }

  return { sanitized, redactions };
}

/**
 * Recursively redacts PII fields inside any structured payload before LLM serialization.
 */
export function redactPiiPayload<T>(
  value: T,
  extraSensitiveTokens: string[] = [],
  options?: { routeKey?: string },
): { sanitized: T; redactionCount: number } {
  let total = 0;

  const walk = (node: unknown): unknown => {
    if (typeof node === "string") {
      const { sanitized, redactions } = redactPiiString(
        node,
        extraSensitiveTokens,
      );
      total += redactions;
      return sanitized;
    }
    if (Array.isArray(node)) {
      return node.map((item) => walk(item));
    }
    if (node !== null && typeof node === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(node)) {
        result[key] = walk(val);
      }
      return result;
    }
    return node;
  };

  const sanitizedPayload = walk(value) as T;
  if (options?.routeKey && total > 0) {
    recordBridgePiiRedactions(options.routeKey, total);
  }

  return {
    sanitized: sanitizedPayload,
    redactionCount: total,
  };
}

export type ExecuteGeminiBridgeResult<T> =
  | {
      ok: true;
      source: "LIVE_GEMINI";
      data: T;
      circuitState: "CLOSED";
      latencyMs: number;
    }
  | {
      ok: false;
      source: "FALLBACK_TRIGGERED";
      reason: BridgeFallbackReason;
      detail: string;
      circuitState: BridgeCircuitState;
      latencyMs: number;
    };

function recordBridgeOutcome(params: {
  routeKey: string;
  outcome: "LIVE_GEMINI" | "FALLBACK_TRIGGERED";
  latencyMs: number;
  reason?: BridgeFallbackReason;
}): void {
  const record = getOrCreateTelemetryRecord(params.routeKey);
  record.totalRequests += 1;
  record.totalLatencyMs += Math.max(0, params.latencyMs);
  record.lastLatencyMs = Math.max(0, params.latencyMs);
  record.lastOutcome = params.outcome;
  record.lastUpdatedAt = new Date().toISOString();

  if (params.outcome === "LIVE_GEMINI") {
    record.liveSuccessCount += 1;
    record.lastFallbackReason = null;
    return;
  }

  record.fallbackCount += 1;
  record.lastFallbackReason = params.reason ?? "UPSTREAM_ERROR";
  if (params.reason === "MISSING_API_KEY") {
    record.missingKeyCount += 1;
  } else if (params.reason === "CIRCUIT_OPEN") {
    record.circuitOpenRejectedCount += 1;
  } else if (params.reason === "TIMEOUT") {
    record.timeoutCount += 1;
  } else {
    record.upstreamErrorCount += 1;
  }
}

/**
 * Shared circuit breaker + timeout executor for streaming/chat/external LLM handlers.
 * Handles missing API keys, open circuits, AbortController timeouts, and outcome recording.
 */
export async function runWithCircuitGuard<T>(params: {
  routeKey: string;
  hasKey?: boolean;
  timeoutMs?: number;
  execute: (abortSignal: AbortSignal) => Promise<T>;
}): Promise<ExecuteGeminiBridgeResult<T>> {
  const startedAt = Date.now();
  const breaker = getRouteCircuitBreaker(params.routeKey);
  const keyAvailable = params.hasKey ?? hasGoogleGeminiKey();

  if (!keyAvailable) {
    const latencyMs = Date.now() - startedAt;
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason: "MISSING_API_KEY",
      latencyMs,
    });
    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: "MISSING_API_KEY",
      detail:
        "GOOGLE_GENERATIVE_AI_API_KEY is not configured; using deterministic local engine.",
      circuitState: breaker.getState(startedAt),
      latencyMs,
    };
  }

  if (!breaker.canAttempt(startedAt)) {
    const latencyMs = Date.now() - startedAt;
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason: "CIRCUIT_OPEN",
      latencyMs,
    });
    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: "CIRCUIT_OPEN",
      detail:
        "Circuit breaker is OPEN due to repeated upstream failures; serving local fallback.",
      circuitState: "OPEN",
      latencyMs,
    };
  }

  const timeoutMs = params.timeoutMs ?? 12_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const data = await Promise.race([
      params.execute(controller.signal),
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener(
          "abort",
          () => reject(new Error("BRIDGE_TIMEOUT")),
          { once: true },
        );
      }),
    ]);

    breaker.recordSuccess();
    const latencyMs = Date.now() - startedAt;
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "LIVE_GEMINI",
      latencyMs,
    });
    return {
      ok: true,
      source: "LIVE_GEMINI",
      data,
      circuitState: "CLOSED",
      latencyMs,
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    const circuitState = breaker.recordFailure();
    const isTimeout =
      detail.includes("BRIDGE_TIMEOUT") ||
      detail.toLowerCase().includes("abort");
    const reason: BridgeFallbackReason = isTimeout
      ? "TIMEOUT"
      : "UPSTREAM_ERROR";
    const latencyMs = Date.now() - startedAt;

    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason,
      latencyMs,
    });

    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason,
      detail,
      circuitState,
      latencyMs,
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function executeGeminiBridge<
  TSchema extends z.ZodTypeAny,
>(params: {
  routeKey: string;
  schema: TSchema;
  system: string;
  prompt: string;
  timeoutMs?: number;
  modelName?: string;
}): Promise<ExecuteGeminiBridgeResult<z.infer<TSchema>>> {
  return runWithCircuitGuard({
    routeKey: params.routeKey,
    timeoutMs: params.timeoutMs,
    execute: async (abortSignal) => {
      const result = await generateObject({
        model: google(params.modelName ?? "gemini-2.5-flash"),
        schema: params.schema,
        system: params.system,
        prompt: params.prompt,
        abortSignal,
      });
      return result.object as z.infer<TSchema>;
    },
  });
}

export function getAiBridgeHealthSnapshot(filters?: {
  routeKey?: string;
  status?: "ALL" | "OPEN" | "CLOSED";
}): AiBridgeHealthSnapshot {
  const now = Date.now();
  const knownMap = new Map(
    KNOWN_AI_BRIDGE_ROUTES.map((descriptor) => [
      descriptor.routeKey,
      descriptor,
    ]),
  );

  const orderedRouteKeys = new Set<string>(
    KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
  );
  for (const key of routeCircuits.keys()) {
    orderedRouteKeys.add(key);
  }
  for (const key of routeTelemetry.keys()) {
    orderedRouteKeys.add(key);
  }

  const allEntries: AiBridgeRouteHealthEntry[] = [];
  for (const routeKey of orderedRouteKeys) {
    const meta = knownMap.get(routeKey);
    const circuitStats = getRouteCircuitBreaker(routeKey).getStats(now);
    const telemetry =
      routeTelemetry.get(routeKey) ?? createEmptyTelemetryRecord();
    const avgLatencyMs =
      telemetry.totalRequests > 0
        ? Math.round(telemetry.totalLatencyMs / telemetry.totalRequests)
        : 0;

    allEntries.push({
      routeKey,
      endpoint: meta?.endpoint ?? `/api/custom/${routeKey}`,
      provider: meta?.provider ?? "gemini",
      description: meta?.description ?? "Dynamic AI bridge route handler",
      circuit: circuitStats,
      telemetry: {
        totalRequests: telemetry.totalRequests,
        liveSuccessCount: telemetry.liveSuccessCount,
        fallbackCount: telemetry.fallbackCount,
        timeoutCount: telemetry.timeoutCount,
        missingKeyCount: telemetry.missingKeyCount,
        circuitOpenRejectedCount: telemetry.circuitOpenRejectedCount,
        upstreamErrorCount: telemetry.upstreamErrorCount,
        piiRedactedCount: telemetry.piiRedactedCount,
        avgLatencyMs,
        lastLatencyMs: telemetry.lastLatencyMs,
        lastOutcome: telemetry.lastOutcome,
        lastFallbackReason: telemetry.lastFallbackReason,
        lastUpdatedAt: telemetry.lastUpdatedAt,
      },
    });
  }

  const openCircuitsAll = allEntries.filter(
    (entry) => entry.circuit.state === "OPEN",
  ).length;
  const geminiKeyConfigured = hasGoogleGeminiKey();
  const glmKeyConfigured = hasGlmLineKey();
  const hasRecentFallback = allEntries.some(
    (entry) => entry.telemetry.fallbackCount > 0,
  );

  let status: AiBridgeGlobalStatus = "HEALTHY";
  if (openCircuitsAll > 0) {
    status = "CRITICAL";
  } else if (!geminiKeyConfigured || !glmKeyConfigured || hasRecentFallback) {
    status = "DEGRADED";
  }

  const filteredEntries = allEntries.filter((entry) => {
    if (filters?.routeKey && entry.routeKey !== filters.routeKey) {
      return false;
    }
    if (
      filters?.status &&
      filters.status !== "ALL" &&
      entry.circuit.state !== filters.status
    ) {
      return false;
    }
    return true;
  });

  let totalRequests = 0;
  let liveSuccessCount = 0;
  let fallbackCount = 0;
  let totalPiiRedacted = 0;
  let weightedLatencySum = 0;

  for (const entry of filteredEntries) {
    totalRequests += entry.telemetry.totalRequests;
    liveSuccessCount += entry.telemetry.liveSuccessCount;
    fallbackCount += entry.telemetry.fallbackCount;
    totalPiiRedacted += entry.telemetry.piiRedactedCount;
    weightedLatencySum +=
      entry.telemetry.avgLatencyMs * entry.telemetry.totalRequests;
  }

  const openCircuits = filteredEntries.filter(
    (entry) => entry.circuit.state === "OPEN",
  ).length;
  const avgLatencyMs =
    totalRequests > 0 ? Math.round(weightedLatencySum / totalRequests) : 0;

  return {
    version: "1.0",
    status,
    timestamp: new Date(now).toISOString(),
    environment: {
      geminiKeyConfigured,
      glmKeyConfigured,
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
    summary: {
      totalRoutes: filteredEntries.length,
      openCircuits,
      closedCircuits: filteredEntries.length - openCircuits,
      totalRequests,
      liveSuccessCount,
      fallbackCount,
      totalPiiRedacted,
      avgLatencyMs,
    },
    routes: filteredEntries,
  };
}
