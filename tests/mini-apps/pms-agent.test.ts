import { describe, expect, it, beforeEach } from "bun:test";
import { usePmsStore } from "../../app/projects/(micro-apps)/pms-agent/store/usePmsStore";
import {
  MOCK_EMPLOYEES,
  INITIAL_GOAL_DRAFTS,
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
});
