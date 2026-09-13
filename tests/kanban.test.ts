import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { KanbanRepository } from "../lib/repositories/kanban.repository";
import { prisma } from "../lib/prisma";

describe("Kanban Repository Tests", () => {
  const testUserId = "test-kanban-user-id";
  const testUserEmail = "kanban@test.com";

  beforeAll(async () => {
    await prisma.kanbanTask.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.user.create({
      data: { id: testUserId, email: testUserEmail },
    });
  });

  afterAll(async () => {
    await prisma.kanbanTask.deleteMany({ where: { userId: testUserId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });

  it("addTask correctly adds a task", async () => {
    const task = await KanbanRepository.addTask(testUserId, "Test Task");

    expect(task.title).toBe("Test Task");
    expect(task.status).toBe("todo");
    expect(task.userId).toBe(testUserId);
    expect(task.id).toBeDefined();
  });

  it("updateTaskStatus correctly updates the task status", async () => {
    const task = await KanbanRepository.addTask(testUserId, "Update Me");
    
    const updatedTask = await KanbanRepository.updateTaskStatus(testUserId, task.id, "in-progress");

    expect(updatedTask.id).toBe(task.id);
    expect(updatedTask.status).toBe("in-progress");
  });

  it("deleteTask correctly deletes the task", async () => {
    const task = await KanbanRepository.addTask(testUserId, "Delete Me");
    
    await KanbanRepository.deleteTask(testUserId, task.id);

    const foundTask = await prisma.kanbanTask.findUnique({
      where: { id: task.id }
    });

    expect(foundTask).toBeNull();
  });
});
