import { NextResponse } from "next/server";
import { z } from "zod";
import {
  executeGeminiBridge,
  redactPiiPayload,
} from "@/app/lib/ai/bridgeRuntime";

const RequestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  presetId: z.string().trim().optional().default("ecommerce"),
  nodes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        sub: z.string().optional(),
        x: z.number().optional(),
        y: z.number().optional(),
      }),
    )
    .min(1),
  edges: z
    .array(
      z.object({
        id: z.string(),
        from: z.string(),
        to: z.string(),
        label: z.string(),
        type: z.enum(["forward", "loop", "fallback", "leapfrog"]),
      }),
    )
    .optional()
    .default([]),
});

export const StateFlowPatchSchema = z.object({
  addNodes: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        sub: z.string().min(1),
        x: z.number().min(80).max(920),
        y: z.number().min(50).max(560),
        traffic: z.string().min(1),
      }),
    )
    .min(1)
    .max(4),
  addEdges: z
    .array(
      z.object({
        id: z.string().min(1),
        from: z.string().min(1),
        to: z.string().min(1),
        label: z.string().min(1),
        type: z.enum(["forward", "loop", "fallback", "leapfrog"]),
        prob: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
  explanation: z.string().min(1),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid request parameters",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const { sanitized } = redactPiiPayload(parsed.data);

  const systemPrompt =
    "You are StateFlow AI, a strict finite state machine architect. Convert the user request into valid additive StateNode and StateEdge patches anchored within x:[80,920], y:[50,560]. Connect new nodes using existing node IDs or newly proposed node IDs. Respond concisely in Thai/English matching the domain without any emojis.";

  const userPrompt = [
    `Preset: ${sanitized.presetId}`,
    `User Request: ${sanitized.prompt}`,
    `Existing Nodes: ${JSON.stringify(sanitized.nodes)}`,
    `Existing Edges: ${JSON.stringify(sanitized.edges)}`,
    "Return addNodes (1-4 new states), addEdges connecting them cleanly to existing workflow states, and a brief explanation.",
  ].join("\n\n");

  const bridgeResult = await executeGeminiBridge({
    routeKey: "stateflow:intent",
    schema: StateFlowPatchSchema,
    system: systemPrompt,
    prompt: userPrompt,
    timeoutMs: 12_000,
  });

  if (!bridgeResult.ok) {
    return NextResponse.json({
      ok: false,
      source: bridgeResult.source,
      reason: bridgeResult.reason,
      detail: bridgeResult.detail,
      circuitState: bridgeResult.circuitState,
      latencyMs: bridgeResult.latencyMs,
    });
  }

  return NextResponse.json({
    ok: true,
    source: bridgeResult.source,
    circuitState: bridgeResult.circuitState,
    latencyMs: bridgeResult.latencyMs,
    patch: bridgeResult.data,
  });
}
