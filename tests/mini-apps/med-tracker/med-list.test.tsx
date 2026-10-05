import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import MedList from "@/app/projects/(micro-apps)/med-tracker/components/MedList";
import { useMedStore } from "@/app/projects/(micro-apps)/med-tracker/store/useMedStore";

describe("MedList Component", () => {
  beforeEach(() => {
    useMedStore.setState({
      meds: [
        { id: 1, name: "Vitamin C", time: "Morning", taken: false },
        { id: 2, name: "Fish Oil", time: "After Lunch", taken: false },
      ],
    });
  });

  it("should render header and medication items", () => {
    const { getByText } = render(<MedList />);
    expect(getByText("Today's Pills")).toBeDefined();
    expect(getByText("Reset Daily")).toBeDefined();
    expect(getByText("Vitamin C")).toBeDefined();
    expect(getByText(/Morning/)).toBeDefined();
    expect(getByText("Fish Oil")).toBeDefined();
    expect(getByText(/After Lunch/)).toBeDefined();
  });

  it("should toggle medication taken state when item is clicked", () => {
    const { getByText } = render(<MedList />);
    const vitC = getByText("Vitamin C");

    // Initially not taken
    expect(vitC.className).not.toContain("line-through");

    // Click to mark taken
    fireEvent.click(vitC);

    expect(vitC.className).toContain("line-through");
    expect(useMedStore.getState().meds.find((m: any) => m.id === 1).taken).toBe(true);

    // Click again to mark untaken
    fireEvent.click(vitC);
    expect(vitC.className).not.toContain("line-through");
    expect(useMedStore.getState().meds.find((m: any) => m.id === 1).taken).toBe(false);
  });

  it("should reset all pills to untaken when 'Reset Daily' is clicked", () => {
    useMedStore.setState({
      meds: [
        { id: 1, name: "Vitamin C", time: "Morning", taken: true },
        { id: 2, name: "Fish Oil", time: "After Lunch", taken: true },
      ],
    });

    const { getByText } = render(<MedList />);
    const vitC = getByText("Vitamin C");
    const fishOil = getByText("Fish Oil");

    expect(vitC.className).toContain("line-through");
    expect(fishOil.className).toContain("line-through");

    const resetBtn = getByText("Reset Daily");
    fireEvent.click(resetBtn);

    expect(vitC.className).not.toContain("line-through");
    expect(fishOil.className).not.toContain("line-through");
    expect(useMedStore.getState().meds.every((m: any) => !m.taken)).toBe(true);
  });
});
