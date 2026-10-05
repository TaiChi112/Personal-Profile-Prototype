import { describe, it, expect } from "bun:test";
import React from "react";
import { render } from "@testing-library/react";
import FridgePage from "@/app/projects/(micro-apps)/fridge-tracker/page";

describe("Fridge Tracker Page Component", () => {
  it("should render page header, back link, and fridge component", () => {
    const { getByText, getByRole, getByPlaceholderText } = render(<FridgePage />);
    expect(getByText(/Fridge Expiry Tracker/)).toBeDefined();
    expect(getByRole("link", { name: "← Back" })).toBeDefined();
    expect(getByPlaceholderText("Item name (e.g. Milk)")).toBeDefined();
  });
});
