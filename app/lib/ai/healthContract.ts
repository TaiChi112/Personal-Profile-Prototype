import { z } from "zod";

export const AiBridgeProviderSchema = z.enum(["gemini", "openai-glm"]);
export type AiBridgeProvider = z.infer<typeof AiBridgeProviderSchema>;

export const BridgeCircuitStateSchema = z.enum(["CLOSED", "OPEN"]);
export const BridgeOutcomeSchema = z.enum([
  "IDLE",
  "LIVE_GEMINI",
  "FALLBACK_TRIGGERED",
]);
export const BridgeFallbackReasonSchema = z.enum([
  "MISSING_API_KEY",
  "CIRCUIT_OPEN",
  "BUDGET_EXCEEDED",
  "UPSTREAM_ERROR",
  "TIMEOUT",
]);
export const AiBridgeGlobalStatusSchema = z.enum([
  "HEALTHY",
  "DEGRADED",
  "CRITICAL",
]);
export type AiBridgeGlobalStatus = z.infer<typeof AiBridgeGlobalStatusSchema>;

export interface KnownAiBridgeRoute {
  routeKey: string;
  endpoint: string;
  provider: AiBridgeProvider;
  description: string;
}

export const KNOWN_AI_BRIDGE_ROUTES: readonly KnownAiBridgeRoute[] = [
  {
    routeKey: "stateflow:intent",
    endpoint: "/api/stateflow/intent",
    provider: "gemini",
    description:
      "StateFlow AI finite state machine natural-language patch bridge",
  },
  {
    routeKey: "pms:draft-goal",
    endpoint: "/api/pms/synthesize",
    provider: "gemini",
    description: "PMS AI Agent Phase 1 SMART goal synthesis",
  },
  {
    routeKey: "pms:evaluation",
    endpoint: "/api/pms/synthesize",
    provider: "gemini",
    description: "PMS AI Agent Phase 3 evidence-grounded evaluation",
  },
  {
    routeKey: "pms:feedback",
    endpoint: "/api/pms/synthesize",
    provider: "gemini",
    description: "PMS AI Agent Phase 5 corporate feedback & IDP draft",
  },
  {
    routeKey: "agentic-testing:intent",
    endpoint: "/api/agentic-testing/intent",
    provider: "gemini",
    description: "Agentic Testing Simulator QA graph mutation bridge",
  },
  {
    routeKey: "chat:assistant",
    endpoint: "/api/chat",
    provider: "gemini",
    description: "Portfolio AI Assistant streaming chat service",
  },
  {
    routeKey: "terminal:stream",
    endpoint: "/api/terminal",
    provider: "gemini",
    description: "Interactive OS Terminal cyberpunk sysadmin stream",
  },
  {
    routeKey: "webhooks:line-ai",
    endpoint: "/api/webhooks/line",
    provider: "openai-glm",
    description: "LINE Messaging Bot finance & habit webhook AI bridge",
  },
] as const;

export const AiBridgeHealthQuerySchema = z.object({
  routeKey: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9:_-]+$/i, "routeKey must contain only [a-z0-9:_-]")
    .optional(),
  status: z.enum(["ALL", "OPEN", "CLOSED"]).default("ALL"),
  includeAudit: z.enum(["true", "false"]).optional(),
  auditSource: z.enum(["hot", "archive"]).default("hot"),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const AiBridgeHealthActionSchema = z.object({
  action: z.enum([
    "RESET_CIRCUIT",
    "RESET_TELEMETRY",
    "ARCHIVE_FLUSH",
    "RESET_DAILY_BUDGET",
  ]),
  routeKey: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9:_-]+$/i, "routeKey must contain only [a-z0-9:_-]")
    .optional(),
});

export const RouteTelemetrySummarySchema = z.object({
  totalRequests: z.number().int().nonnegative(),
  liveSuccessCount: z.number().int().nonnegative(),
  fallbackCount: z.number().int().nonnegative(),
  timeoutCount: z.number().int().nonnegative(),
  missingKeyCount: z.number().int().nonnegative(),
  circuitOpenRejectedCount: z.number().int().nonnegative(),
  budgetExceededCount: z.number().int().nonnegative(),
  upstreamErrorCount: z.number().int().nonnegative(),
  piiRedactedCount: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  estimatedCostUsd: z.number().nonnegative(),
  avgLatencyMs: z.number().nonnegative(),
  lastLatencyMs: z.number().nonnegative().nullable(),
  lastOutcome: BridgeOutcomeSchema,
  lastFallbackReason: BridgeFallbackReasonSchema.nullable(),
  lastUpdatedAt: z.string().nullable(),
});

export const AiBridgeRouteHealthEntrySchema = z.object({
  routeKey: z.string(),
  endpoint: z.string(),
  provider: AiBridgeProviderSchema,
  description: z.string(),
  circuit: z.object({
    state: BridgeCircuitStateSchema,
    failures: z.number().int().nonnegative(),
    failureThreshold: z.number().int().positive(),
    remainingCooldownMs: z.number().nonnegative(),
  }),
  telemetry: RouteTelemetrySummarySchema,
});

export type AiBridgeRouteHealthEntry = z.infer<
  typeof AiBridgeRouteHealthEntrySchema
>;

export const AiBridgeAuditEventTypeSchema = z.enum([
  "REQUEST_COMPLETED",
  "CIRCUIT_OPENED",
  "BUDGET_EXCEEDED",
  "PII_REDACTED",
  "ADMIN_RESET",
  "AUDIT_ARCHIVED",
]);

export type AiBridgeAuditEventType = z.infer<
  typeof AiBridgeAuditEventTypeSchema
>;

export const AiBridgeAuditEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  routeKey: z.string(),
  eventType: AiBridgeAuditEventTypeSchema,
  outcome: BridgeOutcomeSchema.optional(),
  fallbackReason: BridgeFallbackReasonSchema.nullable().optional(),
  latencyMs: z.number().nonnegative().optional(),
  piiRedactedCount: z.number().int().nonnegative().optional(),
  promptTokens: z.number().int().nonnegative().optional(),
  completionTokens: z.number().int().nonnegative().optional(),
  totalTokens: z.number().int().nonnegative().optional(),
  costUsdMicros: z.number().int().nonnegative().optional(),
  actor: z.string().optional(),
  detail: z.string().optional(),
});

export type AiBridgeAuditEvent = z.infer<typeof AiBridgeAuditEventSchema>;

export const AiBridgePersistenceDriverSchema = z.enum(["memory", "redis"]);

export type AiBridgePersistenceDriver = z.infer<
  typeof AiBridgePersistenceDriverSchema
>;

export const AiBridgePersistenceStatusSchema = z.object({
  driver: AiBridgePersistenceDriverSchema,
  connected: z.boolean(),
  auditEventCount: z.number().int().nonnegative(),
});

export type AiBridgePersistenceStatus = z.infer<
  typeof AiBridgePersistenceStatusSchema
>;

export const AiBridgeFinOpsSummarySchema = z.object({
  dateKey: z.string(),
  enforced: z.boolean(),
  dailyTokenLimit: z.number().int().nonnegative(),
  tokensUsed: z.number().int().nonnegative(),
  remainingTokens: z.number().int().nonnegative(),
  dailyCostUsdLimit: z.number().nonnegative(),
  estimatedCostUsd: z.number().nonnegative(),
  budgetUtilizationPct: z.number().min(0),
  isBudgetExceeded: z.boolean(),
});

export type AiBridgeFinOpsSummary = z.infer<typeof AiBridgeFinOpsSummarySchema>;

export const AiBridgeArchiveDriverSchema = z.enum([
  "disabled",
  "memory",
  "prisma",
]);

export type AiBridgeArchiveDriver = z.infer<typeof AiBridgeArchiveDriverSchema>;

export const AiBridgeArchiveStatusSchema = z.object({
  driver: AiBridgeArchiveDriverSchema,
  connected: z.boolean(),
  archivedEventCount: z.number().int().nonnegative(),
  lastArchivedAt: z.string().nullable(),
});

export type AiBridgeArchiveStatus = z.infer<typeof AiBridgeArchiveStatusSchema>;

export const AiBridgeHealthResponseSchema = z.object({
  version: z.literal("1.0"),
  status: AiBridgeGlobalStatusSchema,
  timestamp: z.string(),
  environment: z.object({
    geminiKeyConfigured: z.boolean(),
    glmKeyConfigured: z.boolean(),
    adminGuardEnforced: z.boolean(),
    nodeEnv: z.string(),
  }),
  persistence: AiBridgePersistenceStatusSchema,
  finops: AiBridgeFinOpsSummarySchema,
  archive: AiBridgeArchiveStatusSchema,
  summary: z.object({
    totalRoutes: z.number().int().nonnegative(),
    openCircuits: z.number().int().nonnegative(),
    closedCircuits: z.number().int().nonnegative(),
    totalRequests: z.number().int().nonnegative(),
    liveSuccessCount: z.number().int().nonnegative(),
    fallbackCount: z.number().int().nonnegative(),
    totalPiiRedacted: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
    estimatedCostUsd: z.number().nonnegative(),
    avgLatencyMs: z.number().nonnegative(),
  }),
  routes: z.array(AiBridgeRouteHealthEntrySchema),
  recentAuditEvents: z.array(AiBridgeAuditEventSchema),
});

export type AiBridgeHealthSnapshot = z.infer<
  typeof AiBridgeHealthResponseSchema
>;

export const Rfc7807ProblemSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  detail: z.string(),
  instance: z.string(),
  issues: z.array(z.unknown()).optional(),
});

export type Rfc7807Problem = z.infer<typeof Rfc7807ProblemSchema>;

export function isRegisteredBridgeRouteKey(routeKey: string): boolean {
  return KNOWN_AI_BRIDGE_ROUTES.some((route) => route.routeKey === routeKey);
}

export type BridgeAdminAuthorizedBy =
  | "ADMIN_TOKEN"
  | "SESSION_ADMIN"
  | "LOCAL_DEV_BYPASS";

export interface BridgeAdminAccessEvaluation {
  allowed: boolean;
  mode: "ENFORCED" | "LOCAL_DEV_OPEN";
  authorizedBy?: BridgeAdminAuthorizedBy;
  reason?: string;
}

export function isAiBridgeAdminGuardEnforced(): boolean {
  const configuredToken = process.env.AI_BRIDGE_ADMIN_TOKEN?.trim() ?? "";
  return (
    process.env.NODE_ENV === "production" ||
    process.env.AI_BRIDGE_ENFORCE_ADMIN_GUARD === "true" ||
    configuredToken.length > 0
  );
}

export function evaluateAiBridgeAdminAccess(params: {
  headers: Headers;
  sessionRole?: string | null;
}): BridgeAdminAccessEvaluation {
  const configuredToken = process.env.AI_BRIDGE_ADMIN_TOKEN?.trim() ?? "";
  const providedHeaderToken =
    params.headers.get("x-ai-bridge-admin-token")?.trim() ?? "";
  const enforced = isAiBridgeAdminGuardEnforced();
  const mode = enforced ? "ENFORCED" : "LOCAL_DEV_OPEN";

  if (configuredToken.length > 0 && providedHeaderToken.length > 0) {
    if (providedHeaderToken === configuredToken) {
      return {
        allowed: true,
        mode,
        authorizedBy: "ADMIN_TOKEN",
      };
    }
    return {
      allowed: false,
      mode,
      reason: "Invalid x-ai-bridge-admin-token header supplied.",
    };
  }

  if (params.sessionRole === "admin") {
    return {
      allowed: true,
      mode,
      authorizedBy: "SESSION_ADMIN",
    };
  }

  if (!enforced) {
    return {
      allowed: true,
      mode: "LOCAL_DEV_OPEN",
      authorizedBy: "LOCAL_DEV_BYPASS",
    };
  }

  return {
    allowed: false,
    mode: "ENFORCED",
    reason:
      "Admin privileges required: provide a valid x-ai-bridge-admin-token header or sign in with an admin role session.",
  };
}

export function buildRfc7807Response(problem: Rfc7807Problem): Response {
  return new Response(JSON.stringify(problem), {
    status: problem.status,
    headers: {
      "Content-Type": "application/problem+json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export const DEFAULT_DAILY_TOKEN_LIMIT = 500_000;
export const DEFAULT_DAILY_COST_USD_LIMIT = 2.0;

export interface ModelPricingRates {
  inputPerMillionMicros: number;
  outputPerMillionMicros: number;
}

export const AI_BRIDGE_MODEL_PRICING_MICROS: Record<string, ModelPricingRates> =
  {
    "gemini-2.5-flash": {
      inputPerMillionMicros: 300_000,
      outputPerMillionMicros: 2_500_000,
    },
    "gemini-2.5-pro": {
      inputPerMillionMicros: 1_250_000,
      outputPerMillionMicros: 10_000_000,
    },
    "glm-5.3-flash": {
      inputPerMillionMicros: 140_000,
      outputPerMillionMicros: 1_400_000,
    },
    default: {
      inputPerMillionMicros: 300_000,
      outputPerMillionMicros: 2_500_000,
    },
  };

export interface AiBridgeFinOpsPolicy {
  enforced: boolean;
  dailyTokenLimit: number;
  dailyCostUsdLimit: number;
  dailyCostMicrosLimit: number;
}

export function getUtcDateKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function microsToUsd(micros: number): number {
  return Number((Math.max(0, micros) / 1_000_000).toFixed(6));
}

export function calculateModelCostMicros(params: {
  modelName?: string;
  promptTokens: number;
  completionTokens: number;
}): number {
  const safePrompt = Math.max(0, Math.round(params.promptTokens));
  const safeCompletion = Math.max(0, Math.round(params.completionTokens));
  if (safePrompt === 0 && safeCompletion === 0) return 0;

  const rate =
    (params.modelName
      ? AI_BRIDGE_MODEL_PRICING_MICROS[params.modelName]
      : undefined) ?? AI_BRIDGE_MODEL_PRICING_MICROS.default;

  const rawMicros =
    (safePrompt * rate.inputPerMillionMicros +
      safeCompletion * rate.outputPerMillionMicros) /
    1_000_000;
  return Math.max(1, Math.ceil(rawMicros));
}

export function getAiBridgeFinOpsPolicy(): AiBridgeFinOpsPolicy {
  const rawTokenLimit = Number(process.env.AI_BRIDGE_DAILY_TOKEN_LIMIT);
  const dailyTokenLimit =
    Number.isFinite(rawTokenLimit) && rawTokenLimit >= 0
      ? Math.floor(rawTokenLimit)
      : DEFAULT_DAILY_TOKEN_LIMIT;

  const rawCostLimit = Number(process.env.AI_BRIDGE_DAILY_COST_USD_LIMIT);
  const dailyCostUsdLimit =
    Number.isFinite(rawCostLimit) && rawCostLimit >= 0
      ? Number(rawCostLimit.toFixed(6))
      : DEFAULT_DAILY_COST_USD_LIMIT;

  const guardFlag =
    process.env.AI_BRIDGE_ENFORCE_BUDGET_GUARD?.trim().toLowerCase();
  const enforced =
    guardFlag !== "false" && (dailyTokenLimit > 0 || dailyCostUsdLimit > 0);

  return {
    enforced,
    dailyTokenLimit,
    dailyCostUsdLimit,
    dailyCostMicrosLimit: Math.round(dailyCostUsdLimit * 1_000_000),
  };
}
