import { computeGoalProgressAndDrift } from "./driftEngine";
import type {
  ConfidenceTier,
  EmployeeProfile,
  EvaluationRecord,
  EvidenceItem,
  GoalDraft,
  MonthlyCheckIn,
} from "../store/mockData";

export interface RatingProposalResult {
  proposedScore: number;
  progressPct: number;
  latestMetric: number;
  confidenceScore: number;
  confidenceTier: ConfidenceTier;
  citedEvidences: EvidenceItem[];
  aiRationale: string;
  aiSelfReviewDraft: string;
}

/**
 * Converts normalized KPI progress (0..150%) into a 1.0..5.0 PMS score rounded to 0.1.
 */
export function mapProgressToRatingScore(progressPct: number): number {
  const pct = Math.max(0, Math.min(150, progressPct));
  let raw = 2.0;

  if (pct < 30) {
    raw = 1.5 + (pct / 30) * 1.0;
  } else if (pct < 80) {
    raw = 2.5 + ((pct - 30) / 50) * 1.0;
  } else if (pct < 100) {
    raw = 3.5 + ((pct - 80) / 20) * 0.7;
  } else {
    raw = Math.min(5.0, 4.2 + ((pct - 100) / 50) * 0.8);
  }

  return Math.round(raw * 10) / 10;
}

/**
 * Computes an evidence-grounded rating proposal, confidence tier, and PII-safe self-review draft.
 */
export function computeGoalRatingProposal(
  goal: GoalDraft,
  employee: EmployeeProfile,
  evidences: EvidenceItem[],
  checkIns: MonthlyCheckIn[],
  maskPii: boolean,
): RatingProposalResult {
  const goalEvidences = evidences.filter((ev) => ev.goalId === goal.id);
  const submittedCheckIns = checkIns.filter(
    (chk) => chk.goalId === goal.id && chk.status === "SUBMITTED",
  );

  const latestMetric =
    goalEvidences[0]?.metricSnapshot ??
    submittedCheckIns[0]?.reportedValue ??
    goal.kpiBinding.baselineValue;

  const driftResult = computeGoalProgressAndDrift(goal, latestMetric, 6);
  const proposedScore = mapProgressToRatingScore(driftResult.progressPct);

  const telemetryCount = goalEvidences.filter(
    (ev) => ev.sourceType !== "MANUAL_CHECK",
  ).length;
  const manualEvidenceCount = goalEvidences.filter(
    (ev) => ev.sourceType === "MANUAL_CHECK",
  ).length;

  const rawConfidence =
    0.62 +
    Math.min(0.24, telemetryCount * 0.18) +
    Math.min(0.08, manualEvidenceCount * 0.05) +
    Math.min(0.1, submittedCheckIns.length * 0.06);

  const confidenceScore = Math.round(Math.min(0.98, rawConfidence) * 100) / 100;
  const confidenceTier: ConfidenceTier =
    confidenceScore >= 0.85 ? "HIGH" : "LOW";

  const subjectToken = maskPii ? employee.anonymizedId : employee.name;
  const { baselineValue, targetValue, metricName, unit, dataSourceUri } =
    goal.kpiBinding;

  const citedSummaries =
    goalEvidences.length > 0
      ? goalEvidences
          .slice(0, 3)
          .map(
            (ev, idx) => `[${idx + 1}] ${ev.summary} (URI: ${ev.verifiedUri})`,
          )
          .join("\n")
      : `ยังไม่มีหลักฐานอัตโนมัติในรอบนี้ (อ้างอิงแหล่งข้อมูลตั้งต้น ${dataSourceUri})`;

  const aiRationale = [
    `AI เสนอคะแนน ${proposedScore.toFixed(1)}/5.0 จากความคืบหน้า ${driftResult.progressPct}% ของตัวชี้วัด ${metricName}`,
    `ค่า Baseline ${baselineValue} ${unit} -> ค่าล่าสุด ${latestMetric} ${unit} (เป้าหมาย ${targetValue} ${unit})`,
    confidenceTier === "HIGH"
      ? `ความมั่นใจระดับ HIGH (${Math.round(confidenceScore * 100)}%) พร้อมหลักฐานยืนยัน ${goalEvidences.length} รายการ และ Check-in ที่ส่งแล้ว ${submittedCheckIns.length} ครั้ง: เหมาะสำหรับหัวหน้ากดยืนยันแบบ 1-Click`
      : `ความมั่นใจระดับ LOW (${Math.round(confidenceScore * 100)}%) เนื่องจากหลักฐานหรือ Check-in ยังไม่สมบูรณ์ (${goalEvidences.length} evidence / ${submittedCheckIns.length} check-in): แนะนำให้หัวหน้าตรวจสอบรายละเอียดก่อนรับรอง`,
  ].join(" | ");

  const aiSelfReviewDraft = [
    `[AI Self-Review Draft for ${subjectToken} · Goal: ${goal.title}]`,
    `สรุปผลลัพธ์: ดำเนินงานตามตัวชี้วัด ${metricName} จากค่าเริ่มต้น ${baselineValue} ${unit} มาอยู่ที่ ${latestMetric} ${unit} เทียบกับเป้าหมาย ${targetValue} ${unit} (คืบหน้า ${driftResult.progressPct}%)`,
    `หลักฐานประกอบจากระบบ (${goalEvidences.length} รายการ):`,
    citedSummaries,
    submittedCheckIns.length > 0
      ? `บันทึกการติดตามล่าสุด: "${submittedCheckIns[0].employeeReply || submittedCheckIns[0].monthLabel}"`
      : `หมายเหตุ: ยังรอคำตอบ Monthly Check-in เพิ่มเติมจากพนักงานเพื่อเสริมความสมบูรณ์ของหลักฐาน`,
  ].join("\n");

  return {
    proposedScore,
    progressPct: driftResult.progressPct,
    latestMetric,
    confidenceScore,
    confidenceTier,
    citedEvidences: goalEvidences,
    aiRationale,
    aiSelfReviewDraft,
  };
}

/**
 * Synthesizes a full Phase 3 EvaluationRecord while preserving human sign-off boundaries.
 */
export function synthesizeEvaluationRecord(
  goal: GoalDraft,
  employee: EmployeeProfile,
  evidences: EvidenceItem[],
  checkIns: MonthlyCheckIn[],
  maskPii: boolean,
  previous?: EvaluationRecord,
): EvaluationRecord {
  const proposal = computeGoalRatingProposal(
    goal,
    employee,
    evidences,
    checkIns,
    maskPii,
  );

  return {
    id: previous?.id ?? `eval-${goal.id}`,
    goalId: goal.id,
    employeeId: employee.id,
    proposedScore: proposal.proposedScore,
    managerScore: null,
    confidenceScore: proposal.confidenceScore,
    confidenceTier: proposal.confidenceTier,
    progressPct: proposal.progressPct,
    aiSelfReviewDraft: proposal.aiSelfReviewDraft,
    employeeSelfReview: proposal.aiSelfReviewDraft,
    aiRationale: proposal.aiRationale,
    managerNote: previous?.managerNote ?? "",
    appealNote: previous?.appealNote ?? "",
    citedEvidenceIds: proposal.citedEvidences.map((ev) => ev.id),
    status: "AI_DRAFT",
    endorsedBy: null,
    piiMaskedSnapshot: maskPii,
    updatedAt: new Date().toISOString(),
  };
}
