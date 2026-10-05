import { describe, it, expect, beforeEach } from "bun:test";
import { useMedStore } from "@/app/projects/(micro-apps)/med-tracker/store/useMedStore";

describe("useMedStore Zustand Store", () => {
  beforeEach(() => {
    useMedStore.setState({
      meds: [
        { id: 1, name: "Vitamin C", time: "Morning", taken: false },
        { id: 2, name: "Fish Oil", time: "After Lunch", taken: false },
      ],
    });
  });

  it("should have initial meds list with taken=false", () => {
    const { meds } = useMedStore.getState() as any;
    expect(meds.length).toBe(2);
    expect(meds[0].name).toBe("Vitamin C");
    expect(meds[0].taken).toBe(false);
    expect(meds[1].name).toBe("Fish Oil");
    expect(meds[1].taken).toBe(false);
  });

  it("should toggle medication taken status by id", () => {
    const { toggle } = useMedStore.getState() as any;
    toggle(1);

    let state = useMedStore.getState() as any;
    expect(state.meds[0].taken).toBe(true);
    expect(state.meds[1].taken).toBe(false);

    // Toggle again
    toggle(1);
    state = useMedStore.getState() as any;
    expect(state.meds[0].taken).toBe(false);
  });

  it("should reset all medications taken status to false", () => {
    useMedStore.setState({
      meds: [
        { id: 1, name: "Vitamin C", time: "Morning", taken: true },
        { id: 2, name: "Fish Oil", time: "After Lunch", taken: true },
      ],
    });

    const { reset } = useMedStore.getState() as any;
    reset();

    const state = useMedStore.getState() as any;
    expect(state.meds[0].taken).toBe(false);
    expect(state.meds[1].taken).toBe(false);
  });

  it("should not modify other meds when toggling an unknown id", () => {
    const { toggle } = useMedStore.getState() as any;
    toggle(999);

    const state = useMedStore.getState() as any;
    expect(state.meds[0].taken).toBe(false);
    expect(state.meds[1].taken).toBe(false);
  });
});
