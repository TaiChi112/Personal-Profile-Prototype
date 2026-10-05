import { describe, it, expect, beforeEach } from "bun:test";
import { render } from "@testing-library/react";
import ParkPinPage from "@/app/projects/(micro-apps)/park-pin/page";
import { useParkStore } from "@/app/projects/(micro-apps)/park-pin/store/useParkStore";

describe("Park Pin Page Component", () => {
  beforeEach(() => {
    useParkStore.getState().clearPark();
  });

  it("should render back link and pinner component", () => {
    const { getByRole, getByText } = render(<ParkPinPage />);
    expect(getByRole("link", { name: "← Back" })).toBeDefined();
    expect(getByText(/ParkPin/)).toBeDefined();
    expect(getByText(/Pin Location/)).toBeDefined();
  });
});
