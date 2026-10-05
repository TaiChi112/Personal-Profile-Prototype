import { describe, it, expect, beforeEach } from "bun:test";
import { useWealthStore } from "@/app/projects/(micro-apps)/wealth-viz/store/useWealthStore";

describe("useWealthStore Zustand Store", () => {
  beforeEach(() => {
    useWealthStore.setState({
      assets: [
        { id: 1, name: "Cash", value: 50000, color: "#10B981" },
        { id: 2, name: "Stocks", value: 120000, color: "#3B82F6" },
        { id: 3, name: "Crypto", value: 30000, color: "#F59E0B" },
      ],
      liabilities: [
        { id: 4, name: "Car Loan", value: 45000, color: "#EF4444" },
      ],
    });
  });

  it("should have correct initial assets and liabilities", () => {
    const state = useWealthStore.getState() as any;
    expect(state.assets.length).toBe(3);
    expect(state.liabilities.length).toBe(1);
    expect(state.assets[0].value).toBe(50000);
    expect(state.liabilities[0].value).toBe(45000);
  });

  it("should update asset value when updateItem is called for assets", () => {
    const store = useWealthStore.getState() as any;
    store.updateItem("assets", 1, 80000);

    const state = useWealthStore.getState() as any;
    const updated = state.assets.find((a: any) => a.id === 1);
    expect(updated.value).toBe(80000);
  });

  it("should update liability value when updateItem is called for liabilities", () => {
    const store = useWealthStore.getState() as any;
    store.updateItem("liabilities", 4, 20000);

    const state = useWealthStore.getState() as any;
    const updated = state.liabilities.find((l: any) => l.id === 4);
    expect(updated.value).toBe(20000);
  });

  it("should not modify other items when updating one item", () => {
    const store = useWealthStore.getState() as any;
    store.updateItem("assets", 2, 200000);

    const state = useWealthStore.getState() as any;
    expect(state.assets[0].value).toBe(50000);
    expect(state.assets[1].value).toBe(200000);
    expect(state.assets[2].value).toBe(30000);
  });
});
