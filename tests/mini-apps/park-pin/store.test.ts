import { describe, it, expect, beforeEach } from "bun:test";
import { useParkStore } from "@/app/projects/(micro-apps)/park-pin/store/useParkStore";

describe("useParkStore Zustand Store", () => {
  beforeEach(() => {
    useParkStore.setState({
      floor: "",
      pillar: "",
      note: "",
      saved: false,
    });
  });

  it("should have correct initial state", () => {
    const state = useParkStore.getState() as any;
    expect(state.floor).toBe("");
    expect(state.pillar).toBe("");
    expect(state.note).toBe("");
    expect(state.saved).toBe(false);
  });

  it("should save parking details and set saved to true using savePark", () => {
    const { savePark } = useParkStore.getState() as any;
    savePark("3B", "K12", "Near the charging station");

    const state = useParkStore.getState() as any;
    expect(state.floor).toBe("3B");
    expect(state.pillar).toBe("K12");
    expect(state.note).toBe("Near the charging station");
    expect(state.saved).toBe(true);
  });

  it("should clear parking details and reset saved to false using clearPark", () => {
    useParkStore.setState({
      floor: "2A",
      pillar: "C4",
      note: "Near exit",
      saved: true,
    });

    const { clearPark } = useParkStore.getState() as any;
    clearPark();

    const state = useParkStore.getState() as any;
    expect(state.floor).toBe("");
    expect(state.pillar).toBe("");
    expect(state.note).toBe("");
    expect(state.saved).toBe(false);
  });
});
