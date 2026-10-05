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

// Mock HabitRepository
const mockHabitRepository = {
  addHabit: mock(),
  completeHabit: mock(),
  getStats: mock(),
  getHabits: mock(),
};

mock.module("@/lib/repositories/habit.repository", () => ({
  HabitRepository: mockHabitRepository,
}));
mock.module("../../../lib/repositories/habit.repository", () => ({
  HabitRepository: mockHabitRepository,
}));

import { addHabitAction, completeHabitAction } from "../../../app/projects/(micro-apps)/habit-rpg/actions";

describe("Habit RPG Server Actions", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockHabitRepository.addHabit.mockReset();
    mockHabitRepository.completeHabit.mockReset();
    mockHabitRepository.getStats.mockReset();
    mockHabitRepository.getHabits.mockReset();
  });

  describe("addHabitAction", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session is undefined", async () => {
      mockAuth.mockResolvedValueOnce(undefined);

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session has no user", async () => {
      mockAuth.mockResolvedValueOnce({ expires: "2099-01-01" });

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session user is null", async () => {
      mockAuth.mockResolvedValueOnce({ user: null });

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { email: "user@example.com" } });

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if user id is an empty string", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "" } });

      await expect(addHabitAction("Morning Meditation")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should successfully add a habit and revalidate cache path when authorized", async () => {
      const mockSession = { user: { id: "hero-user-123" } };
      mockAuth.mockResolvedValueOnce(mockSession);
      mockHabitRepository.addHabit.mockResolvedValueOnce({
        id: "habit-1",
        userId: "hero-user-123",
        title: "Daily Coding Quest",
        done: false,
      });

      await addHabitAction("Daily Coding Quest");

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockHabitRepository.addHabit).toHaveBeenCalledTimes(1);
      expect(mockHabitRepository.addHabit).toHaveBeenCalledWith("hero-user-123", "Daily Coding Quest");
      expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/habit-rpg");
    });

    it("should propagate error and not revalidate if HabitRepository.addHabit fails", async () => {
      const mockSession = { user: { id: "hero-user-123" } };
      mockAuth.mockResolvedValueOnce(mockSession);
      mockHabitRepository.addHabit.mockRejectedValueOnce(new Error("Database connection error"));

      await expect(addHabitAction("Failing Quest")).rejects.toThrow("Database connection error");
      expect(mockHabitRepository.addHabit).toHaveBeenCalledWith("hero-user-123", "Failing Quest");
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("completeHabitAction", () => {
    it("should throw 'Unauthorized' if session is null", async () => {
      mockAuth.mockResolvedValueOnce(null);

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session is undefined", async () => {
      mockAuth.mockResolvedValueOnce(undefined);

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session has no user", async () => {
      mockAuth.mockResolvedValueOnce({ expires: "2099-01-01" });

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session user is null", async () => {
      mockAuth.mockResolvedValueOnce({ user: null });

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if session user has no id", async () => {
      mockAuth.mockResolvedValueOnce({ user: { email: "hero@test.com" } });

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should throw 'Unauthorized' if user id is empty", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "" } });

      await expect(completeHabitAction("habit-123")).rejects.toThrow("Unauthorized");
      expect(mockHabitRepository.completeHabit).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should successfully complete a habit and revalidate cache path when authorized", async () => {
      const mockSession = { user: { id: "hero-user-456" } };
      mockAuth.mockResolvedValueOnce(mockSession);
      mockHabitRepository.completeHabit.mockResolvedValueOnce({
        id: "stat-1",
        userId: "hero-user-456",
        level: 2,
        exp: 35,
      });

      await completeHabitAction("quest-abc");

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockHabitRepository.completeHabit).toHaveBeenCalledTimes(1);
      expect(mockHabitRepository.completeHabit).toHaveBeenCalledWith("hero-user-456", "quest-abc");
      expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/projects/habit-rpg");
    });

    it("should propagate error and not revalidate if HabitRepository.completeHabit fails", async () => {
      const mockSession = { user: { id: "hero-user-456" } };
      mockAuth.mockResolvedValueOnce(mockSession);
      mockHabitRepository.completeHabit.mockRejectedValueOnce(new Error("Record not found"));

      await expect(completeHabitAction("quest-nonexistent")).rejects.toThrow("Record not found");
      expect(mockHabitRepository.completeHabit).toHaveBeenCalledWith("hero-user-456", "quest-nonexistent");
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});
