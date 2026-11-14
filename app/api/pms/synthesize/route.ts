import { NextResponse } from "next/server";
import { z } from "zod";
import {
  executeGeminiBridge,
  redactPiiPayload,
} from "@/app/lib/ai/bridgeRuntime";

const DraftGoalRequestSchema = z.object({
  action: z.literal("DRAFT_GOAL"),
  employeeAnonymizedId: z.string().trim().min(1),
  role: z.string().trim().min(1),
  department: z.string().trim().min(1),
  okrAlignment: z.string().trim().min(1),
  existingGoalTitle: z.string().trim().min(1),
  metricName: z.string().trim().min(1),
  baselineValue: z.number(),
  targetValue: z.number(),
  unit: z.string().trim().min(1),
  knownSensitiveNames: z.array(z.string()).optional().default([]),
});

const SynthesizeEvaluationRequestSchema = z.object({
  action: z.literal("SYNTHESIZE_EVALUATION"),
  employeeAnonymizedId: z.string().trim().min(1),
  goalTitle: z.string().trim().min(1),
  metricName: z.string().trim().min(1),
  baselineValue: z.number(),
  targetValue: z.number(),
  latestMetric: z.number(),
  unit: z.string().trim().min(1),
  evidenceSummaries: z.array(z.string()).max(12),
  knownSensitiveNames: z.array(z.string()).optional().default([]),
});

const SynthesizeFeedbackRequestSchema = z.object({
  action: z.literal("SYNTHESIZE_FEEDBACK"),
  employeeAnonymizedId: z.string().trim().min(1),
  tone: z.enum(["COACHING_GROWTH", "EXECUTIVE_DIRECT", "EMPATHETIC_SUPPORT"]),
  goalTitle: z.string().trim().min(1),
  calibratedScore: z.number().min(1).max(5),
  managerNote: z.string().trim().optional().default(""),
  idpFocusSkill: z.string().trim().optional().default(""),
  knownSensitiveNames: z.array(z.string()).optional().default([]),
});

const PmsSynthesizeRequestSchema = z.discriminatedUnion("action", [
  DraftGoalRequestSchema,
  SynthesizeEvaluationRequestSchema,
  SynthesizeFeedbackRequestSchema,
]);

const DraftGoalOutputSchema = z.object({
  refinedTitle: z.string().min(5),
  refinedDescription: z.string().min(10),
  smartCritique: z.array(z.string()).min(1).max(4),
});

const SynthesizeEvaluationOutputSchema = z.object({
  aiSummary: z.string().min(10),
  selfReviewDraft: z.string().min(10),
  keyHighlight: z.string().min(5),
});

const SynthesizeFeedbackOutputSchema = z.object({
  feedbackText: z.string().min(15),
  idpActionPlan: z.string().min(10),
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

  const parsed = PmsSynthesizeRequestSchema.safeParse(body);
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

  const sensitiveTokens = parsed.data.knownSensitiveNames ?? [];
  const { sanitized, redactionCount } = redactPiiPayload(
    parsed.data,
    sensitiveTokens,
  );

  const baseSystemPrompt =
    "You are an enterprise Performance Management System (PMS) AI co-pilot. Use strictly anonymized tokens (never reconstruct personal names, emails, phones, or national IDs). Write concise, constructive Thai/English enterprise prose with zero emojis.";

  if (sanitized.action === "DRAFT_GOAL") {
    const prompt = [
      `Employee Token: ${sanitized.employeeAnonymizedId} (${sanitized.role}, ${sanitized.department})`,
      `Company OKR Alignment: ${sanitized.okrAlignment}`,
      `Current Draft Title: ${sanitized.existingGoalTitle}`,
      `KPI Binding: ${sanitized.metricName} (Baseline ${sanitized.baselineValue} -> Target ${sanitized.targetValue} ${sanitized.unit})`,
      "Refine this SMART goal title, description, and 2 concise SMART verification critiques.",
    ].join("\n");

    const bridge = await executeGeminiBridge({
      routeKey: "pms:draft-goal",
      schema: DraftGoalOutputSchema,
      system: baseSystemPrompt,
      prompt,
      timeoutMs: 12_000,
    });

    return NextResponse.json({
      ok: bridge.ok,
      action: sanitized.action,
      source: bridge.source,
      circuitState: bridge.circuitState,
      latencyMs: bridge.latencyMs,
      piiRedacted: true,
      redactionCount,
      ...(bridge.ok
        ? { result: bridge.data }
        : { reason: bridge.reason, detail: bridge.detail }),
    });
  }

  if (sanitized.action === "SYNTHESIZE_EVALUATION") {
    const prompt = [
      `Employee Token: ${sanitized.employeeAnonymizedId}`,
      `Goal: ${sanitized.goalTitle}`,
      `KPI Progress: ${sanitized.metricName} (Baseline ${sanitized.baselineValue}, Latest ${sanitized.latestMetric}, Target ${sanitized.targetValue} ${sanitized.unit})`,
      `Verified Evidences:\n- ${sanitized.evidenceSummaries.join("\n- ")}`,
      "Synthesize an evidence-grounded AI evaluation summary, an evidence-cited self-review draft for the employee, and one key highlight.",
    ].join("\n");

    const bridge = await executeGeminiBridge({
      routeKey: "pms:evaluation",
      schema: SynthesizeEvaluationOutputSchema,
      system: baseSystemPrompt,
      prompt,
      timeoutMs: 12_000,
    });

    return NextResponse.json({
      ok: bridge.ok,
      action: sanitized.action,
      source: bridge.source,
      circuitState: bridge.circuitState,
      latencyMs: bridge.latencyMs,
      piiRedacted: true,
      redactionCount,
      ...(bridge.ok
        ? { result: bridge.data }
        : { reason: bridge.reason, detail: bridge.detail }),
    });
  }

  const prompt = [
    `Employee Token: ${sanitized.employeeAnonymizedId}`,
    `Corporate Tone: ${sanitized.tone}`,
    `Goal: ${sanitized.goalTitle}`,
    `Calibrated Final Score: ${sanitized.calibratedScore.toFixed(1)} / 5.0`,
    `Manager Calibration Note: ${sanitized.managerNote || "Standard performance cycle calibration."}`,
    `IDP Focus Skill: ${sanitized.idpFocusSkill || "System scalability and cross-team ownership"}`,
    "Compose a tailored corporate performance feedback narrative in the requested tone and a concrete next-cycle IDP action plan.",
  ].join("\n");

  const bridge = await executeGeminiBridge({
    routeKey: "pms:feedback",
    schema: SynthesizeFeedbackOutputSchema,
    system: baseSystemPrompt,
    prompt,
    timeoutMs: 12_000,
  });

  return NextResponse.json({
    ok: bridge.ok,
    action: sanitized.action,
    source: bridge.source,
    circuitState: bridge.circuitState,
    latencyMs: bridge.latencyMs,
    piiRedacted: true,
    redactionCount,
    ...(bridge.ok
      ? { result: bridge.data }
      : { reason: bridge.reason, detail: bridge.detail }),
  });
}
