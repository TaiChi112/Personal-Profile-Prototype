import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import Hydrate from "@/app/projects/(micro-apps)/hydrate/components/Hydrate";
import { useWaterStore } from "@/app/projects/(micro-apps)/hydrate/store/useWaterStore";

describe("Hydrate Component", () => {
  beforeEach(() => {
    useWaterStore.setState({ glasses: 0, goal: 8 });
  });

  it("should render initial 0% and 8 cup indicators (all empty)", () => {
    const { getByText, container } = render(<Hydrate />);
    expect(getByText("Daily Hydration")).toBeDefined();
    expect(getByText("0%")).toBeDefined();

    const filledCups = container.querySelectorAll("div.bg-blue-500.border-blue-500");
    expect(filledCups.length).toBe(0);

    const circle = container.querySelector("circle.text-blue-500") as SVGCircleElement;
    expect(circle.getAttribute("stroke-dashoffset")).toBe("552");
  });

  it("should increment glasses and calculate correct percentage on '+ Add' click", () => {
    const { getByText, container } = render(<Hydrate />);
    const addBtn = getByText("+ Add");

    // 1 glass = 13% (Math.round(1/8*100))
    fireEvent.click(addBtn);
    expect(getByText("13%")).toBeDefined();

    // 4 glasses = 50%
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);
    fireEvent.click(addBtn);
    expect(getByText("50%")).toBeDefined();

    const filledCups = container.querySelectorAll("div.bg-blue-500.border-blue-500");
    expect(filledCups.length).toBe(4);

    const circle = container.querySelector("circle.text-blue-500") as SVGCircleElement;
    // 552 - (552 * 50) / 100 = 276
    expect(circle.getAttribute("stroke-dashoffset")).toBe("276");
  });

  it("should disable '+ Add' button when daily goal is reached", () => {
    useWaterStore.setState({ glasses: 8, goal: 8 });
    const { getByText, container } = render(<Hydrate />);

    expect(getByText("100%")).toBeDefined();
    const addBtn = getByText("+ Add") as HTMLButtonElement;
    expect(addBtn.disabled).toBe(true);

    const circle = container.querySelector("circle.text-blue-500") as SVGCircleElement;
    // 552 - (552 * 100) / 100 = 0
    expect(circle.getAttribute("stroke-dashoffset")).toBe("0");

    const filledCups = container.querySelectorAll("div.bg-blue-500.border-blue-500");
    expect(filledCups.length).toBe(8);
  });

  it("should reset water intake when 'Reset' button is clicked", () => {
    useWaterStore.setState({ glasses: 5, goal: 8 });
    const { getByText, container } = render(<Hydrate />);
    expect(getByText("63%")).toBeDefined();

    const resetBtn = getByText("Reset");
    fireEvent.click(resetBtn);

    expect(getByText("0%")).toBeDefined();
    const circle = container.querySelector("circle.text-blue-500") as SVGCircleElement;
    expect(circle.getAttribute("stroke-dashoffset")).toBe("552");
    expect(useWaterStore.getState().glasses).toBe(0);
  });
});
