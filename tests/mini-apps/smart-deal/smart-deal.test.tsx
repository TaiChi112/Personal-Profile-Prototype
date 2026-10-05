import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDealStore } from "@/app/projects/(micro-apps)/smart-deal/store/useDealStore";
import DealCalc from "@/app/projects/(micro-apps)/smart-deal/components/DealCalc";
import SmartDealPage from "@/app/projects/(micro-apps)/smart-deal/page";

describe("Smart Deal Micro-App", () => {
  beforeEach(() => {
    // Reset store state
    useDealStore.setState({
      itemA: { price: 100, qty: 1 },
      itemB: { price: 280, qty: 3 },
    });
  });

  describe("useDealStore Zustand Store", () => {
    it("has initial values for itemA and itemB", () => {
      const state = useDealStore.getState() as any;
      expect(state.itemA).toEqual({ price: 100, qty: 1 });
      expect(state.itemB).toEqual({ price: 280, qty: 3 });
    });

    it("updates itemA price and qty using updateA", () => {
      const store = useDealStore.getState() as any;
      store.updateA("price", 150);
      store.updateA("qty", 2);

      const state = useDealStore.getState() as any;
      expect(state.itemA.price).toBe(150);
      expect(state.itemA.qty).toBe(2);
    });

    it("updates itemB price and qty using updateB", () => {
      const store = useDealStore.getState() as any;
      store.updateB("price", 300);
      store.updateB("qty", 4);

      const state = useDealStore.getState() as any;
      expect(state.itemB.price).toBe(300);
      expect(state.itemB.qty).toBe(4);
    });
  });

  describe("DealCalc Component & Value Comparison Logic", () => {
    it("renders initial state where Item B is cheaper (100 vs 93.33 per unit)", () => {
      render(<DealCalc />);

      // itemA unit cost: 100 / 1 = 100.00
      // itemB unit cost: 280 / 3 = 93.33
      expect(screen.getByText("Item A")).toBeInTheDocument();
      expect(screen.getByText("Item B")).toBeInTheDocument();
      expect(screen.getByText("Unit Cost: 100.00 THB/unit")).toBeInTheDocument();
      expect(screen.getByText("Unit Cost: 93.33 THB/unit")).toBeInTheDocument();

      // Verdict: Item B is cheaper
      const verdict = screen.getByText("Item B is Cheaper!");
      expect(verdict).toBeInTheDocument();
      expect(verdict).toHaveClass("text-blue-500");

      // Percent savings: (100 - 93.33) / 100 = ~6.7%
      expect(screen.getByText(/Saves 6.7% per unit/i)).toBeInTheDocument();
    });

    it("detects Item A is cheaper when itemA unit cost is lower", () => {
      useDealStore.setState({
        itemA: { price: 80, qty: 1 }, // unit: 80
        itemB: { price: 200, qty: 2 }, // unit: 100
      });

      render(<DealCalc />);

      // Verdict: Item A is cheaper
      const verdict = screen.getByText("Item A is Cheaper!");
      expect(verdict).toBeInTheDocument();
      expect(verdict).toHaveClass("text-green-500");

      // Percent savings: (100 - 80) / 100 = 20.0%
      expect(screen.getByText(/Saves 20.0% per unit/i)).toBeInTheDocument();
    });

    it("detects Equal Value when unit costs are identical", () => {
      useDealStore.setState({
        itemA: { price: 100, qty: 2 }, // unit: 50
        itemB: { price: 200, qty: 4 }, // unit: 50
      });

      render(<DealCalc />);

      const verdict = screen.getByText("Equal Value");
      expect(verdict).toBeInTheDocument();
      expect(verdict).toHaveClass("text-gray-500");

      // Saves text should not be rendered
      expect(screen.queryByText(/Saves/i)).toBeNull();
    });

    it("handles zero quantity or invalid division without crashing (fallback to 1 or 0)", () => {
      useDealStore.setState({
        itemA: { price: 100, qty: 0 },
        itemB: { price: 100, qty: 1 },
      });

      render(<DealCalc />);

      // Qty 0 fallback in component: (qty || 1)
      expect(screen.getByText("Equal Value")).toBeInTheDocument();
    });

    it("updates store values when user inputs change in UI", () => {
      render(<DealCalc />);

      const inputs = screen.getAllByRole("spinbutton");
      // inputs[0]: Item A Price, inputs[1]: Item A Qty
      // inputs[2]: Item B Price, inputs[3]: Item B Qty

      fireEvent.change(inputs[0], { target: { value: "50" } });
      expect((useDealStore.getState() as any).itemA.price).toBe(50);

      const reRenderedInputs = screen.getAllByRole("spinbutton");
      fireEvent.change(reRenderedInputs[1], { target: { value: "2" } });
      expect((useDealStore.getState() as any).itemA.qty).toBe(2);

      // Now itemA unit cost is 50 / 2 = 25.00
      expect(screen.getByText("Unit Cost: 25.00 THB/unit")).toBeInTheDocument();

      // Update Item B
      const currentInputs = screen.getAllByRole("spinbutton");
      fireEvent.change(currentInputs[2], { target: { value: "60" } });
      const currentInputsAfterPrice = screen.getAllByRole("spinbutton");
      fireEvent.change(currentInputsAfterPrice[3], { target: { value: "3" } });
      expect((useDealStore.getState() as any).itemB.price).toBe(60);
      expect((useDealStore.getState() as any).itemB.qty).toBe(3);
      expect(screen.getByText("Unit Cost: 20.00 THB/unit")).toBeInTheDocument();
    });

    it("handles 0 price and 0 qty correctly displaying 0 THB/unit via isNaN guard", () => {
      useDealStore.setState({
        itemA: { price: 0, qty: 0 },
        itemB: { price: 0, qty: 0 },
      });

      render(<DealCalc />);

      // isNaN(0 / 0) => 0
      const zeroUnitCosts = screen.getAllByText("Unit Cost: 0 THB/unit");
      expect(zeroUnitCosts.length).toBe(2);
    });
  });

  describe("SmartDeal Page Component", () => {
    it("renders page header and DealCalc component", () => {
      render(<SmartDealPage />);
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText("Verdict")).toBeInTheDocument();
    });
  });
});
