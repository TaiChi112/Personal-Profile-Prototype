import { describe, it, expect, beforeEach } from "bun:test";
import { useFridgeStore } from "@/app/projects/(micro-apps)/fridge-tracker/store/useFridgeStore";

describe("useFridgeStore Zustand Store", () => {
  beforeEach(() => {
    // Reset state before each test
    useFridgeStore.setState({
      items: [
        { id: 1, name: "Milk", expiry: "2026-10-06" },
        { id: 2, name: "Eggs", expiry: "2026-10-10" },
        { id: 3, name: "Chicken", expiry: "2026-10-04" },
      ],
    });
  });

  it("should have initial items in the store", () => {
    const { items } = useFridgeStore.getState() as any;
    expect(items.length).toBe(3);
    expect(items[0].name).toBe("Milk");
    expect(items[1].name).toBe("Eggs");
    expect(items[2].name).toBe("Chicken");
  });

  it("should add a new item using addItem", () => {
    const { addItem } = useFridgeStore.getState() as any;
    addItem("Yogurt", "2026-10-15");

    const state = useFridgeStore.getState() as any;
    expect(state.items.length).toBe(4);
    const added = state.items.find((i: any) => i.name === "Yogurt");
    expect(added).toBeDefined();
    expect(added.expiry).toBe("2026-10-15");
    expect(typeof added.id).toBe("number");
  });

  it("should remove an item by id using delItem", () => {
    const { delItem } = useFridgeStore.getState() as any;
    delItem(2); // Remove Eggs

    const state = useFridgeStore.getState() as any;
    expect(state.items.length).toBe(2);
    expect(state.items.some((i: any) => i.id === 2)).toBe(false);
    expect(state.items.some((i: any) => i.name === "Eggs")).toBe(false);
  });

  it("should not modify items if deleting a non-existent id", () => {
    const { delItem } = useFridgeStore.getState() as any;
    delItem(99999);

    const state = useFridgeStore.getState() as any;
    expect(state.items.length).toBe(3);
  });
});
