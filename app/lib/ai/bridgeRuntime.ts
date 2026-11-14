import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { z } from "zod";

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

const routeCircuits = new Map<string, BridgeCircuitBreaker>();

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
}

export function hasGoogleGeminiKey(): boolean {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return typeof key === "string" && key.trim().length > 0;
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

  return { sanitized, redactions };
}

/**
 * Recursively redacts PII fields inside any structured payload before LLM serialization.
 */
export function redactPiiPayload<T>(
  value: T,
  extraSensitiveTokens: string[] = [],
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

  return {
    sanitized: walk(value) as T,
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
    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: "MISSING_API_KEY",
      detail:
        "GOOGLE_GENERATIVE_AI_API_KEY is not configured; using deterministic local engine.",
      circuitState: breaker.getState(startedAt),
      latencyMs: Date.now() - startedAt,
    };
  }

  if (!breaker.canAttempt(startedAt)) {
    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: "CIRCUIT_OPEN",
      detail:
        "Circuit breaker is OPEN due to repeated upstream failures; serving local fallback.",
      circuitState: "OPEN",
      latencyMs: Date.now() - startedAt,
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
    return {
      ok: true,
      source: "LIVE_GEMINI",
      data,
      circuitState: "CLOSED",
      latencyMs: Date.now() - startedAt,
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    const circuitState = breaker.recordFailure();
    const isTimeout =
      detail.includes("BRIDGE_TIMEOUT") ||
      detail.toLowerCase().includes("abort");

    return {
      ok: false,
      source: "FALLBACK_TRIGGERED",
      reason: isTimeout ? "TIMEOUT" : "UPSTREAM_ERROR",
      detail,
      circuitState,
      latencyMs: Date.now() - startedAt,
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
