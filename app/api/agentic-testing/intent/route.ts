import { NextResponse } from "next/server";
import { z } from "zod";
import {
  executeGeminiBridge,
  redactPiiPayload,
} from "@/app/lib/ai/bridgeRuntime";
import { buildDeterministicAgenticPatch } from "@/app/projects/(micro-apps)/agentic-testing/localFallback";

const NodeInputSchema = z.object({
  id: z.string().min(1),
  data: z
    .object({
      label: z.string().optional(),
    })
    .optional(),
  label: z.string().optional(),
});

const EdgeInputSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
});

const AgenticIntentRequestSchema = z.object({
  prompt: z.string().trim().min(1).max(2000),
  currentNodes: z.array(NodeInputSchema).default([]),
  currentEdges: z.array(EdgeInputSchema).default([]),
  knownSensitiveNames: z.array(z.string()).optional().default([]),
});

export const AgenticIntentResponseSchema = z.object({
  nodesToAdd: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    )
    .describe("New nodes to add to the state machine"),
  edgesToAdd: z
    .array(
      z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
      }),
    )
    .describe("New edges connecting nodes"),
  edgesToRemove: z
    .array(z.string())
    .describe(
      "IDs of existing edges that should be removed (e.g., if a new node was inserted between two existing nodes)",
    ),
  impact: z.object({
    testCasesAdded: z
      .number()
      .describe("Estimated number of new test cases required"),
    complexityIncrease: z
      .number()
      .describe("Estimated percentage increase in system complexity"),
    logMessage: z.string().describe("A short explanation of what was modified"),
  }),
});

export async function POST(req: Request) {
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const parsed = AgenticIntentRequestSchema.safeParse(rawBody);
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

  const { sanitized, redactionCount } = redactPiiPayload(
    parsed.data,
    parsed.data.knownSensitiveNames,
    { routeKey: "agentic-testing:intent" },
  );

  const normalizedNodes = sanitized.currentNodes.map((node) => ({
    id: node.id,
    label: node.data?.label ?? node.label ?? node.id,
  }));

  const normalizedEdges = sanitized.currentEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  }));

  const promptText = [
    `Current Nodes: ${JSON.stringify(normalizedNodes)}`,
    `Current Edges: ${JSON.stringify(normalizedEdges)}`,
    `User Intent: "${sanitized.prompt}"`,
    "INSTRUCTIONS:",
    "1. Determine how to modify the graph to fulfill the user's request.",
    '2. Generate unique IDs for new nodes (e.g., "node-101").',
    "3. If inserting between A and B, add new edges A->newNode and newNode->B and put old edge ID in edgesToRemove.",
    "4. Keep labels concise (max 4 words) without any emojis.",
    "5. Estimate testCasesAdded and complexityIncrease accurately.",
  ].join("\n\n");

  const bridge = await executeGeminiBridge({
    routeKey: "agentic-testing:intent",
    schema: AgenticIntentResponseSchema,
    system:
      "You are an expert AI Software Architect modifying a State Machine diagram. Never output emojis.",
    prompt: promptText,
    timeoutMs: 12_000,
  });

  if (!bridge.ok) {
    const fallbackPatch = buildDeterministicAgenticPatch(
      sanitized.prompt,
      normalizedNodes,
      normalizedEdges,
    );

    return NextResponse.json({
      ...fallbackPatch,
      bridgeMeta: {
        source: bridge.source,
        reason: bridge.reason,
        detail: bridge.detail,
        circuitState: bridge.circuitState,
        latencyMs: bridge.latencyMs,
        piiRedacted: true,
        redactionCount,
      },
    });
  }

  return NextResponse.json({
    ...bridge.data,
    bridgeMeta: {
      source: bridge.source,
      circuitState: bridge.circuitState,
      latencyMs: bridge.latencyMs,
      piiRedacted: true,
      redactionCount,
    },
  });
}
