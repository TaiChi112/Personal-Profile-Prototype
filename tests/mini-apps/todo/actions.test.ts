import { describe, it, expect, mock, beforeEach } from "bun:test";

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// Mock auth
const mockAuth = mock();
mock.module("@/auth", () => ({
  auth: mockAuth,
}));
mock.module("../../../auth", () => ({
  auth: mockAuth,
}));

// Mock prisma
const mockTodo = {
  findMany: mock(),
  create: mock(),
  update: mock(),
  delete: mock(),
};

const mockPrisma = {
  todo: mockTodo,
};

mock.module("@/lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));
mock.module("../../../lib/prisma", () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from "@/app/features/todo/actions";

describe("Todo Server Actions", () => {
  const dummyUserId = "user-todo-123";
  const dummySession = {
    user: {
      id: dummyUserId,
      email: "todo@test.com",
    },
  };

  beforeEach(() => {
    mockRevalidatePath.mockReset();
    mockAuth.mockReset();
    mockTodo.findMany.mockReset();
    mockTodo.create.mockReset();
    mockTodo.update.mockReset();
    mockTodo.delete.mockReset();
  });

  describe("getTodos", () => {
    it("should fetch todos for the authenticated user", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      const mockResult = [
        { id: "1", userId: dummyUserId, text: "Buy milk", completed: false, createdAt: new Date() },
        { id: "2", userId: dummyUserId, text: "Write tests", completed: true, createdAt: new Date() },
      ];
      mockTodo.findMany.mockResolvedValueOnce(mockResult);

      const result = await getTodos();

      expect(mockAuth).toHaveBeenCalled();
      expect(mockTodo.findMany).toHaveBeenCalledWith({
        where: { userId: dummyUserId },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toEqual(mockResult);
    });

    it("should fallback to 'user_1' if user is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      mockTodo.findMany.mockResolvedValueOnce([]);

      const result = await getTodos();

      expect(mockTodo.findMany).toHaveBeenCalledWith({
        where: { userId: "user_1" },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toEqual([]);
    });

    it("should fallback to 'user_1' if session has no user id", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });
      mockTodo.findMany.mockResolvedValueOnce([]);

      await getTodos();

      expect(mockTodo.findMany).toHaveBeenCalledWith({
        where: { userId: "user_1" },
        orderBy: { createdAt: "asc" },
      });
    });
  });

  describe("addTodo", () => {
    it("should return an error if text is empty or whitespace only", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);

      const resultEmpty = await addTodo("");
      expect(resultEmpty).toEqual({ error: "Text is required" });
      expect(mockTodo.create).not.toHaveBeenCalled();

      const resultSpaces = await addTodo("    ");
      expect(resultSpaces).toEqual({ error: "Text is required" });
      expect(mockTodo.create).not.toHaveBeenCalled();
    });

    it("should create a new todo for authenticated user and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTodo.create.mockResolvedValueOnce({ id: "t1" });

      const result = await addTodo("Walk the dog");

      expect(mockTodo.create).toHaveBeenCalledWith({
        data: {
          userId: dummyUserId,
          text: "Walk the dog",
          completed: false,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });

    it("should trim text and fallback to 'user_1' when unauthenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      mockTodo.create.mockResolvedValueOnce({ id: "t2" });

      const result = await addTodo("   Learn Bun   ");

      expect(mockTodo.create).toHaveBeenCalledWith({
        data: {
          userId: "user_1",
          text: "Learn Bun",
          completed: false,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });
  });

  describe("toggleTodo", () => {
    it("should update todo completed status and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTodo.update.mockResolvedValueOnce({ id: "t1", completed: true });

      const result = await toggleTodo("t1", true);

      expect(mockTodo.update).toHaveBeenCalledWith({
        where: {
          id: "t1",
          userId: dummyUserId,
        },
        data: {
          completed: true,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });

    it("should update with user_1 fallback when session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);
      mockTodo.update.mockResolvedValueOnce({ id: "t2", completed: false });

      const result = await toggleTodo("t2", false);

      expect(mockTodo.update).toHaveBeenCalledWith({
        where: {
          id: "t2",
          userId: "user_1",
        },
        data: {
          completed: false,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo with user ownership check and revalidate path", async () => {
      mockAuth.mockResolvedValueOnce(dummySession);
      mockTodo.delete.mockResolvedValueOnce({ id: "t1" });

      const result = await deleteTodo("t1");

      expect(mockTodo.delete).toHaveBeenCalledWith({
        where: {
          id: "t1",
          userId: dummyUserId,
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });

    it("should delete with user_1 fallback when unauthenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);
      mockTodo.delete.mockResolvedValueOnce({ id: "t2" });

      const result = await deleteTodo("t2");

      expect(mockTodo.delete).toHaveBeenCalledWith({
        where: {
          id: "t2",
          userId: "user_1",
        },
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/(micro-apps)/todo");
      expect(result).toEqual({ success: true });
    });
  });
});
