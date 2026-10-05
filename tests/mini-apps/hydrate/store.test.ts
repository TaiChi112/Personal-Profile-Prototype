import { describe, it, expect, beforeEach } from "bun:test";
import { useWaterStore } from "@/app/projects/(micro-apps)/hydrate/store/useWaterStore";

describe("useWaterStore Zustand Store", () => {
  beforeEach(() => {
    useWaterStore.setState({ glasses: 0, goal: 8 });
  });

  it("should have initial default state with 0 glasses and goal of 8", () => {
    const state = useWaterStore.getState();
    expect(state.glasses).toBe(0);
    expect(state.goal).toBe(8);
  });

  it("should increment glasses when calling add()", () => {
    const { add } = useWaterStore.getState();
    add();
    expect(useWaterStore.getState().glasses).toBe(1);
    add();
    expect(useWaterStore.getState().glasses).toBe(2);
    add();
    expect(useWaterStore.getState().glasses).toBe(3);
  });

  it("should reset glasses back to 0 when calling reset()", () => {
    useWaterStore.setState({ glasses: 7, goal: 8 });
    expect(useWaterStore.getState().glasses).toBe(7);

    const { reset } = useWaterStore.getState();
    reset();
    expect(useWaterStore.getState().glasses).toBe(0);
    expect(useWaterStore.getState().goal).toBe(8);
  });
});
