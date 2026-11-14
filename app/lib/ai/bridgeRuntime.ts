import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { z } from "zod";
import { getBridgeArchiveRepository } from "@/app/lib/ai/auditArchive";
import {
  KNOWN_AI_BRIDGE_ROUTES,
  calculateModelCostMicros,
  getAiBridgeFinOpsPolicy,
  getUtcDateKey,
  isAiBridgeAdminGuardEnforced,
  microsToUsd,
  type AiBridgeArchiveStatus,
  type AiBridgeAuditEvent,
  type AiBridgeAuditEventType,
  type AiBridgeFinOpsSummary,
  type AiBridgeGlobalStatus,
  type AiBridgeHealthSnapshot,
  type AiBridgeRouteHealthEntry,
} from "@/app/lib/ai/healthContract";
import {
  getBridgeStateStore,
  type DailyBudgetUsage,
  type PersistedCircuitState,
} from "@/app/lib/ai/stateStore";

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
  | "BUDGET_EXCEEDED"
  | "UPSTREAM_ERROR"
  | "TIMEOUT";

export interface TokenUsageInput {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface NormalizedTokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface BridgeExecuteHelpers {
  reportUsage: (usage: TokenUsageInput) => void;
}

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

  getCooldownMs(): number {
    return this.cooldownMs;
  }

  exportState(now = Date.now()): PersistedCircuitState {
    return {
      failures: this.failures,
      openedAt: this.openedAt,
      updatedAtMs: now,
    };
  }

  hydrate(state: PersistedCircuitState, now = Date.now()): void {
    if (state.openedAt !== null && now - state.openedAt >= this.cooldownMs) {
      this.failures = Math.max(0, this.failureThreshold - 1);
      this.openedAt = null;
      return;
    }
    this.failures = Math.max(0, state.failures);
    this.openedAt = state.openedAt;
  }
}

interface RouteTelemetryRecord {
  totalRequests: number;
  liveSuccessCount: number;
  fallbackCount: number;
  timeoutCount: number;
  missingKeyCount: number;
  circuitOpenRejectedCount: number;
  budgetExceededCount: number;
  upstreamErrorCount: number;
  piiRedactedCount: number;
  totalTokens: number;
  costUsdMicros: number;
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
    budgetExceededCount: 0,
    upstreamErrorCount: 0,
    piiRedactedCount: 0,
    totalTokens: 0,
    costUsdMicros: 0,
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

function buildAuditEvent(params: {
  routeKey: string;
  eventType: AiBridgeAuditEventType;
  outcome?: "IDLE" | "LIVE_GEMINI" | "FALLBACK_TRIGGERED";
  fallbackReason?: BridgeFallbackReason | null;
  latencyMs?: number;
  piiRedactedCount?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  costUsdMicros?: number;
  actor?: string;
  detail?: string;
}): AiBridgeAuditEvent {
  const id =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    timestamp: new Date().toISOString(),
    routeKey: params.routeKey,
    eventType: params.eventType,
    outcome: params.outcome,
    fallbackReason: params.fallbackReason,
    latencyMs: params.latencyMs,
    piiRedactedCount: params.piiRedactedCount,
    promptTokens: params.promptTokens,
    completionTokens: params.completionTokens,
    totalTokens: params.totalTokens,
    costUsdMicros: params.costUsdMicros,
    actor: params.actor,
    detail: params.detail,
  };
}

export function resetAllBridgeCircuits(): void {
  routeCircuits.clear();
  routeTelemetry.clear();
  const store = getBridgeStateStore();
  store.clearAllSync();
  getBridgeArchiveRepository().clearSync?.();
}

export function resetRouteBridgeCircuit(
  routeKey?: string,
  actor?: string,
): string[] {
  const store = getBridgeStateStore();
  const affected = routeKey
    ? [routeKey]
    : Array.from(
        new Set<string>([
          ...KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
          ...routeCircuits.keys(),
        ]),
      );

  for (const key of affected) {
    getRouteCircuitBreaker(key).reset();
    void store.deleteRouteCircuit(key);
  }

  void store.appendAuditEvent(
    buildAuditEvent({
      routeKey: routeKey ?? "ALL",
      eventType: "ADMIN_RESET",
      actor: actor ?? "SYSTEM",
      detail: `RESET_CIRCUIT (${routeKey ?? "ALL"})`,
    }),
  );

  return affected;
}

export async function resetRouteBridgeCircuitAsync(
  routeKey?: string,
  actor?: string,
): Promise<string[]> {
  const store = getBridgeStateStore();
  const affected = routeKey
    ? [routeKey]
    : Array.from(
        new Set<string>([
          ...KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
          ...routeCircuits.keys(),
        ]),
      );

  for (const key of affected) {
    getRouteCircuitBreaker(key).reset();
    await store.deleteRouteCircuit(key);
  }

  await store.appendAuditEvent(
    buildAuditEvent({
      routeKey: routeKey ?? "ALL",
      eventType: "ADMIN_RESET",
      actor: actor ?? "SYSTEM",
      detail: `RESET_CIRCUIT (${routeKey ?? "ALL"})`,
    }),
  );

  return affected;
}

export function resetBridgeTelemetry(
  routeKey?: string,
  actor?: string,
): string[] {
  const store = getBridgeStateStore();
  if (routeKey) {
    routeTelemetry.set(routeKey, createEmptyTelemetryRecord());
    void store.appendAuditEvent(
      buildAuditEvent({
        routeKey,
        eventType: "ADMIN_RESET",
        actor: actor ?? "SYSTEM",
        detail: `RESET_TELEMETRY (${routeKey})`,
      }),
    );
    return [routeKey];
  }

  const affected = Array.from(
    new Set<string>([
      ...KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
      ...routeTelemetry.keys(),
    ]),
  );
  routeTelemetry.clear();
  void store.appendAuditEvent(
    buildAuditEvent({
      routeKey: "ALL",
      eventType: "ADMIN_RESET",
      actor: actor ?? "SYSTEM",
      detail: "RESET_TELEMETRY (ALL)",
    }),
  );
  return affected;
}

export async function resetBridgeTelemetryAsync(
  routeKey?: string,
  actor?: string,
): Promise<string[]> {
  const store = getBridgeStateStore();
  if (routeKey) {
    routeTelemetry.set(routeKey, createEmptyTelemetryRecord());
    await store.appendAuditEvent(
      buildAuditEvent({
        routeKey,
        eventType: "ADMIN_RESET",
        actor: actor ?? "SYSTEM",
        detail: `RESET_TELEMETRY (${routeKey})`,
      }),
    );
    return [routeKey];
  }

  const affected = Array.from(
    new Set<string>([
      ...KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
      ...routeTelemetry.keys(),
    ]),
  );
  routeTelemetry.clear();
  await store.appendAuditEvent(
    buildAuditEvent({
      routeKey: "ALL",
      eventType: "ADMIN_RESET",
      actor: actor ?? "SYSTEM",
      detail: "RESET_TELEMETRY (ALL)",
    }),
  );
  return affected;
}

export function recordBridgePiiRedactions(
  routeKey: string,
  redactionCount: number,
): void {
  if (redactionCount <= 0) return;
  const record = getOrCreateTelemetryRecord(routeKey);
  record.piiRedactedCount += redactionCount;
  record.lastUpdatedAt = new Date().toISOString();
  void getBridgeStateStore().appendAuditEvent(
    buildAuditEvent({
      routeKey,
      eventType: "PII_REDACTED",
      piiRedactedCount: redactionCount,
      detail: `Scrubbed ${redactionCount} sensitive token(s) pre-egress`,
    }),
  );
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

function normalizeTokenUsage(
  input?: TokenUsageInput | null,
): NormalizedTokenUsage | null {
  if (!input) return null;
  const promptTokens = Math.max(
    0,
    Math.round(input.promptTokens ?? input.inputTokens ?? 0),
  );
  const completionTokens = Math.max(
    0,
    Math.round(input.completionTokens ?? input.outputTokens ?? 0),
  );
  const totalTokens = Math.max(
    promptTokens + completionTokens,
    Math.round(input.totalTokens ?? promptTokens + completionTokens),
  );
  if (totalTokens === 0 && promptTokens === 0 && completionTokens === 0) {
    return null;
  }
  return {
    promptTokens,
    completionTokens,
    totalTokens,
  };
}

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
  } else if (params.reason === "BUDGET_EXCEEDED") {
    record.budgetExceededCount += 1;
  } else if (params.reason === "TIMEOUT") {
    record.timeoutCount += 1;
  } else {
    record.upstreamErrorCount += 1;
  }
}

async function persistTokenAccounting(params: {
  routeKey: string;
  modelName?: string;
  usage: NormalizedTokenUsage;
  outcome: "LIVE_GEMINI" | "FALLBACK_TRIGGERED";
}): Promise<number> {
  const costUsdMicros = calculateModelCostMicros({
    modelName: params.modelName,
    promptTokens: params.usage.promptTokens,
    completionTokens: params.usage.completionTokens,
  });

  const record = getOrCreateTelemetryRecord(params.routeKey);
  record.totalTokens += params.usage.totalTokens;
  record.costUsdMicros += costUsdMicros;

  const dateKey = getUtcDateKey();
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();

  await store.recordDailyUsage({
    dateKey,
    routeKey: params.routeKey,
    promptTokens: params.usage.promptTokens,
    completionTokens: params.usage.completionTokens,
    totalTokens: params.usage.totalTokens,
    costUsdMicros,
  });

  void archive.upsertDailyUsage({
    dateKey,
    routeKey: params.routeKey,
    requestCount: 1,
    liveSuccessCount: params.outcome === "LIVE_GEMINI" ? 1 : 0,
    fallbackCount: params.outcome === "FALLBACK_TRIGGERED" ? 1 : 0,
    promptTokens: params.usage.promptTokens,
    completionTokens: params.usage.completionTokens,
    totalTokens: params.usage.totalTokens,
    costUsdMicros,
  });

  return costUsdMicros;
}

/**
 * Shared circuit breaker + FinOps quota + timeout executor for all LLM routes.
 * Handles missing API keys, open circuits, daily token/USD budget caps, timeouts,
 * fail-open Redis/PostgreSQL archival, and deterministic fallback telemetry.
 */
export async function runWithCircuitGuard<T>(params: {
  routeKey: string;
  hasKey?: boolean;
  timeoutMs?: number;
  modelName?: string;
  extractUsage?: (data: NoInfer<T>) => TokenUsageInput | null | undefined;
  execute: (
    abortSignal: AbortSignal,
    helpers: BridgeExecuteHelpers,
  ) => Promise<T>;
}): Promise<ExecuteGeminiBridgeResult<T>> {
  const startedAt = Date.now();
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();
  const breaker = getRouteCircuitBreaker(params.routeKey);
  const remoteState = await store.loadRouteCircuit(params.routeKey);
  if (remoteState) {
    breaker.hydrate(remoteState, startedAt);
  }
  const keyAvailable = params.hasKey ?? hasGoogleGeminiKey();

  if (!keyAvailable) {
    const latencyMs = Date.now() - startedAt;
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason: "MISSING_API_KEY",
      latencyMs,
    });
    const ev = buildAuditEvent({
      routeKey: params.routeKey,
      eventType: "REQUEST_COMPLETED",
      outcome: "FALLBACK_TRIGGERED",
      fallbackReason: "MISSING_API_KEY",
      latencyMs,
      detail: "Served local deterministic fallback (no upstream key)",
    });
    await store.appendAuditEvent(ev);
    void archive.archiveEvents([ev]);
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
    const ev = buildAuditEvent({
      routeKey: params.routeKey,
      eventType: "REQUEST_COMPLETED",
      outcome: "FALLBACK_TRIGGERED",
      fallbackReason: "CIRCUIT_OPEN",
      latencyMs,
      detail: "Short-circuited via OPEN circuit breaker",
    });
    await store.appendAuditEvent(ev);
    void archive.archiveEvents([ev]);
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

  const policy = getAiBridgeFinOpsPolicy();
  const dateKey = getUtcDateKey(new Date(startedAt));
  const dailyUsage = await store.getDailyUsage(dateKey);
  const exceededTokens =
    policy.dailyTokenLimit > 0 &&
    dailyUsage.totalTokens >= policy.dailyTokenLimit;
  const exceededCost =
    policy.dailyCostMicrosLimit > 0 &&
    dailyUsage.costUsdMicros >= policy.dailyCostMicrosLimit;

  if (policy.enforced && (exceededTokens || exceededCost)) {
    const latencyMs = Date.now() - startedAt;
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason: "BUDGET_EXCEEDED",
      latencyMs,
    });
    const ev = buildAuditEvent({
      routeKey: params.routeKey,
      eventType: "BUDGET_EXCEEDED",
      outcome: "FALLBACK_TRIGGERED",
      fallbackReason: "BUDGET_EXCEEDED",
      latencyMs,
      totalTokens: dailyUsage.totalTokens,
      costUsdMicros: dailyUsage.costUsdMicros,
      detail: exceededCost
        ? `Daily cost quota reached ($${microsToUsd(dailyUsage.costUsdMicros)} / $${policy.dailyCostUsdLimit})`
        : `Daily token quota reached (${dailyUsage.totalTokens} / ${policy.dailyTokenLimit})`,
    });
    await store.appendAuditEvent(ev);
    void archive.archiveEvents([ev]);
    void archive.upsertDailyUsage({
      dateKey,
      routeKey: params.routeKey,
      requestCount: 1,
      liveSuccessCount: 0,
      fallbackCount: 1,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      costUsdMicros: 0,
    });
    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: "BUDGET_EXCEEDED",
      detail:
        "Daily AI Bridge FinOps budget cap reached; serving deterministic local fallback.",
      circuitState: breaker.getState(startedAt),
      latencyMs,
    };
  }

  const timeoutMs = params.timeoutMs ?? 12_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let reportedUsage: NormalizedTokenUsage | null = null;
  let usagePersisted = false;
  let usagePromise: Promise<number> | null = null;
  const helpers: BridgeExecuteHelpers = {
    reportUsage: (usageInput) => {
      const normalized = normalizeTokenUsage(usageInput);
      if (!normalized || usagePersisted) return;
      reportedUsage = normalized;
      usagePersisted = true;
      usagePromise = persistTokenAccounting({
        routeKey: params.routeKey,
        modelName: params.modelName,
        usage: normalized,
        outcome: "LIVE_GEMINI",
      });
    },
  };

  try {
    const data = await Promise.race([
      params.execute(controller.signal, helpers),
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
    await store.saveRouteCircuit(
      params.routeKey,
      breaker.exportState(),
      breaker.getCooldownMs(),
    );
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "LIVE_GEMINI",
      latencyMs,
    });

    const extracted =
      reportedUsage ?? normalizeTokenUsage(params.extractUsage?.(data));
    let costUsdMicros: number | undefined;
    if (usagePromise) {
      costUsdMicros = await usagePromise;
    } else if (extracted && !usagePersisted) {
      usagePersisted = true;
      costUsdMicros = await persistTokenAccounting({
        routeKey: params.routeKey,
        modelName: params.modelName,
        usage: extracted,
        outcome: "LIVE_GEMINI",
      });
    } else if (!extracted) {
      void archive.upsertDailyUsage({
        dateKey,
        routeKey: params.routeKey,
        requestCount: 1,
        liveSuccessCount: 1,
        fallbackCount: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        costUsdMicros: 0,
      });
    }

    const ev = buildAuditEvent({
      routeKey: params.routeKey,
      eventType: "REQUEST_COMPLETED",
      outcome: "LIVE_GEMINI",
      fallbackReason: null,
      latencyMs,
      promptTokens: extracted?.promptTokens,
      completionTokens: extracted?.completionTokens,
      totalTokens: extracted?.totalTokens,
      costUsdMicros,
      detail: extracted
        ? `Upstream inference completed (${extracted.totalTokens} tokens)`
        : "Upstream inference completed",
    });
    await store.appendAuditEvent(ev);
    void archive.archiveEvents([ev]);
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

    await store.saveRouteCircuit(
      params.routeKey,
      breaker.exportState(),
      breaker.getCooldownMs(),
    );
    recordBridgeOutcome({
      routeKey: params.routeKey,
      outcome: "FALLBACK_TRIGGERED",
      reason,
      latencyMs,
    });
    const ev = buildAuditEvent({
      routeKey: params.routeKey,
      eventType:
        circuitState === "OPEN" ? "CIRCUIT_OPENED" : "REQUEST_COMPLETED",
      outcome: "FALLBACK_TRIGGERED",
      fallbackReason: reason,
      latencyMs,
      detail:
        circuitState === "OPEN"
          ? `Circuit tripped OPEN after ${reason}`
          : `Fallback triggered due to ${reason}`,
    });
    await store.appendAuditEvent(ev);
    void archive.archiveEvents([ev]);
    void archive.upsertDailyUsage({
      dateKey,
      routeKey: params.routeKey,
      requestCount: 1,
      liveSuccessCount: 0,
      fallbackCount: 1,
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      costUsdMicros: 0,
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
  const modelName = params.modelName ?? "gemini-2.5-flash";
  let capturedUsage: TokenUsageInput | null = null;

  return runWithCircuitGuard({
    routeKey: params.routeKey,
    timeoutMs: params.timeoutMs,
    modelName,
    extractUsage: () => capturedUsage,
    execute: async (abortSignal) => {
      const result = await generateObject({
        model: google(modelName),
        schema: params.schema,
        system: params.system,
        prompt: params.prompt,
        abortSignal,
      });
      const rawUsage = (result as { usage?: TokenUsageInput }).usage;
      const normalized = normalizeTokenUsage(rawUsage);
      if (normalized) {
        capturedUsage = normalized;
      } else {
        const promptChars = params.system.length + params.prompt.length;
        const outputChars = JSON.stringify(result.object ?? "").length;
        capturedUsage = {
          promptTokens: Math.max(1, Math.ceil(promptChars / 4)),
          completionTokens: Math.max(1, Math.ceil(outputChars / 4)),
        };
      }
      return result.object as z.infer<TSchema>;
    },
  });
}

export async function flushBridgeAuditArchiveAsync(
  actor?: string,
): Promise<number> {
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();
  const hotEvents = await store.listAuditEvents(100);
  const archivedCount = await archive.archiveEvents(hotEvents);
  const marker = buildAuditEvent({
    routeKey: "ALL",
    eventType: "AUDIT_ARCHIVED",
    actor: actor ?? "SYSTEM",
    detail: `Flushed ${archivedCount} event(s) to cold archive`,
  });
  await store.appendAuditEvent(marker);
  await archive.archiveEvents([marker]);
  return archivedCount;
}

export async function resetBridgeDailyBudgetAsync(
  actor?: string,
): Promise<string[]> {
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();
  const dateKey = getUtcDateKey();
  await store.resetDailyUsage(dateKey);
  const ev = buildAuditEvent({
    routeKey: "ALL",
    eventType: "ADMIN_RESET",
    actor: actor ?? "SYSTEM",
    detail: `RESET_DAILY_BUDGET (${dateKey})`,
  });
  await store.appendAuditEvent(ev);
  void archive.archiveEvents([ev]);
  return [dateKey];
}

function buildFinOpsSummary(usage: DailyBudgetUsage): AiBridgeFinOpsSummary {
  const policy = getAiBridgeFinOpsPolicy();
  const estimatedCostUsd = microsToUsd(usage.costUsdMicros);
  const remainingTokens =
    policy.dailyTokenLimit > 0
      ? Math.max(0, policy.dailyTokenLimit - usage.totalTokens)
      : 0;
  const tokenPct =
    policy.dailyTokenLimit > 0
      ? (usage.totalTokens / policy.dailyTokenLimit) * 100
      : 0;
  const costPct =
    policy.dailyCostUsdLimit > 0
      ? (estimatedCostUsd / policy.dailyCostUsdLimit) * 100
      : 0;
  const budgetUtilizationPct = Math.max(
    0,
    Number(Math.max(tokenPct, costPct).toFixed(1)),
  );
  const isBudgetExceeded =
    policy.enforced &&
    ((policy.dailyTokenLimit > 0 &&
      usage.totalTokens >= policy.dailyTokenLimit) ||
      (policy.dailyCostMicrosLimit > 0 &&
        usage.costUsdMicros >= policy.dailyCostMicrosLimit));

  return {
    dateKey: usage.dateKey,
    enforced: policy.enforced,
    dailyTokenLimit: policy.dailyTokenLimit,
    tokensUsed: usage.totalTokens,
    remainingTokens,
    dailyCostUsdLimit: policy.dailyCostUsdLimit,
    estimatedCostUsd,
    budgetUtilizationPct,
    isBudgetExceeded,
  };
}

function buildAiBridgeSnapshotCore(params: {
  filters?: {
    routeKey?: string;
    status?: "ALL" | "OPEN" | "CLOSED";
    includeAudit?: boolean;
  };
  recentAuditEvents: AiBridgeAuditEvent[];
  dailyUsage: DailyBudgetUsage;
  archiveStatus: AiBridgeArchiveStatus;
}): AiBridgeHealthSnapshot {
  const { filters, recentAuditEvents, dailyUsage, archiveStatus } = params;
  const now = Date.now();
  const store = getBridgeStateStore();
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
        budgetExceededCount: telemetry.budgetExceededCount,
        upstreamErrorCount: telemetry.upstreamErrorCount,
        piiRedactedCount: telemetry.piiRedactedCount,
        totalTokens: telemetry.totalTokens,
        estimatedCostUsd: microsToUsd(telemetry.costUsdMicros),
        avgLatencyMs,
        lastLatencyMs: telemetry.lastLatencyMs,
        lastOutcome: telemetry.lastOutcome,
        lastFallbackReason: telemetry.lastFallbackReason,
        lastUpdatedAt: telemetry.lastUpdatedAt,
      },
    });
  }

  const finops = buildFinOpsSummary(dailyUsage);
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
  } else if (
    !geminiKeyConfigured ||
    !glmKeyConfigured ||
    hasRecentFallback ||
    finops.isBudgetExceeded
  ) {
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
  let totalTokens = 0;
  let totalCostUsd = 0;
  let weightedLatencySum = 0;

  for (const entry of filteredEntries) {
    totalRequests += entry.telemetry.totalRequests;
    liveSuccessCount += entry.telemetry.liveSuccessCount;
    fallbackCount += entry.telemetry.fallbackCount;
    totalPiiRedacted += entry.telemetry.piiRedactedCount;
    totalTokens += entry.telemetry.totalTokens;
    totalCostUsd += entry.telemetry.estimatedCostUsd;
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
      adminGuardEnforced: isAiBridgeAdminGuardEnforced(),
      nodeEnv: process.env.NODE_ENV ?? "development",
    },
    persistence: store.getPersistenceStatus(),
    finops,
    archive: archiveStatus,
    summary: {
      totalRoutes: filteredEntries.length,
      openCircuits,
      closedCircuits: filteredEntries.length - openCircuits,
      totalRequests,
      liveSuccessCount,
      fallbackCount,
      totalPiiRedacted,
      totalTokens,
      estimatedCostUsd: Number(totalCostUsd.toFixed(6)),
      avgLatencyMs,
    },
    routes: filteredEntries,
    recentAuditEvents,
  };
}

export function getAiBridgeHealthSnapshot(filters?: {
  routeKey?: string;
  status?: "ALL" | "OPEN" | "CLOSED";
  includeAudit?: boolean;
}): AiBridgeHealthSnapshot {
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();
  const recentAuditEvents =
    filters?.includeAudit === false
      ? []
      : store.getCachedAuditEvents(50, filters?.routeKey);
  return buildAiBridgeSnapshotCore({
    filters,
    recentAuditEvents,
    dailyUsage: store.getCachedDailyUsage(getUtcDateKey()),
    archiveStatus: archive.getCachedArchiveStatus(),
  });
}

export async function getAiBridgeHealthSnapshotAsync(filters?: {
  routeKey?: string;
  status?: "ALL" | "OPEN" | "CLOSED";
  includeAudit?: boolean;
  auditSource?: "hot" | "archive";
  limit?: number;
}): Promise<AiBridgeHealthSnapshot> {
  const store = getBridgeStateStore();
  const archive = getBridgeArchiveRepository();
  const limit = filters?.limit ?? 50;

  if (store.getPersistenceStatus().driver === "redis") {
    const keysToSync = filters?.routeKey
      ? [filters.routeKey]
      : Array.from(
          new Set([
            ...KNOWN_AI_BRIDGE_ROUTES.map((route) => route.routeKey),
            ...routeCircuits.keys(),
          ]),
        );

    await Promise.all(
      keysToSync.map(async (routeKey) => {
        const remote = await store.loadRouteCircuit(routeKey);
        if (remote) {
          getRouteCircuitBreaker(routeKey).hydrate(remote);
        }
      }),
    );
  }

  const [dailyUsage, archiveStatus, recentAuditEvents] = await Promise.all([
    store.getDailyUsage(getUtcDateKey()),
    archive.getArchiveStatus(),
    filters?.includeAudit === false
      ? Promise.resolve([])
      : filters?.auditSource === "archive"
        ? archive.listArchivedEvents({
            limit,
            routeKey: filters?.routeKey,
          })
        : store.listAuditEvents(limit, filters?.routeKey),
  ]);

  return buildAiBridgeSnapshotCore({
    filters,
    recentAuditEvents,
    dailyUsage,
    archiveStatus,
  });
}
