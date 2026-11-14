import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AiExecutionMode,
  AiRuntimeSource,
  BridgeCircuitState,
} from "@/app/lib/ai/bridgeRuntime";
import { buildCheckInBotPrompt, buildDriftAlert } from "../engine/driftEngine";
import { synthesizeEvaluationRecord } from "../engine/evaluationEngine";
import { synthesizePublishPackage } from "../engine/publishEngine";
import {
  type AuditLogEntry,
  type BusinessUnitScope,
  type CalibrationDecision,
  type CalibrationDecisionStatus,
  type CheckInChannel,
  type CorporateTone,
  type DriftAlert,
  type EvaluationRecord,
  type EvidenceItem,
  type GoalDraft,
  INITIAL_AUDIT_LOGS,
  INITIAL_CALIBRATION_DECISIONS,
  INITIAL_CHECKINS,
  INITIAL_DRIFT_ALERTS,
  INITIAL_EVALUATIONS,
  INITIAL_EVIDENCES,
  INITIAL_GOAL_DRAFTS,
  INITIAL_PUBLISH_PACKAGES,
  MOCK_EMPLOYEES,
  type MonthlyCheckIn,
  type PublishPackageRecord,
} from "./mockData";

export type FilterStatus =
  | "ALL"
  | "DRAFT_AI"
  | "ENDORSED_MANAGER"
  | "CONFIRMED_EMPLOYEE";

export type PmsLifecycleStage =
  | "PHASE_1_GOALS"
  | "PHASE_2_IN_CYCLE"
  | "PHASE_3_EVALUATION"
  | "PHASE_4_CALIBRATION"
  | "PHASE_5_PUBLISH";

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

  // Phase 4: Calibration Analytics & Bias Detection
  calibrationBuFilter: BusinessUnitScope;
  calibrationDecisions: Record<string, CalibrationDecision>;

  // Phase 5: Publishing, Tone-of-Voice Feedback & Continuous IDP Loop
  publishPackages: PublishPackageRecord[];

  // Production AI Bridge Telemetry & Mode
  aiMode: AiExecutionMode;
  aiSourceBadge: AiRuntimeSource;
  aiCircuitState: BridgeCircuitState;
  aiLatencyMs: number | null;
  aiLastRedactionCount: number;

  setSelectedEmployeeId: (id: string) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setActiveStage: (stage: PmsLifecycleStage) => void;
  setCycleMonth: (month: number) => void;
  setAiMode: (mode: AiExecutionMode) => void;
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
  synthesizeEmployeeEvaluationWithBridge: (employeeId: string) => Promise<void>;
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
  setCalibrationBuFilter: (scope: BusinessUnitScope) => void;
  resolveCalibrationCase: (
    goalId: string,
    calibratedScore: number,
    decisionStatus: Exclude<CalibrationDecisionStatus, "FLAGGED">,
    committeeNote: string,
  ) => void;
  generatePublishPackage: (employeeId: string, tone: CorporateTone) => void;
  generatePublishPackageWithBridge: (
    employeeId: string,
    tone: CorporateTone,
  ) => Promise<void>;
  updatePublishPackage: (
    packageId: string,
    feedbackText: string,
    idpActionPlan: string,
  ) => void;
  publishFeedbackPackage: (packageId: string) => void;
  feedIdpToNextCycleGoal: (packageId: string) => GoalDraft | null;
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

interface PmsBridgeEnvelope<TResult> {
  ok: boolean;
  source: AiRuntimeSource;
  circuitState: BridgeCircuitState;
  latencyMs: number | null;
  redactionCount: number;
  result?: TResult;
}

async function invokePmsSynthesizeBridge<TResult>(
  payload: Record<string, unknown>,
  aiMode: AiExecutionMode,
): Promise<PmsBridgeEnvelope<TResult>> {
  if (aiMode === "LOCAL_ONLY") {
    return {
      ok: false,
      source: "LOCAL_ONLY",
      circuitState: "CLOSED",
      latencyMs: 0,
      redactionCount: 0,
    };
  }

  const controller = new AbortController();
  const clientTimer = setTimeout(() => controller.abort(), 8_000);

  try {
    const res = await fetch("/api/pms/synthesize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as {
      ok?: boolean;
      source?: string;
      circuitState?: BridgeCircuitState;
      latencyMs?: number;
      redactionCount?: number;
      result?: TResult;
    };

    if (res.ok && data.ok && data.result) {
      return {
        ok: true,
        source: "LIVE_GEMINI",
        circuitState: data.circuitState ?? "CLOSED",
        latencyMs: data.latencyMs ?? null,
        redactionCount: data.redactionCount ?? 0,
        result: data.result,
      };
    }

    return {
      ok: false,
      source: "LOCAL_FALLBACK",
      circuitState: data.circuitState ?? "CLOSED",
      latencyMs: data.latencyMs ?? 0,
      redactionCount: data.redactionCount ?? 0,
    };
  } catch {
    return {
      ok: false,
      source: "LOCAL_FALLBACK",
      circuitState: "OPEN",
      latencyMs: 0,
      redactionCount: 0,
    };
  } finally {
    clearTimeout(clientTimer);
  }
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
      calibrationBuFilter: "ALL",
      calibrationDecisions: INITIAL_CALIBRATION_DECISIONS,
      publishPackages: INITIAL_PUBLISH_PACKAGES,
      aiMode: "AUTO",
      aiSourceBadge: "IDLE",
      aiCircuitState: "CLOSED",
      aiLatencyMs: null,
      aiLastRedactionCount: 0,

      setSelectedEmployeeId: (id: string) => {
        set({ selectedEmployeeId: id });
      },

      setFilterStatus: (filterStatus: FilterStatus) => {
        set({ filterStatus });
      },

      setActiveStage: (activeStage: PmsLifecycleStage) => {
        set({ activeStage });
      },

      setAiMode: (aiMode: AiExecutionMode) => {
        set({
          aiMode,
          aiSourceBadge: aiMode === "LOCAL_ONLY" ? "LOCAL_ONLY" : "IDLE",
        });
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

        const stateSnapshot = get();
        const existing = stateSnapshot.goals.find(
          (g) => g.employeeId === employeeId,
        );
        const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);

        if (!existing || !employee) {
          set({ isGenerating: false });
          return;
        }

        const bridge = await invokePmsSynthesizeBridge<{
          refinedTitle: string;
          refinedDescription: string;
          smartCritique: string[];
        }>(
          {
            action: "DRAFT_GOAL",
            employeeAnonymizedId: employee.anonymizedId,
            role: employee.role,
            department: employee.department,
            okrAlignment: existing.okrAlignment,
            existingGoalTitle: existing.title,
            metricName: existing.kpiBinding.metricName,
            baselineValue: existing.kpiBinding.baselineValue,
            targetValue: existing.kpiBinding.targetValue,
            unit: existing.kpiBinding.unit,
            knownSensitiveNames: [employee.name],
          },
          stateSnapshot.aiMode,
        );

        set((state) => ({
          isGenerating: false,
          aiSourceBadge: bridge.source,
          aiCircuitState: bridge.circuitState,
          aiLatencyMs: bridge.latencyMs,
          aiLastRedactionCount: bridge.redactionCount,
          goals: state.goals.map((g) =>
            g.id === existing.id
              ? {
                  ...g,
                  ...(bridge.ok && bridge.result
                    ? {
                        title: bridge.result.refinedTitle,
                        description: bridge.result.refinedDescription,
                        smartValidation: {
                          ...g.smartValidation,
                          critique: bridge.result.smartCritique,
                        },
                      }
                    : {}),
                  status: "DRAFT_AI",
                  confidenceScore: Math.min(0.99, g.confidenceScore + 0.02),
                  updatedAt: new Date().toISOString(),
                }
              : g,
          ),
        }));
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

      synthesizeEmployeeEvaluationWithBridge: async (employeeId: string) => {
        // Compute deterministic baseline synchronously first
        get().synthesizeEmployeeEvaluation(employeeId);

        const state = get();
        const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
        const goal = state.goals.find((g) => g.employeeId === employeeId);
        if (!employee || !goal) return;

        const latestMetric = getLatestMetricForGoal(
          goal,
          state.evidences,
          state.checkIns,
        );
        const relevantEvidences = state.evidences
          .filter((ev) => ev.goalId === goal.id)
          .slice(0, 6)
          .map((ev) => `${ev.sourceType}: ${ev.summary}`);

        set({ isGenerating: true });

        const bridge = await invokePmsSynthesizeBridge<{
          aiSummary: string;
          selfReviewDraft: string;
          keyHighlight: string;
        }>(
          {
            action: "SYNTHESIZE_EVALUATION",
            employeeAnonymizedId: employee.anonymizedId,
            goalTitle: goal.title,
            metricName: goal.kpiBinding.metricName,
            baselineValue: goal.kpiBinding.baselineValue,
            targetValue: goal.kpiBinding.targetValue,
            latestMetric,
            evidenceSummaries: relevantEvidences,
            knownSensitiveNames: [employee.name],
          },
          state.aiMode,
        );

        set((curr) => ({
          isGenerating: false,
          aiSourceBadge: bridge.source,
          aiCircuitState: bridge.circuitState,
          aiLatencyMs: bridge.latencyMs,
          aiLastRedactionCount: bridge.redactionCount,
          ...(bridge.ok && bridge.result
            ? {
                evaluations: curr.evaluations.map((ev) =>
                  ev.goalId === goal.id
                    ? {
                        ...ev,
                        aiSummary: bridge.result!.aiSummary,
                        employeeSelfReview: bridge.result!.selfReviewDraft,
                        updatedAt: new Date().toISOString(),
                      }
                    : ev,
                ),
              }
            : {}),
        }));
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

      setCalibrationBuFilter: (calibrationBuFilter: BusinessUnitScope) => {
        set({ calibrationBuFilter });
      },

      resolveCalibrationCase: (
        goalId: string,
        calibratedScore: number,
        decisionStatus: Exclude<CalibrationDecisionStatus, "FLAGGED">,
        committeeNote: string,
      ) => {
        const state = get();
        const targetEval = state.evaluations.find((ev) => ev.goalId === goalId);
        if (!targetEval) return;

        const boundedScore = Math.max(
          1.0,
          Math.min(5.0, Math.round(calibratedScore * 10) / 10),
        );
        const cleanNote =
          committeeNote.trim() ||
          "Calibration Committee aligned score against BU Bell Curve.";
        const now = new Date().toISOString();

        const decision: CalibrationDecision = {
          goalId,
          status: decisionStatus,
          calibratedScore: boundedScore,
          committeeNote: cleanNote,
          updatedAt: now,
        };

        const logEntry: AuditLogEntry = {
          id: `audit-cal-${Date.now().toString().slice(-5)}`,
          goalId,
          employeeId: targetEval.employeeId,
          actorRole: "EXECUTIVE",
          action: "CALIBRATION_COMMITTEE_DECIDED",
          detail: `${decisionStatus}: Final calibrated score ${boundedScore.toFixed(1)}/5.0 (AI proposed ${targetEval.proposedScore.toFixed(1)}) - ${cleanNote}`,
          timestamp: now,
        };

        set({
          calibrationDecisions: {
            ...state.calibrationDecisions,
            [goalId]: decision,
          },
          evaluations: state.evaluations.map((ev) =>
            ev.goalId === goalId
              ? {
                  ...ev,
                  managerScore: boundedScore,
                  managerNote: cleanNote,
                  status: "ENDORSED_MANAGER",
                  endorsedBy: "Calibration Committee (Executive HITL)",
                  updatedAt: now,
                }
              : ev,
          ),
          auditLogs: [logEntry, ...state.auditLogs],
        });
      },

      generatePublishPackage: (employeeId: string, tone: CorporateTone) => {
        const state = get();
        const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
        if (!employee) return;

        const empGoals = state.goals.filter((g) => g.employeeId === employeeId);
        if (empGoals.length === 0) return;

        const nextPackages = [...state.publishPackages];
        for (const goal of empGoals) {
          const evalRecord = state.evaluations.find(
            (ev) => ev.goalId === goal.id,
          );
          if (!evalRecord) continue;

          const drift = state.driftAlerts.find((d) => d.goalId === goal.id);
          const prev = nextPackages.find((p) => p.goalId === goal.id);
          const synthesized = synthesizePublishPackage(
            goal,
            employee,
            evalRecord,
            state.calibrationDecisions,
            drift,
            tone,
            state.maskPii,
            prev,
          );

          const idx = nextPackages.findIndex((p) => p.goalId === goal.id);
          if (idx >= 0) {
            nextPackages[idx] = synthesized;
          } else {
            nextPackages.unshift(synthesized);
          }
        }

        set({ publishPackages: nextPackages });
      },

      generatePublishPackageWithBridge: async (
        employeeId: string,
        tone: CorporateTone,
      ) => {
        get().generatePublishPackage(employeeId, tone);

        const state = get();
        const employee = MOCK_EMPLOYEES.find((e) => e.id === employeeId);
        const targetPkg = state.publishPackages.find(
          (p) => p.employeeId === employeeId,
        );
        const goal = targetPkg
          ? state.goals.find((g) => g.id === targetPkg.goalId)
          : state.goals.find((g) => g.employeeId === employeeId);
        if (!employee || !targetPkg || !goal) return;

        set({ isGenerating: true });

        const bridge = await invokePmsSynthesizeBridge<{
          feedbackText: string;
          idpActionPlan: string;
        }>(
          {
            action: "SYNTHESIZE_FEEDBACK",
            employeeAnonymizedId: employee.anonymizedId,
            tone,
            goalTitle: goal.title,
            calibratedScore: targetPkg.calibratedScore,
            managerNote: targetPkg.hrEditedFeedback,
            idpFocusSkill: targetPkg.idpFocusSkill,
            knownSensitiveNames: [employee.name],
          },
          state.aiMode,
        );

        set((curr) => ({
          isGenerating: false,
          aiSourceBadge: bridge.source,
          aiCircuitState: bridge.circuitState,
          aiLatencyMs: bridge.latencyMs,
          aiLastRedactionCount: bridge.redactionCount,
          ...(bridge.ok && bridge.result
            ? {
                publishPackages: curr.publishPackages.map((pkg) =>
                  pkg.id === targetPkg.id
                    ? {
                        ...pkg,
                        aiGeneratedFeedback: bridge.result!.feedbackText,
                        hrEditedFeedback: bridge.result!.feedbackText,
                        idpActionPlan: bridge.result!.idpActionPlan,
                        updatedAt: new Date().toISOString(),
                      }
                    : pkg,
                ),
              }
            : {}),
        }));
      },

      updatePublishPackage: (
        packageId: string,
        feedbackText: string,
        idpActionPlan: string,
      ) => {
        const now = new Date().toISOString();
        set((state) => ({
          publishPackages: state.publishPackages.map((pkg) =>
            pkg.id === packageId
              ? {
                  ...pkg,
                  hrEditedFeedback: feedbackText,
                  idpActionPlan,
                  updatedAt: now,
                }
              : pkg,
          ),
        }));
      },

      publishFeedbackPackage: (packageId: string) => {
        const state = get();
        const target = state.publishPackages.find((p) => p.id === packageId);
        if (!target) return;

        const now = new Date().toISOString();
        const logEntry: AuditLogEntry = {
          id: `audit-pub-${Date.now().toString().slice(-5)}`,
          goalId: target.goalId,
          employeeId: target.employeeId,
          actorRole: "HR",
          action: "FEEDBACK_PUBLISHED_HR",
          detail: `HR People Partner published ${target.tone} feedback & IDP (Score ${target.calibratedScore.toFixed(1)}/5.0).`,
          timestamp: now,
        };

        set({
          publishPackages: state.publishPackages.map((pkg) =>
            pkg.id === packageId
              ? {
                  ...pkg,
                  status: "PUBLISHED",
                  publishedBy: "HR People Partner (HITL)",
                  updatedAt: now,
                }
              : pkg,
          ),
          auditLogs: [logEntry, ...state.auditLogs],
        });
      },

      feedIdpToNextCycleGoal: (packageId: string) => {
        const state = get();
        const target = state.publishPackages.find((p) => p.id === packageId);
        if (!target) return null;

        const parentGoal = state.goals.find((g) => g.id === target.goalId);
        if (!parentGoal) return null;

        const nextGoalId = `goal-next-${target.goalId}`;
        const alreadyExists = state.goals.some((g) => g.id === nextGoalId);
        const now = new Date().toISOString();

        const seededGoal: GoalDraft = alreadyExists
          ? state.goals.find((g) => g.id === nextGoalId)!
          : {
              id: nextGoalId,
              employeeId: target.employeeId,
              title: target.nextCycleGoalTitle,
              description: `Seeded continuously from Cycle 1 IDP (${target.idpFocusSkill}): ${target.idpActionPlan}`,
              okrAlignment: parentGoal.okrAlignment,
              departmentProblem: `Continuous IDP carryover after Cycle 1 calibrated score ${target.calibratedScore.toFixed(1)}/5.0`,
              kpiBinding: {
                kpiId: `kpi-next-${parentGoal.kpiBinding.kpiId}`,
                metricName: parentGoal.kpiBinding.metricName,
                baselineValue: parentGoal.kpiBinding.targetValue,
                targetValue: target.nextCycleTargetValue,
                unit: parentGoal.kpiBinding.unit,
                dataSourceType: parentGoal.kpiBinding.dataSourceType,
                dataSourceUri: `${parentGoal.kpiBinding.dataSourceUri}#next-cycle`,
              },
              smartValidation: {
                specific: true,
                measurable: true,
                achievable: true,
                relevant: true,
                timeBound: true,
                score: 94,
                critique: [
                  "Generated from previous cycle IDP & calibrated outcome.",
                  "Bound to next-cycle quantitative KPI target and verified URI.",
                ],
              },
              confidenceScore: 0.93,
              status: "DRAFT_AI",
              updatedAt: now,
            };

        const logEntry: AuditLogEntry = {
          id: `audit-idp-${Date.now().toString().slice(-5)}`,
          goalId: seededGoal.id,
          employeeId: target.employeeId,
          actorRole: "HR",
          action: "IDP_FED_TO_NEXT_CYCLE",
          detail: `Fed IDP (${target.idpFocusSkill}) into Phase 1 Next-Cycle Goal Studio [${seededGoal.id}].`,
          timestamp: now,
        };

        set({
          goals: alreadyExists ? state.goals : [seededGoal, ...state.goals],
          publishPackages: state.publishPackages.map((pkg) =>
            pkg.id === packageId
              ? { ...pkg, fedToNextCycle: true, updatedAt: now }
              : pkg,
          ),
          auditLogs: [logEntry, ...state.auditLogs],
        });

        return seededGoal;
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
          calibrationBuFilter: "ALL",
          calibrationDecisions: INITIAL_CALIBRATION_DECISIONS,
          publishPackages: INITIAL_PUBLISH_PACKAGES,
          aiMode: "AUTO",
          aiSourceBadge: "IDLE",
          aiCircuitState: "CLOSED",
          aiLatencyMs: null,
          aiLastRedactionCount: 0,
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
