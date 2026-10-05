import { describe, it, expect, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import MedTrackerPage from "@/app/projects/(micro-apps)/med-tracker/page";
import { useMedStore } from "@/app/projects/(micro-apps)/med-tracker/store/useMedStore";

describe("Med Tracker Page Component", () => {
  beforeEach(() => {
    useMedStore.getState().reset();
  });

  it("should render page heading, back link, and medication list", () => {
    const { getByRole, getByText } = render(<MedTrackerPage />);
    expect(getByRole("link", { name: "← Back" })).toBeDefined();
    expect(getByText(/Med Tracker/)).toBeDefined();
    expect(getByText("Today's Pills")).toBeDefined();
    expect(getByText("Reset Daily")).toBeDefined();
  });
});
