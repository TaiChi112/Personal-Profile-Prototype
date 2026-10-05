import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { useFlowStore } from "../../../app/projects/(micro-apps)/cash-flow/store/useFlowStore";
import Flow from "../../../app/projects/(micro-apps)/cash-flow/components/Flow";
import CashFlowPage from "../../../app/projects/(micro-apps)/cash-flow/page";

const initialStoreState = {
  income: 50000,
  expenses: [
    { id: 1, name: 'Rent', value: 15000, color: 'bg-indigo-500' },
    { id: 2, name: 'Food', value: 10000, color: 'bg-emerald-500' },
    { id: 3, name: 'Savings', value: 15000, color: 'bg-blue-500' },
    { id: 4, name: 'Fun', value: 10000, color: 'bg-pink-500' },
  ],
};

describe("Cash Flow Micro-App", () => {
  beforeEach(() => {
    (useFlowStore as any).setState({
      income: initialStoreState.income,
      expenses: JSON.parse(JSON.stringify(initialStoreState.expenses)),
    });
  });

  describe("useFlowStore", () => {
    it("should initialize with default income and expense breakdown", () => {
      const state = (useFlowStore as any).getState();
      expect(state.income).toBe(50000);
      expect(state.expenses).toHaveLength(4);
      expect(state.expenses[0].name).toBe("Rent");
      expect(state.expenses[0].value).toBe(15000);
    });

    it("should update total income", () => {
      const { setIncome } = (useFlowStore as any).getState();
      setIncome(65000);

      const state = (useFlowStore as any).getState();
      expect(state.income).toBe(65000);
    });

    it("should update specific expense by id", () => {
      const { updateExp } = (useFlowStore as any).getState();
      updateExp(2, 12000);

      const state = (useFlowStore as any).getState();
      const food = state.expenses.find((e: any) => e.id === 2);
      expect(food.value).toBe(12000);

      // Verify other expenses are unchanged
      expect(state.expenses.find((e: any) => e.id === 1).value).toBe(15000);
    });

    it("should safely ignore update for non-existent expense id", () => {
      const { updateExp } = (useFlowStore as any).getState();
      updateExp(999, 5000);

      const state = (useFlowStore as any).getState();
      expect(state.expenses).toHaveLength(4);
    });
  });

  describe("Flow Component", () => {
    it("should render total income and all expense categories with percentages", () => {
      const { getByText, container } = render(<Flow />);
      expect(getByText("Total Income")).toBeInTheDocument();
      expect(getByText("Rent")).toBeInTheDocument();
      expect(getByText("Food")).toBeInTheDocument();
      expect(getByText("Savings")).toBeInTheDocument();
      expect(getByText("Fun")).toBeInTheDocument();

      // Check initial percentage labels: 15000/50000 = 30.0%, 10000/50000 = 20.0%
      expect(container.textContent).toContain("30.0% of Income");
      expect(container.textContent).toContain("20.0% of Income");

      // Initially 50000 income - 50000 expenses = 0 Remaining
      expect(getByText("Remaining Unallocated: 0 ฿")).toBeInTheDocument();
      const banner = getByText("Remaining Unallocated: 0 ฿");
      expect(banner.className).toContain("text-emerald-700");
    });

    it("should recalculate remaining unallocated when income changes", () => {
      const { container, getByText } = render(<Flow />);
      const incomeInput = container.querySelector("input[type='number']") as HTMLInputElement;

      // Increase income to 70000 -> Remaining: 20,000 ฿
      act(() => {
        fireEvent.change(incomeInput, { target: { value: "70000" } });
      });

      expect(getByText("Remaining Unallocated: 20,000 ฿")).toBeInTheDocument();
      expect(getByText("Remaining Unallocated: 20,000 ฿").className).toContain("text-emerald-700");
    });

    it("should highlight in rose when expenses exceed income", () => {
      const { container, getByText } = render(<Flow />);
      const inputs = container.querySelectorAll("input[type='number']");
      const rentInput = inputs[1] as HTMLInputElement;

      // Increase Rent to 25000 (total expenses = 60000 > income 50000)
      act(() => {
        fireEvent.change(rentInput, { target: { value: "25000" } });
      });

      const banner = getByText("Remaining Unallocated: -10,000 ฿");
      expect(banner).toBeInTheDocument();
      expect(banner.className).toContain("text-rose-700");
    });

    it("should handle zero income without NaN errors", () => {
      const { container } = render(<Flow />);
      const incomeInput = container.querySelector("input[type='number']") as HTMLInputElement;

      act(() => {
        fireEvent.change(incomeInput, { target: { value: "0" } });
      });

      // Percentages should display 0.0%
      expect(container.textContent).toContain("0.0% of Income");
    });
  });

  describe("Page Component", () => {
    it("should render page with back link, title, and Flow component", () => {
      const { getByText } = render(<CashFlowPage />);
      expect(getByText(/CashFlow Stream/i)).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
      expect(getByText("Total Income")).toBeInTheDocument();
    });
  });
});
