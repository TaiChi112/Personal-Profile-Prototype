import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockAuth = mock();
const mockRevalidatePath = mock();
const mockKanbanRepository = {
  getTasks: mock(),
  addTask: mock(),
  updateTask: mock(),
  deleteTask: mock(),
};

mock.module("@/auth", () => ({
  auth: mockAuth,
}));

mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

mock.module("@/lib/repositories/kanban.repository", () => ({
  KanbanRepository: mockKanbanRepository,
}));

import {
  getKanbanTasks,
  addKanbanTask,
  updateKanbanTask,
  deleteKanbanTask,
} from "../../../app/projects/(micro-apps)/kanban/actions";

describe("Kanban Server Actions", () => {
  const mockUserId = "user-123";
  const mockUserSession = {
    user: { id: mockUserId, name: "Test User", email: "test@example.com" },
  };

  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockKanbanRepository.getTasks.mockReset();
    mockKanbanRepository.addTask.mockReset();
    mockKanbanRepository.updateTask.mockReset();
    mockKanbanRepository.deleteTask.mockReset();
  });

  describe("getKanbanTasks", () => {
    it("should fetch tasks for an authenticated user", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      const mockTasks = [
        { id: "task-1", userId: mockUserId, title: "Task 1", status: "todo", createdAt: new Date() },
        { id: "task-2", userId: mockUserId, title: "Task 2", status: "done", createdAt: new Date() },
      ];
      mockKanbanRepository.getTasks.mockResolvedValueOnce(mockTasks);

      const result = await getKanbanTasks();

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockKanbanRepository.getTasks).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockTasks);
    });

    it("should throw Unauthorized error when session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      expect(getKanbanTasks()).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized error when session has no user", async () => {
      mockAuth.mockResolvedValueOnce({});

      expect(getKanbanTasks()).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized error when session user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { name: "No ID" } });

      expect(getKanbanTasks()).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
    });

    it("should propagate error when repository throws", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      mockKanbanRepository.getTasks.mockRejectedValueOnce(new Error("Database connection failed"));

      expect(getKanbanTasks()).rejects.toThrow("Database connection failed");
    });
  });

  describe("addKanbanTask", () => {
    it("should add a task and revalidate /projects/kanban for authenticated user", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      const createdTask = {
        id: "task-3",
        userId: mockUserId,
        title: "New Feature",
        status: "todo",
        createdAt: new Date(),
      };
      mockKanbanRepository.addTask.mockResolvedValueOnce(createdTask);

      const result = await addKanbanTask("New Feature");

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockKanbanRepository.addTask).toHaveBeenCalledWith(mockUserId, "New Feature");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/kanban");
      expect(result).toEqual(createdTask);
    });

    it("should throw Unauthorized error when session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      expect(addKanbanTask("Task")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.addTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized error when session user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      expect(addKanbanTask("Task")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.addTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should not revalidate path if repository fails to add task", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      mockKanbanRepository.addTask.mockRejectedValueOnce(new Error("Insert error"));

      expect(addKanbanTask("Failing Task")).rejects.toThrow("Insert error");
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("updateKanbanTask", () => {
    it("should update task status and revalidate path for authenticated user", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      const updatedTask = {
        id: "task-1",
        userId: mockUserId,
        title: "Task 1",
        status: "in-progress",
        createdAt: new Date(),
      };
      mockKanbanRepository.updateTask.mockResolvedValueOnce(updatedTask);

      const result = await updateKanbanTask("task-1", "in-progress");

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockKanbanRepository.updateTask).toHaveBeenCalledWith(mockUserId, "task-1", "in-progress");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/kanban");
      expect(result).toEqual(updatedTask);
    });

    it("should handle status transition to done", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      const updatedTask = {
        id: "task-1",
        userId: mockUserId,
        title: "Task 1",
        status: "done",
        createdAt: new Date(),
      };
      mockKanbanRepository.updateTask.mockResolvedValueOnce(updatedTask);

      const result = await updateKanbanTask("task-1", "done");

      expect(mockKanbanRepository.updateTask).toHaveBeenCalledWith(mockUserId, "task-1", "done");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/kanban");
      expect(result.status).toBe("done");
    });

    it("should throw Unauthorized error when session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      expect(updateKanbanTask("task-1", "done")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.updateTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized error when session user id is missing", async () => {
      mockAuth.mockResolvedValueOnce({ user: { email: "no-id@test.com" } });

      expect(updateKanbanTask("task-1", "done")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.updateTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should not revalidate path if repository fails to update task", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      mockKanbanRepository.updateTask.mockRejectedValueOnce(new Error("Update failed"));

      expect(updateKanbanTask("task-1", "in-progress")).rejects.toThrow("Update failed");
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("deleteKanbanTask", () => {
    it("should delete task and revalidate path for authenticated user", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      const deletedTask = {
        id: "task-1",
        userId: mockUserId,
        title: "Task to delete",
        status: "todo",
      };
      mockKanbanRepository.deleteTask.mockResolvedValueOnce(deletedTask);

      const result = await deleteKanbanTask("task-1");

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockKanbanRepository.deleteTask).toHaveBeenCalledWith(mockUserId, "task-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/kanban");
      expect(result).toEqual(deletedTask);
    });

    it("should throw Unauthorized error when session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      expect(deleteKanbanTask("task-1")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.deleteTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw Unauthorized error when session user id is missing", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      expect(deleteKanbanTask("task-1")).rejects.toThrow("Unauthorized");
      expect(mockKanbanRepository.deleteTask).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should not revalidate path if repository fails to delete task", async () => {
      mockAuth.mockResolvedValueOnce(mockUserSession);
      mockKanbanRepository.deleteTask.mockRejectedValueOnce(new Error("Delete failed"));

      expect(deleteKanbanTask("task-1")).rejects.toThrow("Delete failed");
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});
