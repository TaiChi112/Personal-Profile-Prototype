import { describe, it, expect, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import MacroCalcPage from "@/app/projects/(micro-apps)/macro-calc/page";
import { useMacroStore } from "@/app/projects/(micro-apps)/macro-calc/store/useMacroStore";

describe("Macro Calc Page Component", () => {
  beforeEach(() => {
    useMacroStore.setState({
      protein: 150,
      carbs: 200,
      fat: 60,
    });
  });

  it("should render page heading, back link, and macro calculator component", () => {
    const { getByRole, getByText } = render(<MacroCalcPage />);
    expect(getByRole("link", { name: "← Back" })).toBeDefined();
    expect(getByText(/MacroCalc/)).toBeDefined();
    expect(getByText("Total Calories")).toBeDefined();
    expect(getByText("Protein")).toBeDefined();
    expect(getByText("Carbs")).toBeDefined();
    expect(getByText("Fat")).toBeDefined();
  });
});
