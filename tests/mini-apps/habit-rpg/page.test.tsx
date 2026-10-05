import { describe, it, expect, mock, beforeEach } from "bun:test";
import { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";

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

// Mock next/cache
const mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

import Page from "@/app/projects/(micro-apps)/habit-rpg/page";
import RpgGame from "@/app/projects/(micro-apps)/habit-rpg/components/RpgGame";

describe("Habit RPG Page and Components", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockRevalidatePath.mockReset();
    mockHabitRepository.addHabit.mockReset();
    mockHabitRepository.completeHabit.mockReset();
    mockHabitRepository.getStats.mockReset();
    mockHabitRepository.getHabits.mockReset();
  });

  describe("Page Component", () => {
    it("should render login screen when user is not authenticated", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const pageComponent = await Page();
      render(pageComponent);

      expect(screen.getByText("Please login to save your hero's progress.")).toBeInTheDocument();
      expect(screen.getByText("Login with Google")).toBeInTheDocument();
      expect(mockHabitRepository.getStats).not.toHaveBeenCalled();
    });

    it("should render game dashboard when user is authenticated", async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: "hero-1" } });
      mockHabitRepository.getStats.mockResolvedValueOnce({ level: 5, exp: 75 });
      mockHabitRepository.getHabits.mockResolvedValueOnce([
        { id: "h1", title: "Read 10 pages", done: false },
        { id: "h2", title: "Morning run", done: true },
      ]);

      const pageComponent = await Page();
      render(pageComponent);

      expect(screen.getByText("Habit RPG")).toBeInTheDocument();
      expect(screen.getByText("Level 5 Hero")).toBeInTheDocument();
      expect(screen.getByText("75 / 100 EXP")).toBeInTheDocument();
      expect(screen.getByText("Read 10 pages")).toBeInTheDocument();
      expect(screen.getByText("Morning run")).toBeInTheDocument();
    });
  });

  describe("RpgGame Component", () => {
    const defaultHabits = [
      { id: "quest-1", title: "Meditate 10 min", done: false },
      { id: "quest-2", title: "Drink 2L water", done: true },
    ];

    it("should render level, exp, and daily quests", () => {
      render(<RpgGame level={3} exp={40} habits={defaultHabits} />);

      expect(screen.getByText("Level 3 Hero")).toBeInTheDocument();
      expect(screen.getByText("40 / 100 EXP")).toBeInTheDocument();
      expect(screen.getByText("Daily Quests")).toBeInTheDocument();
      expect(screen.getByText("Meditate 10 min")).toBeInTheDocument();
      expect(screen.getByText("Drink 2L water")).toBeInTheDocument();
      // Quest 1 is not done, should have + EXP button
      expect(screen.getByText("+ EXP")).toBeInTheDocument();
    });

    it("should trigger adding a new quest when typing and clicking Add", async () => {
      mockAuth.mockResolvedValue({ user: { id: "hero-1" } });
      mockHabitRepository.addHabit.mockResolvedValueOnce({});

      render(<RpgGame level={1} exp={0} habits={[]} />);

      const input = screen.getByPlaceholderText("Add new quest...");
      const addBtn = screen.getByText("Add");

      fireEvent.change(input, { target: { value: "Exercise 30 mins" } });
      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockHabitRepository.addHabit).toHaveBeenCalledWith("hero-1", "Exercise 30 mins");
    });

    it("should trigger adding quest on Enter key", async () => {
      mockAuth.mockResolvedValue({ user: { id: "hero-1" } });
      mockHabitRepository.addHabit.mockResolvedValueOnce({});

      render(<RpgGame level={1} exp={0} habits={[]} />);

      const input = screen.getByPlaceholderText("Add new quest...");
      fireEvent.change(input, { target: { value: "Solve LeetCode" } });
      await act(async () => {
        fireEvent.keyDown(input, { key: "Enter" });
      });

      expect(mockHabitRepository.addHabit).toHaveBeenCalledWith("hero-1", "Solve LeetCode");
    });

    it("should ignore adding quest if title is whitespace only", async () => {
      render(<RpgGame level={1} exp={0} habits={[]} />);

      const input = screen.getByPlaceholderText("Add new quest...");
      const addBtn = screen.getByText("Add");

      fireEvent.change(input, { target: { value: "    " } });
      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockHabitRepository.addHabit).not.toHaveBeenCalled();
    });

    it("should trigger completing habit when clicking + EXP", async () => {
      mockAuth.mockResolvedValue({ user: { id: "hero-1" } });
      mockHabitRepository.completeHabit.mockResolvedValueOnce({});

      render(<RpgGame level={2} exp={50} habits={[{ id: "q1", title: "Stretch", done: false }]} />);

      const expBtn = screen.getByText("+ EXP");
      await act(async () => {
        fireEvent.click(expBtn);
      });

      expect(mockHabitRepository.completeHabit).toHaveBeenCalledWith("hero-1", "q1");
    });
  });
});
