import { describe, it, expect } from "bun:test";
import { render } from "@testing-library/react";
import RegexLabPage from "@/app/projects/(micro-apps)/regex-lab/page";

describe("Regex Lab Page Component", () => {
  it("should render page header, back link, and highlighter component", () => {
    const { getByText, getByRole } = render(<RegexLabPage />);
    expect(getByText("Regex Lab")).toBeDefined();
    expect(getByRole("link", { name: "Back" })).toBeDefined();
    expect(getByText("Regex Pattern")).toBeDefined();
    expect(getByText("Test String")).toBeDefined();
  });
});
