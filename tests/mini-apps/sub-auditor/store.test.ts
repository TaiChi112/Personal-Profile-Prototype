import { describe, it, expect, beforeEach } from "bun:test";
import { useSubStore } from "@/app/projects/(micro-apps)/sub-auditor/store/useSubStore";

describe("useSubStore Zustand Store", () => {
  beforeEach(() => {
    useSubStore.setState({
      subs: [
        { id: 1, name: "Netflix", price: 419, active: true },
        { id: 2, name: "Spotify", price: 139, active: true },
        { id: 3, name: "Gym", price: 1500, active: false },
      ],
    });
  });

  it("should have correct initial subscriptions", () => {
    const state = useSubStore.getState() as any;
    expect(state.subs.length).toBe(3);
    expect(state.subs[0]).toEqual({ id: 1, name: "Netflix", price: 419, active: true });
    expect(state.subs[1]).toEqual({ id: 2, name: "Spotify", price: 139, active: true });
    expect(state.subs[2]).toEqual({ id: 3, name: "Gym", price: 1500, active: false });
  });

  it("should toggle subscription from active to inactive", () => {
    const store = useSubStore.getState() as any;
    store.toggle(1);

    const updated = (useSubStore.getState() as any).subs;
    expect(updated.find((s: any) => s.id === 1).active).toBe(false);
  });

  it("should toggle subscription from inactive to active", () => {
    const store = useSubStore.getState() as any;
    store.toggle(3);

    const updated = (useSubStore.getState() as any).subs;
    expect(updated.find((s: any) => s.id === 3).active).toBe(true);
  });

  it("should not alter items if non-existent id is toggled", () => {
    const store = useSubStore.getState() as any;
    store.toggle(999);

    const updated = (useSubStore.getState() as any).subs;
    expect(updated[0].active).toBe(true);
    expect(updated[1].active).toBe(true);
    expect(updated[2].active).toBe(false);
  });
});
