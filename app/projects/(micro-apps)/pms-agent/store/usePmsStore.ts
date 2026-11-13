import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { buildCheckInBotPrompt, buildDriftAlert } from "../engine/driftEngine";
import { synthesizeEvaluationRecord } from "../engine/evaluationEngine";
import {
  type AuditLogEntry,
  type CheckInChannel,
  type DriftAlert,
  type EvaluationRecord,
  type EvidenceItem,
  type GoalDraft,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHECKINS,
  INITIAL_DRIFT_ALERTS,
  INITIAL_EVALUATIONS,
  INITIAL_EVIDENCES,
  INITIAL_GOAL_DRAFTS,
  MOCK_EMPLOYEES,
  type MonthlyCheckIn,
} from "./mockData";

export type FilterStatus =
  | "ALL"
  | "DRAFT_AI"
  | "ENDORSED_MANAGER"
  | "CONFIRMED_EMPLOYEE";

export type PmsLifecycleStage =
  | "PHASE_1_GOALS"
  | "PHASE_2_IN_CYCLE"
  | "PHASE_3_EVALUATION";

interface PmsState {
  selectedEmployeeId: string;
  goals: GoalDraft[];
  filterStatus: FilterStatus;
  isGenerating: boolean;
  maskPii: boolean;

  // Phase 2: In-Cycle Tracking & Multi-Channel Evidence Collector
  activeStage: PmsLifecycleStage;
  currentCycleMonth: number;
  checkIns: MonthlyCheckIn[];
  evidences: EvidenceItem[];
  driftAlerts: DriftAlert[];

  // Phase 3: Evidence-Grounded Evaluation & Self-Review Assistant
  evaluations: EvaluationRecord[];
  auditLogs: AuditLogEntry[];

  setSelectedEmployeeId: (id: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setActiveStage: (stage: PmsLifecycleStage) => void;
  setCycleMonth: (month: number) => void;
  toggleMaskPii: () => void;
  generateDraftGoals: (employeeId: string) => Promise<void>;
  endorseGoal: (goalId: string) => void;
  confirmGoal: (goalId: string) => void;
  updateGoalText: (goalId: string, title: string, description: string) => void;
  triggerBotCheckIn: (
    goalId: string,
    channel: CheckInChannel,
  ) => MonthlyCheckIn | null;
  submitEmployeeCheckIn: (
    checkInId: string,
    replyText: string,
    reportedValue: number,
  ) => void;
  ingestSourceTelemetry: (
    goalId: string,
    measuredValue: number,
    note?: string,
  ) => void;
  acknowledgeDriftAlert: (alertId: string) => void;
  synthesizeEmployeeEvaluation: (employeeId: string) => void;
  saveEmployeeSelfReview: (
    evaluationId: string,
    text: string,
    submit: boolean,
  ) => void;
  endorseEvaluation: (
    evaluationId: string,
    finalScore?: number,
    managerNote?: string,
  ) => void;
  submitEvaluationAppeal: (evaluationId: string, appealNote: string) => void;
  resetToDefaults: () => void;
}

function getLatestMetricForGoal(
  goal: GoalDraft,
  evidences: EvidenceItem[],
  checkIns: MonthlyCheckIn[],
): number {
  const latestEvidence = evidences.find((ev) => ev.goalId === goal.id);
  if (latestEvidence) return latestEvidence.metricSnapshot;

  const latestCheckIn = checkIns.find(
    (chk) => chk.goalId === goal.id && chk.status === "SUBMITTED",
  );
  if (latestCheckIn) return latestCheckIn.reportedValue;

  return goal.kpiBinding.baselineValue;
}

function upsertAlertList(
  existingAlerts: DriftAlert[],
  updatedAlert: DriftAlert,
): DriftAlert[] {
  const exists = existingAlerts.some((a) => a.goalId === updatedAlert.goalId);
  if (!exists) return [updatedAlert, ...existingAlerts];
  return existingAlerts.map((a) =>
    a.goalId === updatedAlert.goalId ? updatedAlert : a,
  );
}

export const usePmsStore = create<PmsState>()(
  persist(
    (set, get) => ({
      selectedEmployeeId: MOCK_EMPLOYEES[0].id,
      goals: INITIAL_GOAL_DRAFTS,
      filterStatus: "ALL",
      isGenerating: false,
      maskPii: true,
      activeStage: "PHASE_1_GOALS",
      currentCycleMonth: 3,
      checkIns: INITIAL_CHECKINS,
      evidences: INITIAL_EVIDENCES,
      driftAlerts: INITIAL_DRIFT_ALERTS,
      evaluations: INITIAL_EVALUATIONS,
      auditLogs: INITIAL_AUDIT_LOGS,

      setSelectedEmployeeId: (id: string) => {
        set({ selectedEmployeeId: id });
      },

      setFilterStatus: (filterStatus: FilterStatus) => {
        set({ filterStatus });
      },

      setActiveStage: (activeStage: PmsLifecycleStage) => {
        set({ activeStage });
      },

      setCycleMonth: (month: number) => {
        const clampedMonth = Math.max(1, Math.min(6, Math.round(month)));
        const state = get();
        const recomputedAlerts = state.goals.map((goal) => {
          const currentMetric = getLatestMetricForGoal(
            goal,
            state.evidences,
            state.checkIns,
          );
          return buildDriftAlert(goal, currentMetric, clampedMonth);
        });
        set({
          currentCycleMonth: clampedMonth,
          driftAlerts: recomputedAlerts,
        });
      },

      toggleMaskPii: () => {
        set((state) => ({ maskPii: !state.maskPii }));
      },

      generateDraftGoals: async (employeeId: string) => {
        set({ isGenerating: true });

        // Simulate asynchronous AI inference
        await new Promise((resolve) => setTimeout(resolve, 600));

        const existing = get().goals.find((g) => g.employeeId === employeeId);
        if (existing) {
          // Refresh existing draft
          set((state) => ({
            isGenerating: false,
            goals: state.goals.map((g) =>
              g.id === existing.id
                ? {
                    ...g,
                    status: "DRAFT_AI",
                    confidenceScore: Math.min(0.99, g.confidenceScore + 0.02),
                    updatedAt: new Date().toISOString(),
                  }
                : g,
            ),
          }));
        } else {
          set({ isGenerating: false });
        }
      },

      endorseGoal: (goalId: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  status: "ENDORSED_MANAGER",
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      confirmGoal: (goalId: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  status: "CONFIRMED_EMPLOYEE",
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      updateGoalText: (goalId: string, title: string, description: string) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  title,
                  description,
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
      },

      triggerBotCheckIn: (goalId: string, channel: CheckInChannel) => {
        const state = get();
        const goal = state.goals.find((g) => g.id === goalId);
        const employee = goal
          ? MOCK_EMPLOYEES.find((e) => e.id === goal.employeeId)
          : undefined;
        if (!goal || !employee) return null;

        const checkIn: MonthlyCheckIn = {
          id: `chk-${goal.id}-m${state.currentCycleMonth}-${Date.now().toString().slice(-4)}`,
          goalId: goal.id,
          employeeId: employee.id,
          cycleMonth: state.currentCycleMonth,
          monthLabel: `Month ${state.currentCycleMonth} Check-in`,
          channel,
          botPrompt: buildCheckInBotPrompt(
            employee,
            goal,
            state.currentCycleMonth,
            channel,
            state.maskPii,
          ),
          employeeReply: "",
          reportedValue: getLatestMetricForGoal(
            goal,
            state.evidences,
            state.checkIns,
          ),
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };

        set({
          checkIns: [checkIn, ...state.checkIns],
        });
        return checkIn;
      },

      submitEmployeeCheckIn: (
        checkInId: string,
        replyText: string,
        reportedValue: number,
      ) => {
        const state = get();
        const target = state.checkIns.find((c) => c.id === checkInId);
        if (!target) return;
        const goal = state.goals.find((g) => g.id === target.goalId);
        if (!goal) return;

        const now = new Date().toISOString();
        const newEvidence: EvidenceItem = {
          id: `ev-chk-${Date.now().toString().slice(-5)}`,
          goalId: goal.id,
          employeeId: target.employeeId,
          sourceType: "MANUAL_CHECK",
          metricSnapshot: reportedValue,
          summary: `${target.channel} Bot Check-in (${target.monthLabel}): ${replyText.trim() || "อัปเดตตัวเลขล่าสุด"} (${reportedValue} ${goal.kpiBinding.unit})`,
          verifiedUri: `bot://${target.channel.toLowerCase()}/checkins/${checkInId}`,
          capturedAt: now,
        };

        const alert = buildDriftAlert(
          goal,
          reportedValue,
          state.currentCycleMonth,
        );

        set({
          checkIns: state.checkIns.map((c) =>
            c.id === checkInId
              ? {
                  ...c,
                  employeeReply: replyText.trim() || c.employeeReply,
                  reportedValue,
                  status: "SUBMITTED",
                }
              : c,
          ),
          evidences: [newEvidence, ...state.evidences],
          driftAlerts: upsertAlertList(state.driftAlerts, alert),
        });
      },

      ingestSourceTelemetry: (
        goalId: string,
        measuredValue: number,
        note?: string,
      ) => {
        const state = get();
        const goal = state.goals.find((g) => g.id === goalId);
        if (!goal) return;

        const now = new Date().toISOString();
        const newEvidence: EvidenceItem = {
          id: `ev-tel-${Date.now().toString().slice(-5)}`,
          goalId: goal.id,
          employeeId: goal.employeeId,
          sourceType: goal.kpiBinding.dataSourceType,
          metricSnapshot: measuredValue,
          summary:
            note?.trim() ||
            `Auto-Sync จาก ${goal.kpiBinding.dataSourceType}: ค่าล่าสุด ${measuredValue} ${goal.kpiBinding.unit} (Baseline ${goal.kpiBinding.baselineValue} -> Target ${goal.kpiBinding.targetValue})`,
          verifiedUri: `${goal.kpiBinding.dataSourceUri}#m${state.currentCycleMonth}`,
          capturedAt: now,
        };

        const alert = buildDriftAlert(
          goal,
          measuredValue,
          state.currentCycleMonth,
        );

        set({
          evidences: [newEvidence, ...state.evidences],
          driftAlerts: upsertAlertList(state.driftAlerts, alert),
        });
      },

      acknowledgeDriftAlert: (alertId: string) => {
        set((state) => ({
          driftAlerts: state.driftAlerts.map((a) =>
            a.id === alertId ? { ...a, acknowledged: true } : a,
          ),
        }));
      },

      synthesizeEmployeeEvaluation: (employeeId: string) => {
        const state = get();
        const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
        if (!employee) return;

        const empGoals = state.goals.filter((g) => g.employeeId === employeeId);
        if (empGoals.length === 0) return;

        const nextEvaluations = [...state.evaluations];
        const newLogs: AuditLogEntry[] = [];
        const now = new Date().toISOString();

        for (const goal of empGoals) {
          const prev = nextEvaluations.find((ev) => ev.goalId === goal.id);
          const synthesized = synthesizeEvaluationRecord(
            goal,
            employee,
            state.evidences,
            state.checkIns,
            state.maskPii,
            prev,
          );

          const existingIndex = nextEvaluations.findIndex(
            (ev) => ev.goalId === goal.id,
          );
          if (existingIndex >= 0) {
            nextEvaluations[existingIndex] = synthesized;
          } else {
            nextEvaluations.unshift(synthesized);
          }

          const subjectToken = state.maskPii
            ? employee.anonymizedId
            : employee.name;
          newLogs.push({
            id: `audit-syn-${goal.id}-${Date.now().toString().slice(-5)}`,
            goalId: goal.id,
            employeeId: employee.id,
            actorRole: "AI_AGENT",
            action: "AI_EVALUATION_DRAFTED",
            detail: `Re-synthesized score ${synthesized.proposedScore.toFixed(1)}/5.0 (${synthesized.confidenceTier}) from ${synthesized.citedEvidenceIds.length} evidence items for [${subjectToken}].`,
            timestamp: now,
          });
        }

        set({
          evaluations: nextEvaluations,
          auditLogs: [...newLogs, ...state.auditLogs],
        });
      },

      saveEmployeeSelfReview: (
        evaluationId: string,
        text: string,
        submit: boolean,
      ) => {
        const state = get();
        const target = state.evaluations.find((ev) => ev.id === evaluationId);
        if (!target) return;

        const now = new Date().toISOString();
        const nextStatus = submit ? "SELF_REVIEW_SUBMITTED" : target.status;

        const nextLogs = submit
          ? [
              {
                id: `audit-sr-${Date.now().toString().slice(-5)}`,
                goalId: target.goalId,
                employeeId: target.employeeId,
                actorRole: "EMPLOYEE" as const,
                action: "SELF_REVIEW_SUBMITTED" as const,
                detail: `Employee submitted evidence-cited self-review (${text.trim().length} chars).`,
                timestamp: now,
              },
              ...state.auditLogs,
            ]
          : state.auditLogs;

        set({
          evaluations: state.evaluations.map((ev) =>
            ev.id === evaluationId
              ? {
                  ...ev,
                  employeeSelfReview: text,
                  status: nextStatus,
                  updatedAt: now,
                }
              : ev,
          ),
          auditLogs: nextLogs,
        });
      },

      endorseEvaluation: (
        evaluationId: string,
        finalScore?: number,
        managerNote?: string,
      ) => {
        const state = get();
        const target = state.evaluations.find((ev) => ev.id === evaluationId);
        if (!target) return;

        const resolvedScore =
          typeof finalScore === "number" && Number.isFinite(finalScore)
            ? Math.max(1.0, Math.min(5.0, Math.round(finalScore * 10) / 10))
            : target.proposedScore;
        const isOverride =
          Math.abs(resolvedScore - target.proposedScore) >= 0.05;
        const now = new Date().toISOString();
        const cleanNote = managerNote?.trim() || target.managerNote;

        const logEntry: AuditLogEntry = {
          id: `audit-hitl-${Date.now().toString().slice(-5)}`,
          goalId: target.goalId,
          employeeId: target.employeeId,
          actorRole: "MANAGER",
          action: isOverride
            ? "MANAGER_SCORE_OVERRIDDEN"
            : "MANAGER_SCORE_ENDORSED",
          detail: isOverride
            ? `Manager overrode AI proposed ${target.proposedScore.toFixed(1)} -> ${resolvedScore.toFixed(1)}/5.0 (${cleanNote || "Manual Calibration Adjustment"}).`
            : `Manager HITL 1-click endorsed AI proposed score ${resolvedScore.toFixed(1)}/5.0 (${target.confidenceTier} confidence).`,
          timestamp: now,
        };

        set({
          evaluations: state.evaluations.map((ev) =>
            ev.id === evaluationId
              ? {
                  ...ev,
                  managerScore: resolvedScore,
                  managerNote: cleanNote,
                  status: "ENDORSED_MANAGER",
                  endorsedBy: "Line Manager (HITL Verified)",
                  updatedAt: now,
                }
              : ev,
          ),
          auditLogs: [logEntry, ...state.auditLogs],
        });
      },

      submitEvaluationAppeal: (evaluationId: string, appealNote: string) => {
        const state = get();
        const target = state.evaluations.find((ev) => ev.id === evaluationId);
        if (!target) return;

        const cleanAppeal =
          appealNote.trim() || "พนักงานขอให้ทบทวนคะแนนเพิ่มเติมจากหลักฐานแนบ";
        const now = new Date().toISOString();

        const logEntry: AuditLogEntry = {
          id: `audit-app-${Date.now().toString().slice(-5)}`,
          goalId: target.goalId,
          employeeId: target.employeeId,
          actorRole: "EMPLOYEE",
          action: "EMPLOYEE_APPEAL_RAISED",
          detail: `Employee raised transparent appeal/review request: ${cleanAppeal}`,
          timestamp: now,
        };

        set({
          evaluations: state.evaluations.map((ev) =>
            ev.id === evaluationId
              ? {
                  ...ev,
                  appealNote: cleanAppeal,
                  status: "DISPUTED",
                  updatedAt: now,
                }
              : ev,
          ),
          auditLogs: [logEntry, ...state.auditLogs],
        });
      },

      resetToDefaults: () => {
        set({
          selectedEmployeeId: MOCK_EMPLOYEES[0].id,
          goals: INITIAL_GOAL_DRAFTS,
          filterStatus: "ALL",
          isGenerating: false,
          maskPii: true,
          activeStage: "PHASE_1_GOALS",
          currentCycleMonth: 3,
          checkIns: INITIAL_CHECKINS,
          evidences: INITIAL_EVIDENCES,
          driftAlerts: INITIAL_DRIFT_ALERTS,
          evaluations: INITIAL_EVALUATIONS,
          auditLogs: INITIAL_AUDIT_LOGS,
        });
      },
    }),
    {
      name: "rsxyz-pms-agent-store-v1",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    },
  ),
);
