import type {
  BellCurveBucket,
  BusinessUnitScope,
  CalibrationAnomalyCase,
  CalibrationDecision,
  EmployeeProfile,
  EvaluationRecord,
  ManagerBiasSummary,
  ManagerSkewStatus,
} from "../store/mockData";

export const BU_CURVE_CONFIG: Array<{
  key: BellCurveBucket["key"];
  label: string;
  rangeLabel: string;
  targetPct: number;
  matches: (score: number) => boolean;
}> = [
  {
    key: "EXCEEDS",
    label: "Exceeds Target",
    rangeLabel: "4.2 - 5.0",
    targetPct: 15,
    matches: (score) => score >= 4.2,
  },
  {
    key: "STRONG",
    label: "Strong Performer",
    rangeLabel: "3.4 - 4.1",
    targetPct: 35,
    matches: (score) => score >= 3.4 && score < 4.2,
  },
  {
    key: "MEETS",
    label: "Meets Baseline",
    rangeLabel: "2.6 - 3.3",
    targetPct: 35,
    matches: (score) => score >= 2.6 && score < 3.4,
  },
  {
    key: "BELOW",
    label: "Needs Calibration",
    rangeLabel: "< 2.6",
    targetPct: 15,
    matches: (score) => score < 2.6,
  },
];

function getScopedPairs(
  evaluations: EvaluationRecord[],
  employees: EmployeeProfile[],
  buScope: BusinessUnitScope,
): Array<{ evaluation: EvaluationRecord; employee: EmployeeProfile }> {
  const empById = new Map(employees.map((emp) => [emp.id, emp]));
  const pairs: Array<{
    evaluation: EvaluationRecord;
    employee: EmployeeProfile;
  }> = [];

  for (const evaluation of evaluations) {
    const employee = empById.get(evaluation.employeeId);
    if (!employee) continue;
    if (buScope !== "ALL" && employee.department !== buScope) continue;
    pairs.push({ evaluation, employee });
  }

  return pairs;
}

export function resolveFinalScore(
  evaluation: EvaluationRecord,
  decisions: Record<string, CalibrationDecision>,
): number {
  const decided = decisions[evaluation.goalId]?.calibratedScore;
  if (typeof decided === "number" && Number.isFinite(decided)) return decided;
  if (
    typeof evaluation.managerScore === "number" &&
    Number.isFinite(evaluation.managerScore)
  ) {
    return evaluation.managerScore;
  }
  return evaluation.proposedScore;
}

/**
 * Compares live cohort score distribution against BU Bell Curve target ratios.
 */
export function computeBellCurveDistribution(
  evaluations: EvaluationRecord[],
  employees: EmployeeProfile[],
  buScope: BusinessUnitScope,
  decisions: Record<string, CalibrationDecision> = {},
): BellCurveBucket[] {
  const scoped = getScopedPairs(evaluations, employees, buScope);
  const total = scoped.length;

  return BU_CURVE_CONFIG.map((bucket) => {
    const count = scoped.filter(({ evaluation }) =>
      bucket.matches(resolveFinalScore(evaluation, decisions)),
    ).length;
    const actualPct = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      key: bucket.key,
      label: bucket.label,
      rangeLabel: bucket.rangeLabel,
      targetPct: bucket.targetPct,
      actualPct,
      count,
      deltaPct: actualPct - bucket.targetPct,
    };
  });
}

/**
 * Detects Strictness vs Leniency skew per department manager compared against AI proposals.
 */
export function analyzeManagerBias(
  evaluations: EvaluationRecord[],
  employees: EmployeeProfile[],
  buScope: BusinessUnitScope = "ALL",
): ManagerBiasSummary[] {
  const departments: EmployeeProfile["department"][] =
    buScope === "ALL" ? ["Engineering", "Sales", "Operations"] : [buScope];

  return departments.map((department) => {
    const pairs = getScopedPairs(evaluations, employees, department);
    const managerSigned = pairs.filter(
      ({ evaluation }) => evaluation.managerScore !== null,
    );

    const deltas = managerSigned.map(
      ({ evaluation }) =>
        (evaluation.managerScore ?? evaluation.proposedScore) -
        evaluation.proposedScore,
    );
    const meanDelta =
      deltas.length > 0
        ? Math.round(
            (deltas.reduce((sum, d) => sum + d, 0) / deltas.length) * 100,
          ) / 100
        : 0;

    let skewStatus: ManagerSkewStatus = "BALANCED";
    if (meanDelta >= 0.35) {
      skewStatus = "LENIENCY_SKEW";
    } else if (meanDelta <= -0.35) {
      skewStatus = "STRICTNESS_SKEW";
    }

    const flaggedExceptions = pairs.filter(({ evaluation }) => {
      const delta =
        evaluation.managerScore !== null
          ? Math.abs(evaluation.managerScore - evaluation.proposedScore)
          : 0;
      return (
        delta >= 0.4 ||
        evaluation.status === "DISPUTED" ||
        evaluation.confidenceTier === "LOW"
      );
    }).length;

    const recommendation =
      skewStatus === "LENIENCY_SKEW"
        ? `หัวหน้ามีแนวโน้มให้คะแนนสูงกว่าหลักฐาน (+${meanDelta.toFixed(2)}): แนะนำให้กรรมการสอบเทียบเทียบกับ BU Curve`
        : skewStatus === "STRICTNESS_SKEW"
          ? `หัวหน้ามีแนวโน้มกดคะแนนต่ำกว่าหลักฐาน (${meanDelta.toFixed(2)}): แนะนำทบทวนหลักฐานอ้างอิงเพื่อความเป็นธรรม`
          : managerSigned.length === 0
            ? "รอการรับรองคะแนนจากหัวหน้าใน Phase 3 หรือตรวจเคสความมั่นใจต่ำ"
            : `คะแนนสอดคล้องกับหลักฐานจริง (Delta ${meanDelta >= 0 ? "+" : ""}${meanDelta.toFixed(2)})`;

    return {
      department,
      evaluatedCount: pairs.length,
      meanDelta,
      skewStatus,
      flaggedExceptions,
      recommendation,
    };
  });
}

/**
 * Surfaces only AI-flagged anomaly cases for Executive Calibration Committee HITL review.
 */
export function buildCalibrationQueue(
  evaluations: EvaluationRecord[],
  employees: EmployeeProfile[],
  decisions: Record<string, CalibrationDecision>,
  maskPii: boolean,
  buScope: BusinessUnitScope = "ALL",
): CalibrationAnomalyCase[] {
  const scoped = getScopedPairs(evaluations, employees, buScope);
  const cases: CalibrationAnomalyCase[] = [];

  for (const { evaluation, employee } of scoped) {
    const decision = decisions[evaluation.goalId];
    const effectiveScore = resolveFinalScore(evaluation, decisions);
    const deltaFromAi =
      evaluation.managerScore !== null
        ? Math.round(
            (evaluation.managerScore - evaluation.proposedScore) * 10,
          ) / 10
        : 0;

    const reasons: string[] = [];
    if (Math.abs(deltaFromAi) >= 0.4) {
      reasons.push(
        `AI vs Manager diverge (${deltaFromAi >= 0 ? "+" : ""}${deltaFromAi.toFixed(1)})`,
      );
    }
    if (evaluation.status === "DISPUTED") {
      reasons.push("Employee Appeal (DISPUTED)");
    }
    if (evaluation.confidenceTier === "LOW") {
      reasons.push("LOW Evidence Confidence");
    }
    if (evaluation.managerScore === null) {
      reasons.push("Pending Manager Sign-Off");
    }

    // Include cases that have divergence, appeal, low confidence, pending manager review, or an active calibration decision
    if (reasons.length === 0 && !decision) {
      continue;
    }

    cases.push({
      evaluationId: evaluation.id,
      goalId: evaluation.goalId,
      employeeId: employee.id,
      displayIdentity: maskPii ? employee.anonymizedId : employee.name,
      department: employee.department,
      proposedScore: evaluation.proposedScore,
      managerScore: evaluation.managerScore,
      effectiveScore,
      deltaFromAi,
      anomalyReason:
        reasons.length > 0 ? reasons.join(" · ") : "Committee Audited",
      decisionStatus: decision?.status ?? "FLAGGED",
      calibratedScore: decision?.calibratedScore ?? null,
      committeeNote: decision?.committeeNote ?? "",
    });
  }

  return cases;
}
