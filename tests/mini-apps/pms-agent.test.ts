import { describe, expect, it, beforeEach } from "bun:test";
import {
  analyzeManagerBias,
  buildCalibrationQueue,
  computeBellCurveDistribution,
} from "../../app/projects/(micro-apps)/pms-agent/engine/calibrationEngine";
import {
  buildCheckInBotPrompt,
  computeGoalProgressAndDrift,
} from "../../app/projects/(micro-apps)/pms-agent/engine/driftEngine";
import {
  computeGoalRatingProposal,
  mapProgressToRatingScore,
} from "../../app/projects/(micro-apps)/pms-agent/engine/evaluationEngine";
import { synthesizePublishPackage } from "../../app/projects/(micro-apps)/pms-agent/engine/publishEngine";
import { usePmsStore } from "../../app/projects/(micro-apps)/pms-agent/store/usePmsStore";
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_CHECKINS,
  INITIAL_EVALUATIONS,
  INITIAL_EVIDENCES,
  INITIAL_GOAL_DRAFTS,
  MOCK_EMPLOYEES,
} from "../../app/projects/(micro-apps)/pms-agent/store/mockData";

describe("PMS AI Agent Micro-App Store & State Machine", () => {
  beforeEach(() => {
    usePmsStore.getState().resetToDefaults();
  });

  it("should initialize with default employee and initial goals", () => {
    const state = usePmsStore.getState();
    expect(state.selectedEmployeeId).toBe(MOCK_EMPLOYEES[0].id);
    expect(state.goals.length).toBe(INITIAL_GOAL_DRAFTS.length);
    expect(state.maskPii).toBe(true);
    expect(state.filterStatus).toBe("ALL");
  });

  it("should enforce mandatory KPI and Baseline binding on all goals", () => {
    const { goals } = usePmsStore.getState();
    for (const goal of goals) {
      expect(goal.kpiBinding).toBeDefined();
      expect(goal.kpiBinding.metricName.length).toBeGreaterThan(0);
      expect(goal.kpiBinding.baselineValue).toBeGreaterThan(0);
      expect(goal.kpiBinding.targetValue).toBeGreaterThan(0);
      expect(goal.kpiBinding.dataSourceUri.length).toBeGreaterThan(0);
      expect(goal.smartValidation.score).toBeGreaterThanOrEqual(80);
    }
  });

  it("should transition goal through HITL lifecycle: DRAFT -> ENDORSED -> CONFIRMED", () => {
    const store = usePmsStore.getState();
    const targetGoal = store.goals[0];
    expect(targetGoal.status).toBe("DRAFT_AI");

    // Manager Endorsement
    store.endorseGoal(targetGoal.id);
    let updated = usePmsStore
      .getState()
      .goals.find((g) => g.id === targetGoal.id);
    expect(updated?.status).toBe("ENDORSED_MANAGER");

    // Employee Confirmation
    store.confirmGoal(targetGoal.id);
    updated = usePmsStore.getState().goals.find((g) => g.id === targetGoal.id);
    expect(updated?.status).toBe("CONFIRMED_EMPLOYEE");
  });

  it("should toggle PII protection state", () => {
    const store = usePmsStore.getState();
    expect(store.maskPii).toBe(true);

    store.toggleMaskPii();
    expect(usePmsStore.getState().maskPii).toBe(false);

    store.toggleMaskPii();
    expect(usePmsStore.getState().maskPii).toBe(true);
  });

  it("should update goal title and description via manual edit", () => {
    const store = usePmsStore.getState();
    const targetGoal = store.goals[0];

    store.updateGoalText(
      targetGoal.id,
      "Refactored Title",
      "Refactored Description",
    );
    const updated = usePmsStore
      .getState()
      .goals.find((g) => g.id === targetGoal.id);
    expect(updated?.title).toBe("Refactored Title");
    expect(updated?.description).toBe("Refactored Description");
  });

  it("computes bidirectional KPI progress and drift classifications accurately", () => {
    // Lower-is-better KPI: Engineering PR Cycle Time (48 -> 18 Hours)
    const engGoal = INITIAL_GOAL_DRAFTS[0];
    const engOnTrack = computeGoalProgressAndDrift(engGoal, 30, 3);
    expect(engOnTrack.progressPct).toBe(60);
    expect(engOnTrack.expectedPct).toBe(50);
    expect(engOnTrack.severity).toBe("ON_TRACK");

    // Higher-is-better KPI: Operations Dispatch SLA (88 -> 98 %)
    const opsGoal = INITIAL_GOAL_DRAFTS[2];
    const opsAtRisk = computeGoalProgressAndDrift(opsGoal, 91.5, 3);
    expect(opsAtRisk.progressPct).toBe(35);
    expect(opsAtRisk.severity).toBe("AT_RISK");

    const opsCritical = computeGoalProgressAndDrift(opsGoal, 88.5, 3);
    expect(opsCritical.progressPct).toBe(5);
    expect(opsCritical.severity).toBe("CRITICAL_DRIFT");
  });

  it("enforces PII redaction in Slack/LINE bot check-in prompts", () => {
    const emp = MOCK_EMPLOYEES[0];
    const goal = INITIAL_GOAL_DRAFTS[0];

    const maskedPrompt = buildCheckInBotPrompt(emp, goal, 3, "SLACK", true);
    expect(maskedPrompt).toContain(emp.anonymizedId);
    expect(maskedPrompt).not.toContain(emp.name);

    const revealedPrompt = buildCheckInBotPrompt(emp, goal, 3, "LINE", false);
    expect(revealedPrompt).toContain(emp.name);
    expect(revealedPrompt).toContain("LINE OA Bot");
  });

  it("supports monthly bot check-ins, telemetry ingestion, and HITL drift acknowledgment", () => {
    const store = usePmsStore.getState();
    store.setActiveStage("PHASE_2_IN_CYCLE");
    expect(usePmsStore.getState().activeStage).toBe("PHASE_2_IN_CYCLE");

    // Trigger Slack bot ping for Engineering goal
    const ping = store.triggerBotCheckIn("goal-eng-01", "SLACK");
    expect(ping).not.toBeNull();
    expect(ping?.status).toBe("PENDING");
    expect(usePmsStore.getState().checkIns.length).toBe(
      INITIAL_CHECKINS.length + 1,
    );

    // Submit reply pushing KPI further down (worse cycle time = 45h -> CRITICAL_DRIFT at M3)
    store.submitEmployeeCheckIn(ping!.id, "Review queue blocked", 45);
    let updated = usePmsStore.getState();
    expect(updated.evidences.length).toBe(INITIAL_EVIDENCES.length + 1);
    const updatedAlert = updated.driftAlerts.find(
      (a) => a.goalId === "goal-eng-01",
    );
    expect(updatedAlert?.severity).toBe("CRITICAL_DRIFT");
    expect(updatedAlert?.acknowledged).toBe(false);

    // Manager HITL acknowledge
    updated.acknowledgeDriftAlert(updatedAlert!.id);
    updated = usePmsStore.getState();
    const ackedAlert = updated.driftAlerts.find(
      (a) => a.goalId === "goal-eng-01",
    );
    expect(ackedAlert?.acknowledged).toBe(true);

    // Ingest good telemetry recovery -> ON_TRACK
    updated.ingestSourceTelemetry("goal-eng-01", 24, "CI fast-track shipped");
    const recoveredAlert = usePmsStore
      .getState()
      .driftAlerts.find((a) => a.goalId === "goal-eng-01");
    expect(recoveredAlert?.severity).toBe("ON_TRACK");
    expect(recoveredAlert?.progressPct).toBe(80);
  });

  it("synthesizes evidence-grounded rating proposals and PII-safe self-review drafts", () => {
    expect(mapProgressToRatingScore(0)).toBe(1.5);
    expect(mapProgressToRatingScore(100)).toBe(4.2);

    const eng = MOCK_EMPLOYEES[0];
    const engGoal = INITIAL_GOAL_DRAFTS[0];
    const maskedProposal = computeGoalRatingProposal(
      engGoal,
      eng,
      INITIAL_EVIDENCES,
      INITIAL_CHECKINS,
      true,
    );
    expect(maskedProposal.confidenceTier).toBe("HIGH");
    expect(maskedProposal.aiSelfReviewDraft).toContain(eng.anonymizedId);
    expect(maskedProposal.aiSelfReviewDraft).not.toContain(eng.name);
    expect(maskedProposal.citedEvidences.length).toBeGreaterThan(0);

    const sales = MOCK_EMPLOYEES[1];
    const salesGoal = INITIAL_GOAL_DRAFTS[1];
    const lowConfidenceProposal = computeGoalRatingProposal(
      salesGoal,
      sales,
      INITIAL_EVIDENCES,
      INITIAL_CHECKINS,
      false,
    );
    expect(lowConfidenceProposal.confidenceTier).toBe("LOW");
    expect(lowConfidenceProposal.aiSelfReviewDraft).toContain(sales.name);
  });

  it("connects live Phase 2 telemetry into Phase 3 evaluation, HITL endorse/override, appeal, and audit ledger", () => {
    const store = usePmsStore.getState();
    store.setActiveStage("PHASE_3_EVALUATION");
    expect(usePmsStore.getState().activeStage).toBe("PHASE_3_EVALUATION");
    expect(usePmsStore.getState().evaluations.length).toBe(
      INITIAL_EVALUATIONS.length,
    );

    // Hit 100% target (18 Hours) in Phase 2 telemetry and re-synthesize Phase 3
    store.ingestSourceTelemetry("goal-eng-01", 18, "Reached 18h PR SLA target");
    usePmsStore.getState().synthesizeEmployeeEvaluation("emp-eng-01");

    let state = usePmsStore.getState();
    const resynthesized = state.evaluations.find(
      (ev) => ev.goalId === "goal-eng-01",
    );
    expect(resynthesized?.progressPct).toBe(100);
    expect(resynthesized?.proposedScore).toBe(4.2);
    expect(resynthesized?.citedEvidenceIds.length).toBe(2);

    // Employee saves & submits self-review
    state.saveEmployeeSelfReview(
      resynthesized!.id,
      "Updated self-review citing 18h PR target achievement.",
      true,
    );
    state = usePmsStore.getState();
    expect(
      state.evaluations.find((ev) => ev.id === resynthesized!.id)?.status,
    ).toBe("SELF_REVIEW_SUBMITTED");

    // Manager HITL override score with rationale
    state.endorseEvaluation(
      resynthesized!.id,
      4.5,
      "Delivered ahead of Q2 deadline",
    );
    state = usePmsStore.getState();
    const endorsed = state.evaluations.find(
      (ev) => ev.id === resynthesized!.id,
    );
    expect(endorsed?.status).toBe("ENDORSED_MANAGER");
    expect(endorsed?.managerScore).toBe(4.5);
    expect(state.auditLogs[0].action).toBe("MANAGER_SCORE_OVERRIDDEN");

    // Employee appeal verification
    state.submitEvaluationAppeal(
      "eval-goal-sal-01",
      "Legal SLA blocked deals; requesting recalibration.",
    );
    state = usePmsStore.getState();
    const appealed = state.evaluations.find(
      (ev) => ev.id === "eval-goal-sal-01",
    );
    expect(appealed?.status).toBe("DISPUTED");
    expect(state.auditLogs.length).toBeGreaterThan(INITIAL_AUDIT_LOGS.length);
    expect(state.auditLogs[0].action).toBe("EMPLOYEE_APPEAL_RAISED");
  });

  it("computes BU Bell Curve distribution and detects Manager Leniency/Strictness skew", () => {
    const store = usePmsStore.getState();

    // Force Engineering manager override +0.8 (3.1 -> 3.9 => LENIENCY_SKEW)
    store.endorseEvaluation("eval-goal-eng-01", 3.9, "Manual bump");
    // Force Sales manager override -0.7 (2.2 -> 1.5 => STRICTNESS_SKEW)
    usePmsStore
      .getState()
      .endorseEvaluation("eval-goal-sal-01", 1.5, "Strict legal penalty");

    const updated = usePmsStore.getState();
    const biasList = analyzeManagerBias(
      updated.evaluations,
      MOCK_EMPLOYEES,
      "ALL",
    );
    const engBias = biasList.find((b) => b.department === "Engineering");
    const salBias = biasList.find((b) => b.department === "Sales");
    expect(engBias?.skewStatus).toBe("LENIENCY_SKEW");
    expect(salBias?.skewStatus).toBe("STRICTNESS_SKEW");

    const buckets = computeBellCurveDistribution(
      updated.evaluations,
      MOCK_EMPLOYEES,
      "ALL",
      updated.calibrationDecisions,
    );
    const totalCount = buckets.reduce((sum, b) => sum + b.count, 0);
    expect(totalCount).toBe(3);

    const maskedQueue = buildCalibrationQueue(
      updated.evaluations,
      MOCK_EMPLOYEES,
      updated.calibrationDecisions,
      true,
      "ALL",
    );
    expect(maskedQueue.length).toBeGreaterThanOrEqual(2);
    expect(maskedQueue[0].displayIdentity).toContain("ANON");
  });

  it("resolves Executive Calibration Committee cases with BU filter and audit logging", () => {
    const store = usePmsStore.getState();
    store.setActiveStage("PHASE_4_CALIBRATION");
    store.setCalibrationBuFilter("Sales");
    expect(usePmsStore.getState().calibrationBuFilter).toBe("Sales");

    store.resolveCalibrationCase(
      "goal-sal-01",
      2.8,
      "COMMITTEE_ADJUSTED",
      "Adjusted upward due to external legal bottleneck.",
    );

    const updated = usePmsStore.getState();
    expect(updated.calibrationDecisions["goal-sal-01"]?.status).toBe(
      "COMMITTEE_ADJUSTED",
    );
    expect(updated.calibrationDecisions["goal-sal-01"]?.calibratedScore).toBe(
      2.8,
    );
    const updatedEval = updated.evaluations.find(
      (ev) => ev.goalId === "goal-sal-01",
    );
    expect(updatedEval?.managerScore).toBe(2.8);
    expect(updatedEval?.endorsedBy).toContain("Calibration Committee");
    expect(updated.auditLogs[0].action).toBe("CALIBRATION_COMMITTEE_DECIDED");
  });

  it("synthesizes Tone-of-Voice feedback drafts respecting PII masking and calibrated scores", () => {
    const store = usePmsStore.getState();
    store.resolveCalibrationCase(
      "goal-eng-01",
      4.4,
      "COMMITTEE_ADJUSTED",
      "Strong engineering leadership",
    );
    const updated = usePmsStore.getState();
    const pkg = synthesizePublishPackage(
      updated.goals[0],
      MOCK_EMPLOYEES[0],
      updated.evaluations[0],
      updated.calibrationDecisions,
      updated.driftAlerts[0],
      "EXECUTIVE_DIRECT",
      true,
    );
    expect(pkg.calibratedScore).toBe(4.4);
    expect(pkg.hrEditedFeedback).toContain(MOCK_EMPLOYEES[0].anonymizedId);
    expect(pkg.hrEditedFeedback).not.toContain(MOCK_EMPLOYEES[0].name);
    expect(pkg.hrEditedFeedback).toContain("4.4/5.0");
  });

  it("executes HR HITL publish and feeds IDP back into Phase 1 next-cycle Goal Studio", () => {
    const store = usePmsStore.getState();
    store.setActiveStage("PHASE_5_PUBLISH");
    store.generatePublishPackage("emp-eng-01", "COACHING_GROWTH");

    const initialGoalCount = usePmsStore.getState().goals.length;
    const pkg = usePmsStore
      .getState()
      .publishPackages.find((p) => p.goalId === "goal-eng-01");
    expect(pkg).toBeDefined();

    usePmsStore.getState().publishFeedbackPackage(pkg!.id);
    expect(
      usePmsStore.getState().publishPackages.find((p) => p.id === pkg!.id)
        ?.status,
    ).toBe("PUBLISHED");
    expect(usePmsStore.getState().auditLogs[0].action).toBe(
      "FEEDBACK_PUBLISHED_HR",
    );

    const seededGoal = usePmsStore.getState().feedIdpToNextCycleGoal(pkg!.id);
    expect(seededGoal).not.toBeNull();
    expect(seededGoal?.title).toContain("[IDP Next-Cycle]");

    const afterState = usePmsStore.getState();
    expect(afterState.goals.length).toBe(initialGoalCount + 1);
    expect(
      afterState.publishPackages.find((p) => p.id === pkg!.id)?.fedToNextCycle,
    ).toBe(true);
    expect(afterState.auditLogs[0].action).toBe("IDP_FED_TO_NEXT_CYCLE");
  });
});
