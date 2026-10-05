import { describe, it, expect, beforeEach, mock } from "bun:test";
import React from "react";
import { render, screen, act } from "@testing-library/react";

// Mock Auth
const mockAuth = mock();
mock.module("@/auth", () => ({
  auth: mockAuth,
}));

// Mock KanbanRepository
const mockKanbanRepository = {
  getTasks: mock(),
};
mock.module("@/lib/repositories/kanban.repository", () => ({
  KanbanRepository: mockKanbanRepository,
}));

// Mock Prisma
const mockFindMany = mock();
mock.module("@/lib/prisma", () => ({
  default: {
    financeTransaction: {
      findMany: mockFindMany,
    },
  },
  prisma: {
    financeTransaction: {
      findMany: mockFindMany,
    },
  },
}));

import { useWeatherStore } from "@/app/projects/(micro-apps)/glass-dash/store/useWeatherStore";
import FinanceWidget from "@/app/projects/(micro-apps)/glass-dash/components/FinanceWidget";
import KanbanWidget from "@/app/projects/(micro-apps)/glass-dash/components/KanbanWidget";
import AnalogClock from "@/app/projects/(micro-apps)/glass-dash/components/AnalogClock";
import DashboardView from "@/app/projects/(micro-apps)/glass-dash/components/DashboardView";
import GlassDashPage from "@/app/projects/(micro-apps)/glass-dash/page";

describe("Glass Dash Micro-App", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockKanbanRepository.getTasks.mockReset();
    mockFindMany.mockReset();
  });

  describe("useWeatherStore Zustand Store", () => {
    it("has initial weather conditions", () => {
      const state = useWeatherStore.getState() as any;
      expect(state.temp).toBe(28);
      expect(state.condition).toBe("Sunny");
    });
  });

  describe("FinanceWidget Component", () => {
    it("correctly computes total income and total expense", () => {
      const transactions = [
        { id: "1", type: "income", amount: 5000 },
        { id: "2", type: "expense", amount: 1200 },
        { id: "3", type: "income", amount: 1500 },
        { id: "4", type: "expense", amount: 300 },
      ];

      render(<FinanceWidget transactions={transactions} />);

      expect(screen.getByText("Financial Overview")).toBeInTheDocument();
      // Total Income: 5000 + 1500 = 6500.00
      expect(screen.getByText("$6500.00")).toBeInTheDocument();
      // Total Expense: 1200 + 300 = 1500.00
      expect(screen.getByText("$1500.00")).toBeInTheDocument();
    });

    it("handles empty transactions list gracefully with $0.00", () => {
      render(<FinanceWidget transactions={[]} />);

      expect(screen.getByText("Financial Overview")).toBeInTheDocument();
      const zeroAmounts = screen.getAllByText("$0.00");
      expect(zeroAmounts.length).toBe(2);
    });

    it("handles non-numeric or missing amounts safely", () => {
      const transactions = [
        { id: "1", type: "income", amount: null },
        { id: "2", type: "expense", amount: "not-a-number" },
      ];

      render(<FinanceWidget transactions={transactions} />);

      const zeroAmounts = screen.getAllByText("$0.00");
      expect(zeroAmounts.length).toBe(2);
    });
  });

  describe("KanbanWidget Component", () => {
    it("correctly counts tasks by status and displays in-progress task list", () => {
      const tasks = [
        { id: "1", title: "Task 1", status: "todo" },
        { id: "2", title: "Task 2", status: "todo" },
        { id: "3", title: "Develop Dashboard", status: "in-progress" },
        { id: "4", title: "Write Tests", status: "in-progress" },
        { id: "5", title: "Deploy to Prod", status: "done" },
      ];

      render(<KanbanWidget tasks={tasks} />);

      expect(screen.getByText("Kanban Overview")).toBeInTheDocument();
      // Counts: To Do: 2, In Progress: 2, Done: 1
      expect(screen.getByText("To Do")).toBeInTheDocument();
      expect(screen.getAllByText("2").length).toBe(2); // todo & in-progress counts
      expect(screen.getByText("1")).toBeInTheDocument(); // done count

      // In-progress list
      expect(screen.getByText("In Progress Tasks:")).toBeInTheDocument();
      expect(screen.getByText("Develop Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Write Tests")).toBeInTheDocument();
      expect(screen.queryByText("Deploy to Prod")).toBeNull();
    });

    it("does not render in-progress section if there are no in-progress tasks", () => {
      const tasks = [
        { id: "1", title: "Only Todo", status: "todo" },
      ];

      render(<KanbanWidget tasks={tasks} />);

      expect(screen.queryByText("In Progress Tasks:")).toBeNull();
    });
  });

  describe("AnalogClock Component", () => {
    it("renders time and date display", () => {
      render(<AnalogClock />);
      expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
    });

    it("updates time when interval timer ticks", () => {
      let intervalCb: any;
      const originalSetInterval = globalThis.setInterval;
      globalThis.setInterval = ((cb: any) => {
        intervalCb = cb;
        return 999 as any;
      }) as any;

      try {
        render(<AnalogClock />);
        expect(intervalCb).toBeDefined();
        act(() => {
          intervalCb();
        });
        expect(screen.getByText(new Date().toLocaleDateString())).toBeInTheDocument();
      } finally {
        globalThis.setInterval = originalSetInterval;
      }
    });
  });

  describe("DashboardView Component", () => {
    it("renders all widgets together with provided transactions and tasks", () => {
      render(<DashboardView transactions={[]} tasks={[]} />);
      expect(screen.getByText("Financial Overview")).toBeInTheDocument();
      expect(screen.getByText("Kanban Overview")).toBeInTheDocument();
    });
  });

  describe("GlassDashPage Server Component", () => {
    it("renders 'Please login' when session is missing", async () => {
      mockAuth.mockResolvedValueOnce(null);

      const PageComponent = await GlassDashPage();
      const { container } = render(PageComponent);

      expect(container.textContent).toContain("Please login");
      expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
      expect(mockFindMany).not.toHaveBeenCalled();
    });

    it("renders 'Please login' when session user id is missing", async () => {
      mockAuth.mockResolvedValueOnce({ user: {} });

      const PageComponent = await GlassDashPage();
      const { container } = render(PageComponent);

      expect(container.textContent).toContain("Please login");
      expect(mockKanbanRepository.getTasks).not.toHaveBeenCalled();
      expect(mockFindMany).not.toHaveBeenCalled();
    });

    it("fetches tasks and transactions for authorized user and renders dashboard", async () => {
      const mockSession = { user: { id: "user-glass-123" } };
      mockAuth.mockResolvedValueOnce(mockSession);

      const mockTasks = [
        { id: "t1", title: "Glass Kanban Task", status: "in-progress" },
      ];
      const mockTransactions = [
        { id: "tx1", type: "income", amount: 4200 },
      ];

      mockKanbanRepository.getTasks.mockResolvedValueOnce(mockTasks);
      mockFindMany.mockResolvedValueOnce(mockTransactions);

      const PageComponent = await GlassDashPage();
      render(PageComponent);

      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockKanbanRepository.getTasks).toHaveBeenCalledWith("user-glass-123");
      expect(mockFindMany).toHaveBeenCalledWith({ where: { userId: "user-glass-123" } });

      // Verifies data rendered in child widgets
      expect(screen.getByText("Glass Kanban Task")).toBeInTheDocument();
      expect(screen.getByText("$4200.00")).toBeInTheDocument();
    });
  });
});
