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
});

export const AiBridgeHealthActionSchema = z.object({
  action: z.enum(["RESET_CIRCUIT", "RESET_TELEMETRY"]),
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
  upstreamErrorCount: z.number().int().nonnegative(),
  piiRedactedCount: z.number().int().nonnegative(),
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

export const AiBridgeHealthResponseSchema = z.object({
  version: z.literal("1.0"),
  status: AiBridgeGlobalStatusSchema,
  timestamp: z.string(),
  environment: z.object({
    geminiKeyConfigured: z.boolean(),
    glmKeyConfigured: z.boolean(),
    nodeEnv: z.string(),
  }),
  summary: z.object({
    totalRoutes: z.number().int().nonnegative(),
    openCircuits: z.number().int().nonnegative(),
    closedCircuits: z.number().int().nonnegative(),
    totalRequests: z.number().int().nonnegative(),
    liveSuccessCount: z.number().int().nonnegative(),
    fallbackCount: z.number().int().nonnegative(),
    totalPiiRedacted: z.number().int().nonnegative(),
    avgLatencyMs: z.number().nonnegative(),
  }),
  routes: z.array(AiBridgeRouteHealthEntrySchema),
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

export function buildRfc7807Response(problem: Rfc7807Problem): Response {
  return new Response(JSON.stringify(problem), {
    status: problem.status,
    headers: {
      "Content-Type": "application/problem+json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
