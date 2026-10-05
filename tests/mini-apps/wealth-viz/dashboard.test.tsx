import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import WealthDashboard from "@/app/projects/(micro-apps)/wealth-viz/components/WealthDashboard";
import Page from "@/app/projects/(micro-apps)/wealth-viz/page";
import { useWealthStore } from "@/app/projects/(micro-apps)/wealth-viz/store/useWealthStore";

describe("WealthDashboard Component & Page", () => {
  beforeEach(() => {
    useWealthStore.setState({
      assets: [
        { id: 1, name: "Cash", value: 50_000, color: "#10B981" },
        { id: 2, name: "Stocks", value: 120_000, color: "#3B82F6" },
        { id: 3, name: "Crypto", value: 30_000, color: "#F59E0B" },
      ],
      liabilities: [
        { id: 4, name: "Car Loan", value: 45_000, color: "#EF4444" },
      ],
    });
  });

  it("should calculate and render initial net worth and category lists", () => {
    // Total assets: 200,000, Total liab: 45,000, Net worth: 155,000
    render(<WealthDashboard />);

    expect(screen.getByText("Asset Allocation")).toBeInTheDocument();
    expect(screen.getByText("Net Worth")).toBeInTheDocument();
    expect(screen.getByText("155,000 ฿")).toBeInTheDocument();

    // Check Assets section
    expect(screen.getByText("Assets")).toBeInTheDocument();
    expect(screen.getAllByText("Cash").length).toBe(2);
    expect(screen.getAllByText("Stocks").length).toBe(2);
    expect(screen.getAllByText("Crypto").length).toBe(2);

    // Check Liabilities section
    expect(screen.getByText("Liabilities (Debt)")).toBeInTheDocument();
    expect(screen.getByText("Car Loan")).toBeInTheDocument();
  });

  it("should update net worth when an asset input is changed", () => {
    render(<WealthDashboard />);

    const inputs = screen.getAllByRole("spinbutton");
    // [Cash, Stocks, Crypto, Car Loan]
    const cashInput = inputs[0];

    fireEvent.change(cashInput, { target: { value: "100000" } });

    // New total assets: 100k + 120k + 30k = 250k. Net worth: 250k - 45k = 205,000
    expect(screen.getByText("205,000 ฿")).toBeInTheDocument();
  });

  it("should update net worth when liability input is changed", () => {
    render(<WealthDashboard />);

    const inputs = screen.getAllByRole("spinbutton");
    const carLoanInput = inputs[3];

    fireEvent.change(carLoanInput, { target: { value: "100000" } });

    // Total assets: 200k. New liab: 100k. Net worth: 200k - 100k = 100,000
    expect(screen.getByText("100,000 ฿")).toBeInTheDocument();
  });

  it("should handle zero total assets gracefully in SVG calculations", () => {
    useWealthStore.setState({
      assets: [
        { id: 1, name: "Cash", value: 0, color: "#10B981" },
      ],
      liabilities: [],
    });

    render(<WealthDashboard />);

    expect(screen.getByText("0 ฿")).toBeInTheDocument();
  });

  it("should render Page component with title and back link", () => {
    render(<Page />);

    expect(screen.getByText("WealthViz 💰")).toBeInTheDocument();
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });
});
