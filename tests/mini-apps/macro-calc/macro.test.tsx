import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import Macro from "@/app/projects/(micro-apps)/macro-calc/components/Macro";
import { useMacroStore } from "@/app/projects/(micro-apps)/macro-calc/store/useMacroStore";

describe("Macro Component", () => {
  beforeEach(() => {
    useMacroStore.setState({
      protein: 150,
      carbs: 200,
      fat: 60,
    });
  });

  it("should calculate initial total calories and macro percentages correctly", () => {
    // 150 * 4 = 600, 200 * 4 = 800, 60 * 9 = 540. Total = 1,940
    const { getByText } = render(<Macro />);
    expect(getByText("1,940")).toBeDefined();
    expect(getByText("600 kcal")).toBeDefined();
    expect(getByText("800 kcal")).toBeDefined();
    expect(getByText("540 kcal")).toBeDefined();
    expect(getByText("31% P")).toBeDefined();
    expect(getByText("41% C")).toBeDefined();
    expect(getByText("28% F")).toBeDefined();
  });

  it("should update calories and percentages when macro inputs change", () => {
    const { getByText, container } = render(<Macro />);

    // Protein input (first) -> set to 100g (400 kcal)
    let inputs = container.querySelectorAll('input[type="number"]');
    fireEvent.change(inputs[0], { target: { value: "100" } });
    expect(getByText(/400\s*kcal/)).toBeDefined();

    // Carbs input (second) -> set to 100g (400 kcal)
    inputs = container.querySelectorAll('input[type="number"]');
    fireEvent.change(inputs[1], { target: { value: "100" } });

    // Fat input (third) -> set to 100g (900 kcal)
    inputs = container.querySelectorAll('input[type="number"]');
    fireEvent.change(inputs[2], { target: { value: "100" } });
    expect(getByText(/900\s*kcal/)).toBeDefined();

    // Total: 400 + 400 + 900 = 1,700
    expect(getByText("1,700")).toBeDefined();
  });

  it("should prevent NaN division by zero when all macros are zero", () => {
    useMacroStore.setState({
      protein: 0,
      carbs: 0,
      fat: 0,
    });

    const { getByText } = render(<Macro />);
    expect(getByText("0")).toBeDefined();
    expect(getByText("0% P")).toBeDefined();
    expect(getByText("0% C")).toBeDefined();
    expect(getByText("0% F")).toBeDefined();
  });
});
