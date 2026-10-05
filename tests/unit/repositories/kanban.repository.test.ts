import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockKanbanTask = {
  findMany: mock(),
  create: mock(),
  update: mock(),
  delete: mock(),
};

const mockPrisma = {
  kanbanTask: mockKanbanTask,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { KanbanRepository } from "@/lib/repositories/kanban.repository";

describe("KanbanRepository", () => {
  beforeEach(() => {
    mockKanbanTask.findMany.mockReset();
    mockKanbanTask.create.mockReset();
    mockKanbanTask.update.mockReset();
    mockKanbanTask.delete.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new KanbanRepository();
    expect(repo).toBeInstanceOf(KanbanRepository);
  });

  describe("getTasks", () => {
    it("should fetch tasks for user ordered by createdAt asc", async () => {
      const mockTasks = [
        { id: "task-1", userId: "user-1", title: "Task 1", status: "todo" },
        { id: "task-2", userId: "user-1", title: "Task 2", status: "done" },
      ];
      mockKanbanTask.findMany.mockResolvedValueOnce(mockTasks);

      const result = await KanbanRepository.getTasks("user-1");

      expect(mockKanbanTask.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toEqual(mockTasks);
    });
  });

  describe("addTask", () => {
    it("should create a task with default status 'todo'", async () => {
      const createdTask = { id: "task-3", userId: "user-1", title: "New Task", status: "todo" };
      mockKanbanTask.create.mockResolvedValueOnce(createdTask);

      const result = await KanbanRepository.addTask("user-1", "New Task");

      expect(mockKanbanTask.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "New Task",
          status: "todo",
        },
      });
      expect(result).toEqual(createdTask);
    });
  });

  describe("updateTaskStatus", () => {
    it("should update task status for specified user and task id", async () => {
      const updatedTask = { id: "task-1", userId: "user-1", title: "Task 1", status: "in-progress" };
      mockKanbanTask.update.mockResolvedValueOnce(updatedTask);

      const result = await KanbanRepository.updateTaskStatus("user-1", "task-1", "in-progress");

      expect(mockKanbanTask.update).toHaveBeenCalledWith({
        where: { id: "task-1", userId: "user-1" },
        data: { status: "in-progress" },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe("updateTask", () => {
    it("should delegate to updateTaskStatus", async () => {
      const updatedTask = { id: "task-1", userId: "user-1", title: "Task 1", status: "done" };
      mockKanbanTask.update.mockResolvedValueOnce(updatedTask);

      const result = await KanbanRepository.updateTask("user-1", "task-1", "done");

      expect(mockKanbanTask.update).toHaveBeenCalledWith({
        where: { id: "task-1", userId: "user-1" },
        data: { status: "done" },
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe("deleteTask", () => {
    it("should delete task for specified user and task id", async () => {
      const deletedTask = { id: "task-1", userId: "user-1", title: "Task 1", status: "todo" };
      mockKanbanTask.delete.mockResolvedValueOnce(deletedTask);

      const result = await KanbanRepository.deleteTask("user-1", "task-1");

      expect(mockKanbanTask.delete).toHaveBeenCalledWith({
        where: { id: "task-1", userId: "user-1" },
      });
      expect(result).toEqual(deletedTask);
    });
  });
});
