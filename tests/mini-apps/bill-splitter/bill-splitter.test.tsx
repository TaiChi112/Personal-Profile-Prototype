import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import { useBillStore } from "../../../app/projects/(micro-apps)/bill-splitter/store/useBillStore";
import SplitCalc from "../../../app/projects/(micro-apps)/bill-splitter/components/SplitCalc";
import BillSplitterPage from "../../../app/projects/(micro-apps)/bill-splitter/page";

const initialStoreState = {
  total: 1500,
  people: 3,
  ppNumber: "0812345678",
};

describe("Bill Splitter Micro-App", () => {
  beforeEach(() => {
    (useBillStore as any).setState({
      ...initialStoreState,
    });
  });

  describe("useBillStore", () => {
    it("should initialize with default bill parameters", () => {
      const state = (useBillStore as any).getState();
      expect(state.total).toBe(1500);
      expect(state.people).toBe(3);
      expect(state.ppNumber).toBe("0812345678");
    });

    it("should update store fields individually", () => {
      const { update } = (useBillStore as any).getState();

      update("total", 2400);
      expect((useBillStore as any).getState().total).toBe(2400);

      update("people", 4);
      expect((useBillStore as any).getState().people).toBe(4);

      update("ppNumber", "0899999999");
      expect((useBillStore as any).getState().ppNumber).toBe("0899999999");
    });

    it("should handle boundary edge values", () => {
      const { update } = (useBillStore as any).getState();

      update("total", 0);
      expect((useBillStore as any).getState().total).toBe(0);

      update("people", 1);
      expect((useBillStore as any).getState().people).toBe(1);

      update("ppNumber", "");
      expect((useBillStore as any).getState().ppNumber).toBe("");
    });
  });

  describe("SplitCalc Component", () => {
    it("should render bill form and calculate initial per person amount", () => {
      const { getByText, getByLabelText } = render(<SplitCalc />);
      expect(getByText("BillSplitter + PromptPay")).toBeInTheDocument();
      expect(getByText("Total Bill (THB)")).toBeInTheDocument();
      expect(getByText("Number of People")).toBeInTheDocument();
      expect(getByText("Your PromptPay Number (for QR)")).toBeInTheDocument();

      // 1500 / 3 = 500
      expect(getByText("500 ฿")).toBeInTheDocument();
      expect(getByText("Each Person Pays")).toBeInTheDocument();
    });

    it("should recalculate per person pay when total or people input changes", () => {
      const { container, getByText } = render(<SplitCalc />);
      const inputs = container.querySelectorAll("input");
      const totalInput = inputs[0];
      const peopleInput = inputs[1];

      // Change total to 3000
      act(() => {
        fireEvent.change(totalInput, { target: { value: "3000" } });
      });
      expect(getByText("1,000 ฿")).toBeInTheDocument();

      // Change people to 6 -> 3000 / 6 = 500
      act(() => {
        fireEvent.change(peopleInput, { target: { value: "6" } });
      });
      expect(getByText("500 ฿")).toBeInTheDocument();
    });

    it("should handle division by zero safely when people is 0", () => {
      const { container, getByText } = render(<SplitCalc />);
      const peopleInput = container.querySelectorAll("input")[1];

      act(() => {
        fireEvent.change(peopleInput, { target: { value: "0" } });
      });

      // 1500 / (0 || 1) = 1500
      expect(getByText("1,500 ฿")).toBeInTheDocument();
    });

    it("should show QR code simulation when PromptPay number has 10 or more digits", () => {
      const { container, getByText } = render(<SplitCalc />);
      expect(getByText(/QR Code Simulation/i)).toBeInTheDocument();
      expect(getByText("Scan to pay")).toBeInTheDocument();
    });

    it("should hide QR code simulation when PromptPay number has less than 10 digits", () => {
      const { container, queryByText } = render(<SplitCalc />);
      const ppInput = container.querySelectorAll("input")[2];

      act(() => {
        fireEvent.change(ppInput, { target: { value: "08123" } });
      });

      expect(queryByText(/QR Code Simulation/i)).toBeNull();
      expect(queryByText("Scan to pay")).toBeNull();
    });
  });

  describe("Page Component", () => {
    it("should render page with back link and SplitCalc component", () => {
      const { getByText } = render(<BillSplitterPage />);
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
      expect(getByText("BillSplitter + PromptPay")).toBeInTheDocument();
    });
  });
});
