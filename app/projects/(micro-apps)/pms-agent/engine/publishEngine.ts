import { resolveFinalScore } from "./calibrationEngine";
import type {
  CalibrationDecision,
  CorporateTone,
  DriftAlert,
  EmployeeProfile,
  EvaluationRecord,
  GoalDraft,
  PublishPackageRecord,
} from "../store/mockData";

export const TONE_PROFILES: Record<
  CorporateTone,
  {
    label: string;
    openingLead: string;
    closingCta: string;
  }
> = {
  COACHING_GROWTH: {
    label: "Coaching & Growth (rsxyz Default)",
    openingLead:
      "ขอบคุณสำหรับความมุ่งมั่นตลอดรอบที่ผ่านมา ผลลัพธ์จากข้อมูลจริงสะท้อนพัฒนาการที่วัดผลได้ดังนี้",
    closingCta:
      "ในรอบถัดไป ทีมและ HR จะสนับสนุนแผนพัฒนา IDP ด้านล่างเพื่อต่อยอดศักยภาพสู่เป้าหมายที่สูงขึ้น",
  },
  EXECUTIVE_DIRECT: {
    label: "Executive Direct & Outcome-Focused",
    openingLead:
      "สรุปผลสัมฤทธิ์ประจำรอบประเมินอ้างอิงตาม KPI และมติ Calibration Committee",
    closingCta: "ขอให้โฟกัสเป้าหมายเชิงผลลัพธ์ตามแผน IDP สำหรับ Cycle ถัดไปอย่างต่อเนื่อง",
  },
  EMPATHETIC_SUPPORT: {
    label: "Empathetic Support & Bottleneck Removal",
    openingLead:
      "องค์กรรับทราบถึงความท้าทายและอุปสรรคเชิงระบบในรอบที่ผ่านมา พร้อมขอชื่นชมความพยายามในการผลักดันงานอย่างเต็มที่",
    closingCta:
      "หัวหน้าและทีม People จะร่วมปลดล็อกคอขวดและจัดสรร Mentor ตามแผน IDP นี้ตั้งแต่สัปดาห์แรกของรอบใหม่",
  },
};

const DEPARTMENT_IDP_PLAYBOOK: Record<
  EmployeeProfile["department"],
  {
    focusSkill: string;
    actionTemplate: string;
    nextGoalPrefix: string;
    nextMetricSuffix: string;
  }
> = {
  Engineering: {
    focusSkill: "Automated Code Review & CI Pipeline Optimization",
    actionTemplate:
      "จัดทำ Pair-Review Rotation + แยก PR ขนาดเล็ก (< 250 LOC) พร้อม Automate Static Checks เพื่อลด Cycle Time ต่อเนื่อง",
    nextGoalPrefix:
      "[IDP Next-Cycle] Sustain Elite Engineering Delivery (< 14h PR Cycle)",
    nextMetricSuffix: "Q3-Q4 Target Acceleration",
  },
  Sales: {
    focusSkill: "Executive Legal Playbook & Deal Desk Acceleration",
    actionTemplate:
      "เข้าร่วม Workshop Pre-Approved MSA Clause กับทีม Legal เพื่อลดคอขวดขั้นตอนตรวจสัญญา Enterprise",
    nextGoalPrefix:
      "[IDP Next-Cycle] Standardize Enterprise Closing Below 28 Days",
    nextMetricSuffix: "Q3-Q4 Deal Velocity Target",
  },
  Operations: {
    focusSkill: "Predictive Dispatch Load Balancing & Warehouse Automation",
    actionTemplate:
      "ใช้ Peak-Volume Cutoff Dashboard วางแผนจัดกะล่วงหน้า 48 ชม. ก่อนปิดรอบบัญชีปลายเดือน",
    nextGoalPrefix: "[IDP Next-Cycle] Lock 99% Peak-Day Dispatch Reliability",
    nextMetricSuffix: "Q3-Q4 Fulfillment Target",
  },
};

/**
 * Synthesizes a Tone-of-Voice feedback letter and IDP package from calibrated Phase 4 scores.
 */
export function synthesizePublishPackage(
  goal: GoalDraft,
  employee: EmployeeProfile,
  evaluation: EvaluationRecord,
  calibrationDecisions: Record<string, CalibrationDecision>,
  driftAlert: DriftAlert | undefined,
  tone: CorporateTone,
  maskPii: boolean,
  previous?: PublishPackageRecord,
): PublishPackageRecord {
  const calibratedScore = resolveFinalScore(evaluation, calibrationDecisions);
  const profile = TONE_PROFILES[tone];
  const playbook = DEPARTMENT_IDP_PLAYBOOK[employee.department];
  const recipientToken = maskPii ? employee.anonymizedId : employee.name;
  const { metricName, baselineValue, targetValue, unit, dataSourceUri } =
    goal.kpiBinding;

  const driftSummary = driftAlert
    ? `สถานะการติดตามล่าสุด: ${driftAlert.severity} (${driftAlert.progressPct}% เทียบเป้าหมายรอบ)`
    : "สถานะการติดตามล่าสุด: บันทึกผลครบถ้วน";

  const feedbackText = [
    `เรียน ${recipientToken} (${employee.role})`,
    profile.openingLead,
    `เป้าหมายหลัก: ${goal.title}`,
    `คะแนนสุทธิหลัง Calibration: ${calibratedScore.toFixed(1)}/5.0 | ${driftSummary}`,
    `ข้อมูลตัวชี้วัด ${metricName}: Baseline ${baselineValue} ${unit} -> Target ${targetValue} ${unit} (อ้างอิง ${dataSourceUri})`,
    `แผนพัฒนาเฉพาะบุคคล (IDP Focus - ${playbook.focusSkill}): ${playbook.actionTemplate}`,
    profile.closingCta,
  ].join("\n\n");

  const nextTarget =
    targetValue < baselineValue
      ? Math.max(1, Math.round(targetValue * 0.8 * 10) / 10)
      : Math.min(
          99.5,
          Math.round((targetValue + (targetValue - baselineValue) * 0.1) * 10) /
            10,
        );

  return {
    id: previous?.id ?? `pub-${goal.id}`,
    goalId: goal.id,
    employeeId: employee.id,
    calibratedScore,
    tone,
    aiFeedbackDraft: feedbackText,
    hrEditedFeedback: feedbackText,
    idpFocusSkill: playbook.focusSkill,
    idpActionPlan: playbook.actionTemplate,
    nextCycleGoalTitle: playbook.nextGoalPrefix,
    nextCycleTargetValue: nextTarget,
    status: "DRAFT_AI",
    publishedBy: null,
    fedToNextCycle: previous?.fedToNextCycle ?? false,
    piiMaskedSnapshot: maskPii,
    updatedAt: new Date().toISOString(),
  };
}
