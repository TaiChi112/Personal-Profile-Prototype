import { describe, it, expect, beforeEach } from "bun:test";
import { useKanbanStore, type Task } from "../../../app/projects/(micro-apps)/kanban/store/useKanbanStore";

const initialDefaultTasks: Task[] = [
  { id: "1", title: "Research competitors", status: "todo" },
  { id: "2", title: "Design system", status: "in-progress" },
  { id: "3", title: "Setup repository", status: "done" },
];

describe("useKanbanStore", () => {
  beforeEach(() => {
    useKanbanStore.setState({
      tasks: [...initialDefaultTasks],
    });
  });

  describe("Initial State", () => {
    it("should initialize with default tasks and statuses", () => {
      const state = useKanbanStore.getState();
      expect(state.tasks).toHaveLength(3);
      expect(state.tasks).toEqual(initialDefaultTasks);
    });

    it("should contain one task in each status column by default", () => {
      const state = useKanbanStore.getState();
      const todoTasks = state.tasks.filter((t) => t.status === "todo");
      const inProgressTasks = state.tasks.filter((t) => t.status === "in-progress");
      const doneTasks = state.tasks.filter((t) => t.status === "done");

      expect(todoTasks).toHaveLength(1);
      expect(inProgressTasks).toHaveLength(1);
      expect(doneTasks).toHaveLength(1);
    });
  });

  describe("addTask", () => {
    it("should add a new task with status 'todo'", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("Write documentation", "todo");

      const state = useKanbanStore.getState();
      expect(state.tasks).toHaveLength(4);

      const added = state.tasks[3];
      expect(added.title).toBe("Write documentation");
      expect(added.status).toBe("todo");
      expect(typeof added.id).toBe("string");
      expect(added.id.length).toBeGreaterThan(0);
    });

    it("should add a new task with status 'in-progress'", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("Implement API", "in-progress");

      const state = useKanbanStore.getState();
      const added = state.tasks.find((t) => t.title === "Implement API");
      expect(added).toBeDefined();
      expect(added?.status).toBe("in-progress");
    });

    it("should add a new task with status 'done'", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("Create Wireframes", "done");

      const state = useKanbanStore.getState();
      const added = state.tasks.find((t) => t.title === "Create Wireframes");
      expect(added).toBeDefined();
      expect(added?.status).toBe("done");
    });

    it("should preserve existing tasks when adding a new task", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("New item", "todo");

      const state = useKanbanStore.getState();
      expect(state.tasks.slice(0, 3)).toEqual(initialDefaultTasks);
    });

    it("should generate distinct random IDs for multiple added tasks", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("Task A", "todo");
      addTask("Task B", "todo");

      const state = useKanbanStore.getState();
      const taskA = state.tasks.find((t) => t.title === "Task A");
      const taskB = state.tasks.find((t) => t.title === "Task B");

      expect(taskA?.id).toBeDefined();
      expect(taskB?.id).toBeDefined();
      expect(taskA?.id).not.toBe(taskB?.id);
    });

    it("should support titles with special characters and empty strings", () => {
      const { addTask } = useKanbanStore.getState();
      addTask("Special chars: <script>alert(1)</script> & 100%", "todo");
      addTask("", "in-progress");

      const state = useKanbanStore.getState();
      expect(state.tasks.some((t) => t.title === "Special chars: <script>alert(1)</script> & 100%")).toBe(true);
      expect(state.tasks.some((t) => t.title === "")).toBe(true);
    });
  });

  describe("moveTask", () => {
    it("should update the status of a specific task", () => {
      const { moveTask } = useKanbanStore.getState();
      moveTask("1", "in-progress");

      const state = useKanbanStore.getState();
      const movedTask = state.tasks.find((t) => t.id === "1");
      expect(movedTask?.status).toBe("in-progress");
    });

    it("should not affect other tasks when one is moved", () => {
      const { moveTask } = useKanbanStore.getState();
      moveTask("1", "done");

      const state = useKanbanStore.getState();
      const task2 = state.tasks.find((t) => t.id === "2");
      const task3 = state.tasks.find((t) => t.id === "3");

      expect(task2?.status).toBe("in-progress");
      expect(task3?.status).toBe("done");
    });

    it("should cycle a task through todo -> in-progress -> done -> todo", () => {
      const { moveTask } = useKanbanStore.getState();

      moveTask("1", "in-progress");
      expect(useKanbanStore.getState().tasks.find((t) => t.id === "1")?.status).toBe("in-progress");

      moveTask("1", "done");
      expect(useKanbanStore.getState().tasks.find((t) => t.id === "1")?.status).toBe("done");

      moveTask("1", "todo");
      expect(useKanbanStore.getState().tasks.find((t) => t.id === "1")?.status).toBe("todo");
    });

    it("should do nothing when moving a non-existent task ID", () => {
      const { moveTask } = useKanbanStore.getState();
      moveTask("non-existent-id", "done");

      const state = useKanbanStore.getState();
      expect(state.tasks).toEqual(initialDefaultTasks);
    });
  });

  describe("deleteTask", () => {
    it("should remove task by ID", () => {
      const { deleteTask } = useKanbanStore.getState();
      deleteTask("2");

      const state = useKanbanStore.getState();
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks.find((t) => t.id === "2")).toBeUndefined();
      expect(state.tasks.map((t) => t.id)).toEqual(["1", "3"]);
    });

    it("should do nothing when deleting a non-existent task ID", () => {
      const { deleteTask } = useKanbanStore.getState();
      deleteTask("non-existent-id");

      const state = useKanbanStore.getState();
      expect(state.tasks).toHaveLength(3);
      expect(state.tasks).toEqual(initialDefaultTasks);
    });

    it("should allow deleting all tasks until store is empty", () => {
      const { deleteTask } = useKanbanStore.getState();
      deleteTask("1");
      deleteTask("2");
      deleteTask("3");

      const state = useKanbanStore.getState();
      expect(state.tasks).toHaveLength(0);
      expect(state.tasks).toEqual([]);
    });
  });

  describe("Complex lifecycle scenarios", () => {
    it("should add, move, and delete a task through a full workflow", () => {
      const { addTask, moveTask, deleteTask } = useKanbanStore.getState();

      // 1. Add task
      addTask("Lifecycle Feature", "todo");
      let currentTasks = useKanbanStore.getState().tasks;
      const created = currentTasks.find((t) => t.title === "Lifecycle Feature")!;
      expect(created).toBeDefined();
      expect(created.status).toBe("todo");

      // 2. Move to in-progress
      moveTask(created.id, "in-progress");
      currentTasks = useKanbanStore.getState().tasks;
      expect(currentTasks.find((t) => t.id === created.id)?.status).toBe("in-progress");

      // 3. Move to done
      moveTask(created.id, "done");
      currentTasks = useKanbanStore.getState().tasks;
      expect(currentTasks.find((t) => t.id === created.id)?.status).toBe("done");

      // 4. Delete task
      deleteTask(created.id);
      currentTasks = useKanbanStore.getState().tasks;
      expect(currentTasks.find((t) => t.id === created.id)).toBeUndefined();
      expect(currentTasks).toHaveLength(3);
    });
  });
});
