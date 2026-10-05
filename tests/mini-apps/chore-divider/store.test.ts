import { describe, it, expect, beforeEach } from "bun:test";
import { useChoreStore } from "@/app/projects/(micro-apps)/chore-divider/store/useChoreStore";

describe("useChoreStore Zustand Store", () => {
  beforeEach(() => {
    useChoreStore.setState({
      people: ["Alice", "Bob", "Charlie"],
      chores: ["Take out Trash", "Wash Dishes", "Clean Bathroom"],
      assignments: [],
    });
  });

  it("should have correct initial state", () => {
    const state = useChoreStore.getState() as any;
    expect(state.people).toEqual(["Alice", "Bob", "Charlie"]);
    expect(state.chores).toEqual(["Take out Trash", "Wash Dishes", "Clean Bathroom"]);
    expect(state.assignments).toEqual([]);
  });

  it("should assign each person a chore when assign is called", () => {
    const store = useChoreStore.getState() as any;
    store.assign();

    const assignments = (useChoreStore.getState() as any).assignments;
    expect(assignments.length).toBe(3);

    assignments.forEach((assignment: any) => {
      expect(["Alice", "Bob", "Charlie"]).toContain(assignment.person);
      expect(["Take out Trash", "Wash Dishes", "Clean Bathroom"]).toContain(assignment.chore);
    });
  });

  it("should assign 'Free Day' when chores array is empty", () => {
    useChoreStore.setState({
      people: ["Dave"],
      chores: [],
      assignments: [],
    });

    const store = useChoreStore.getState() as any;
    store.assign();

    const assignments = (useChoreStore.getState() as any).assignments;
    expect(assignments.length).toBe(1);
    expect(assignments[0]).toEqual({ person: "Dave", chore: "Free Day" });
  });

  it("should handle more people than chores using modulo distribution", () => {
    useChoreStore.setState({
      people: ["Alice", "Bob", "Charlie", "Dave"],
      chores: ["Only One Chore"],
      assignments: [],
    });

    const store = useChoreStore.getState() as any;
    store.assign();

    const assignments = (useChoreStore.getState() as any).assignments;
    expect(assignments.length).toBe(4);
    assignments.forEach((a: any) => {
      expect(a.chore).toBe("Only One Chore");
    });
  });
});
