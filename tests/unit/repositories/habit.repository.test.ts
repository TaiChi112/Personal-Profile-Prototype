import { describe, it, expect, mock, beforeEach } from "bun:test";

const mockHabitUserStats = {
  findUnique: mock(),
  create: mock(),
  update: mock(),
};

const mockHabitItem = {
  findMany: mock(),
  create: mock(),
  update: mock(),
};

const mockPrisma = {
  habitUserStats: mockHabitUserStats,
  habitItem: mockHabitItem,
};

mock.module('@/lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

mock.module('../../../lib/prisma', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
}));

import { HabitRepository } from "@/lib/repositories/habit.repository";

describe("HabitRepository", () => {
  beforeEach(() => {
    mockHabitUserStats.findUnique.mockReset();
    mockHabitUserStats.create.mockReset();
    mockHabitUserStats.update.mockReset();
    mockHabitItem.findMany.mockReset();
    mockHabitItem.create.mockReset();
    mockHabitItem.update.mockReset();
  });

  it("should instantiate class correctly", () => {
    const repo = new HabitRepository();
    expect(repo).toBeInstanceOf(HabitRepository);
  });

  describe("getStats", () => {
    it("should return existing stats if found", async () => {
      const existingStats = { id: "stat-1", userId: "user-1", level: 3, exp: 45 };
      mockHabitUserStats.findUnique.mockResolvedValueOnce(existingStats);

      const result = await HabitRepository.getStats("user-1");

      expect(mockHabitUserStats.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
      expect(mockHabitUserStats.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingStats);
    });

    it("should create default stats if not found", async () => {
      mockHabitUserStats.findUnique.mockResolvedValueOnce(null);
      const createdStats = { id: "stat-new", userId: "user-1", level: 1, exp: 0 };
      mockHabitUserStats.create.mockResolvedValueOnce(createdStats);

      const result = await HabitRepository.getStats("user-1");

      expect(mockHabitUserStats.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-1" },
      });
      expect(mockHabitUserStats.create).toHaveBeenCalledWith({
        data: { userId: "user-1", level: 1, exp: 0 },
      });
      expect(result).toEqual(createdStats);
    });
  });

  describe("getHabits", () => {
    it("should fetch user habits ordered by createdAt asc", async () => {
      const habits = [
        { id: "h-1", userId: "user-1", title: "Read book", done: false },
        { id: "h-2", userId: "user-1", title: "Exercise", done: true },
      ];
      mockHabitItem.findMany.mockResolvedValueOnce(habits);

      const result = await HabitRepository.getHabits("user-1");

      expect(mockHabitItem.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "asc" },
      });
      expect(result).toEqual(habits);
    });
  });

  describe("addHabit", () => {
    it("should create a new habit item", async () => {
      const newHabit = { id: "h-3", userId: "user-1", title: "Meditate", done: false };
      mockHabitItem.create.mockResolvedValueOnce(newHabit);

      const result = await HabitRepository.addHabit("user-1", "Meditate");

      expect(mockHabitItem.create).toHaveBeenCalledWith({
        data: { userId: "user-1", title: "Meditate" },
      });
      expect(result).toEqual(newHabit);
    });
  });

  describe("completeHabit", () => {
    it("should update habit to done and increment exp without leveling up when exp < 100", async () => {
      mockHabitItem.update.mockResolvedValueOnce({ id: "h-1", userId: "user-1", done: true });
      mockHabitUserStats.findUnique.mockResolvedValueOnce({
        id: "stat-1",
        userId: "user-1",
        level: 1,
        exp: 20,
      });
      const updatedStats = { id: "stat-1", userId: "user-1", level: 1, exp: 55 };
      mockHabitUserStats.update.mockResolvedValueOnce(updatedStats);

      const result = await HabitRepository.completeHabit("user-1", "h-1");

      expect(mockHabitItem.update).toHaveBeenCalledWith({
        where: { id: "h-1", userId: "user-1" },
        data: { done: true },
      });
      expect(mockHabitUserStats.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: { level: 1, exp: 55 },
      });
      expect(result).toEqual(updatedStats);
    });

    it("should level up when exp reaches or exceeds 100", async () => {
      mockHabitItem.update.mockResolvedValueOnce({ id: "h-2", userId: "user-1", done: true });
      mockHabitUserStats.findUnique.mockResolvedValueOnce({
        id: "stat-1",
        userId: "user-1",
        level: 2,
        exp: 80,
      });
      const updatedStats = { id: "stat-1", userId: "user-1", level: 3, exp: 15 };
      mockHabitUserStats.update.mockResolvedValueOnce(updatedStats);

      const result = await HabitRepository.completeHabit("user-1", "h-2");

      expect(mockHabitItem.update).toHaveBeenCalledWith({
        where: { id: "h-2", userId: "user-1" },
        data: { done: true },
      });
      // 80 + 35 = 115 -> newExp: 15, level: 3
      expect(mockHabitUserStats.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: { level: 3, exp: 15 },
      });
      expect(result).toEqual(updatedStats);
    });

    it("should handle exact boundary exp of 100", async () => {
      mockHabitItem.update.mockResolvedValueOnce({ id: "h-3", userId: "user-1", done: true });
      mockHabitUserStats.findUnique.mockResolvedValueOnce({
        id: "stat-1",
        userId: "user-1",
        level: 1,
        exp: 65,
      });
      const updatedStats = { id: "stat-1", userId: "user-1", level: 2, exp: 0 };
      mockHabitUserStats.update.mockResolvedValueOnce(updatedStats);

      const result = await HabitRepository.completeHabit("user-1", "h-3");

      // 65 + 35 = 100 -> newExp: 0, level: 2
      expect(mockHabitUserStats.update).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        data: { level: 2, exp: 0 },
      });
      expect(result).toEqual(updatedStats);
    });
  });
});
