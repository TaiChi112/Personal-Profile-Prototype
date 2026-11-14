import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getAiBridgeHealthSnapshot,
  resetBridgeTelemetry,
  resetRouteBridgeCircuit,
} from "@/app/lib/ai/bridgeRuntime";
import {
  AiBridgeHealthActionSchema,
  AiBridgeHealthQuerySchema,
  buildRfc7807Response,
  evaluateAiBridgeAdminAccess,
  isRegisteredBridgeRouteKey,
} from "@/app/lib/ai/healthContract";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-AI-Bridge-Telemetry-Version": "1.0",
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawRouteKey = searchParams.get("routeKey");
  const rawStatus = searchParams.get("status");

  const parsed = AiBridgeHealthQuerySchema.safeParse({
    routeKey: rawRouteKey === null ? undefined : rawRouteKey,
    status: rawStatus === null ? undefined : rawStatus,
  });

  if (!parsed.success) {
    return buildRfc7807Response({
      type: "https://ai-bridge.local/errors/invalid-health-query",
      title: "Invalid AI Bridge Health Query",
      status: 400,
      detail: parsed.error.issues.map((issue) => issue.message).join("; "),
      instance: "/api/health/ai-bridge",
      issues: parsed.error.issues,
    });
  }

  const { routeKey, status } = parsed.data;
  if (routeKey) {
    const currentSnapshot = getAiBridgeHealthSnapshot();
    const existsInRuntime = currentSnapshot.routes.some(
      (entry) => entry.routeKey === routeKey,
    );
    if (!isRegisteredBridgeRouteKey(routeKey) && !existsInRuntime) {
      return buildRfc7807Response({
        type: "https://ai-bridge.local/errors/unknown-route-key",
        title: "Unknown AI Bridge Route Key",
        status: 400,
        detail: `Route key '${routeKey}' is not registered in the AI Bridge registry.`,
        instance: "/api/health/ai-bridge",
      });
    }
  }

  const snapshot = getAiBridgeHealthSnapshot({ routeKey, status });
  return NextResponse.json(snapshot, {
    status: 200,
    headers: NO_STORE_HEADERS,
  });
}

export async function POST(request: NextRequest) {
  let sessionRole: string | null = null;
  try {
    const session = await auth();
    sessionRole = session?.user?.role ?? null;
  } catch {
    sessionRole = null;
  }

  const access = evaluateAiBridgeAdminAccess({
    headers: request.headers,
    sessionRole,
  });

  if (!access.allowed) {
    return buildRfc7807Response({
      type: "https://ai-bridge.local/errors/forbidden-admin-action",
      title: "Admin Role or Token Required",
      status: 403,
      detail:
        access.reason ??
        "Admin privileges required to reset AI Bridge circuits or telemetry.",
      instance: "/api/health/ai-bridge",
    });
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return buildRfc7807Response({
      type: "https://ai-bridge.local/errors/invalid-json-payload",
      title: "Malformed JSON Request Body",
      status: 400,
      detail: "Request body must be valid JSON.",
      instance: "/api/health/ai-bridge",
    });
  }

  const parsed = AiBridgeHealthActionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return buildRfc7807Response({
      type: "https://ai-bridge.local/errors/invalid-health-action",
      title: "Invalid AI Bridge Control Action",
      status: 400,
      detail: parsed.error.issues.map((issue) => issue.message).join("; "),
      instance: "/api/health/ai-bridge",
      issues: parsed.error.issues,
    });
  }

  const { action, routeKey } = parsed.data;
  if (routeKey) {
    const currentSnapshot = getAiBridgeHealthSnapshot();
    const existsInRuntime = currentSnapshot.routes.some(
      (entry) => entry.routeKey === routeKey,
    );
    if (!isRegisteredBridgeRouteKey(routeKey) && !existsInRuntime) {
      return buildRfc7807Response({
        type: "https://ai-bridge.local/errors/unknown-route-key",
        title: "Unknown AI Bridge Route Key",
        status: 400,
        detail: `Cannot perform '${action}' on unregistered routeKey '${routeKey}'.`,
        instance: "/api/health/ai-bridge",
      });
    }
  }

  const affectedRouteKeys =
    action === "RESET_CIRCUIT"
      ? resetRouteBridgeCircuit(routeKey)
      : resetBridgeTelemetry(routeKey);

  const snapshot = getAiBridgeHealthSnapshot();

  return NextResponse.json(
    {
      ok: true,
      actionApplied: action,
      authorizedBy: access.authorizedBy ?? "LOCAL_DEV_BYPASS",
      affectedRouteKeys,
      snapshot,
    },
    {
      status: 200,
      headers: NO_STORE_HEADERS,
    },
  );
}
