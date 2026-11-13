import type {
  CheckInChannel,
  DriftAlert,
  DriftSeverity,
  EmployeeProfile,
  GoalDraft,
} from "../store/mockData";

export interface DriftComputationResult {
  progressPct: number;
  expectedPct: number;
  driftDeltaPct: number;
  severity: DriftSeverity;
  message: string;
}

/**
 * Computes direction-agnostic KPI progress and drift status for a goal at a given cycle month (1..6).
 * Supports both lower-is-better (e.g. cycle hours/days) and higher-is-better (e.g. SLA percentage) KPIs.
 */
export function computeGoalProgressAndDrift(
  goal: GoalDraft,
  currentValue: number,
  cycleMonth: number,
): DriftComputationResult {
  const { baselineValue, targetValue, metricName, unit, dataSourceUri } =
    goal.kpiBinding;
  const clampedMonth = Math.max(1, Math.min(6, Math.round(cycleMonth)));
  const expectedPct = Math.round((clampedMonth / 6) * 100);

  const span = Math.abs(targetValue - baselineValue);
  let progressPct = 0;

  if (span === 0) {
    progressPct = currentValue === targetValue ? 100 : 0;
  } else {
    const isLowerBetter = targetValue < baselineValue;
    const achieved = isLowerBetter
      ? baselineValue - currentValue
      : currentValue - baselineValue;
    progressPct = Math.max(
      0,
      Math.min(150, Math.round((achieved / span) * 100)),
    );
  }

  const driftDeltaPct = progressPct - expectedPct;

  let severity: DriftSeverity = "ON_TRACK";
  let message = `อยู่ในเกณฑ์ดี (+${Math.max(0, driftDeltaPct)}% เทียบเป้าเดือนที่ ${clampedMonth}): ${metricName} อยู่ที่ ${currentValue} ${unit} จากฐาน ${baselineValue} ${unit}`;

  if (driftDeltaPct < -25) {
    severity = "CRITICAL_DRIFT";
    message = `เตือนระดับวิกฤต (${driftDeltaPct}% เทียบเป้าเดือนที่ ${clampedMonth}): ${metricName} อยู่ที่ ${currentValue} ${unit} แนะนำให้หัวหน้าตรวจคอขวดจาก ${dataSourceUri}`;
  } else if (driftDeltaPct < -10) {
    severity = "AT_RISK";
    message = `เริ่มต่ำกว่าแผน (${driftDeltaPct}% เทียบเป้าเดือนที่ ${clampedMonth}): ${metricName} อยู่ที่ ${currentValue} ${unit} จากฐาน ${baselineValue} ${unit} แนะนำติดตามข้อมูลจาก ${dataSourceUri}`;
  } else if (driftDeltaPct < 0) {
    severity = "ON_TRACK";
    message = `ใกล้เคียงแผน (${driftDeltaPct}% เทียบเป้าเดือนที่ ${clampedMonth}): ${metricName} อยู่ที่ ${currentValue} ${unit}`;
  }

  return {
    progressPct,
    expectedPct,
    driftDeltaPct,
    severity,
    message,
  };
}

/**
 * Builds a monthly bot check-in prompt honoring the PII masking policy.
 */
export function buildCheckInBotPrompt(
  employee: EmployeeProfile,
  goal: GoalDraft,
  cycleMonth: number,
  channel: CheckInChannel,
  maskPii: boolean,
): string {
  const recipientToken = maskPii ? employee.anonymizedId : employee.name;
  const channelLabel = channel === "SLACK" ? "Slack Bot" : "LINE OA Bot";
  const { metricName, targetValue, unit } = goal.kpiBinding;

  return `[PMS ${channelLabel} -> ${recipientToken}] เช็กอินเดือนที่ ${cycleMonth}: เป้าหมาย "${goal.title}" (${metricName} เป้า ${targetValue} ${unit}) ตอนนี้ตัวเลขล่าสุดเป็นเท่าไร และติดอุปสรรคใดไหมครับ`;
}

/**
 * Helper to create a DriftAlert payload from computed drift metrics.
 */
export function buildDriftAlert(
  goal: GoalDraft,
  currentValue: number,
  cycleMonth: number,
): DriftAlert {
  const result = computeGoalProgressAndDrift(goal, currentValue, cycleMonth);
  return {
    id: `drift-${goal.id}`,
    goalId: goal.id,
    employeeId: goal.employeeId,
    severity: result.severity,
    progressPct: result.progressPct,
    expectedPct: result.expectedPct,
    driftDeltaPct: result.driftDeltaPct,
    message: result.message,
    acknowledged: result.severity === "ON_TRACK",
    createdAt: new Date().toISOString(),
  };
}
