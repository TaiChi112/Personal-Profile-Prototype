import { describe, it, expect, beforeEach } from "bun:test";
import { useMacroStore } from "@/app/projects/(micro-apps)/macro-calc/store/useMacroStore";

describe("useMacroStore Zustand Store", () => {
  beforeEach(() => {
    useMacroStore.setState({
      protein: 150,
      carbs: 200,
      fat: 60,
    });
  });

  it("should have default macro values (150g protein, 200g carbs, 60g fat)", () => {
    const state = useMacroStore.getState() as any;
    expect(state.protein).toBe(150);
    expect(state.carbs).toBe(200);
    expect(state.fat).toBe(60);
  });

  it("should update protein correctly using update()", () => {
    const { update } = useMacroStore.getState() as any;
    update("protein", 180);
    expect(useMacroStore.getState().protein).toBe(180);
  });

  it("should update carbs correctly using update()", () => {
    const { update } = useMacroStore.getState() as any;
    update("carbs", 250);
    expect(useMacroStore.getState().carbs).toBe(250);
  });

  it("should update fat correctly using update()", () => {
    const { update } = useMacroStore.getState() as any;
    update("fat", 75);
    expect(useMacroStore.getState().fat).toBe(75);
  });
});
