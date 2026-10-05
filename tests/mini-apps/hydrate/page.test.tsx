import { describe, it, expect } from "bun:test";
import React from "react";
import { render } from "@testing-library/react";
import HydratePage from "@/app/projects/(micro-apps)/hydrate/page";

describe("Hydrate Page Component", () => {
  it("should render back link and hydrate component", () => {
    const { getByRole, getByText } = render(<HydratePage />);
    expect(getByRole("link", { name: "← Back" })).toBeDefined();
    expect(getByText("+ Add")).toBeDefined();
    expect(getByText("Reset")).toBeDefined();
    expect(getByText("Daily Hydration")).toBeDefined();
    expect(getByText(/Hit 8 glasses/)).toBeDefined();
  });
});
