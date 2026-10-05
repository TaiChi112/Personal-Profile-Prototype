import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import Highlighter from "@/app/projects/(micro-apps)/regex-lab/components/Highlighter";
import { useRegexStore } from "@/app/projects/(micro-apps)/regex-lab/store/useRegexStore";

describe("Highlighter Component", () => {
  beforeEach(() => {
    useRegexStore.setState({
      pattern: "[A-Z]\\w+",
      text: "Hello World. This is a Test.",
    });
  });

  it("should render initial pattern and test string with match count", () => {
    const { getByText, getByDisplayValue } = render(<Highlighter />);
    expect(getByDisplayValue("[A-Z]\\w+")).toBeDefined();
    expect(getByDisplayValue("Hello World. This is a Test.")).toBeDefined();
    expect(getByText("Found 4 matches")).toBeDefined();
  });

  it("should update match count when pattern changes", () => {
    const { getByText, container } = render(<Highlighter />);
    const patternInput = container.querySelector("input")!;
    const textInput = container.querySelector("textarea")!;

    // Change pattern to digits
    fireEvent.change(patternInput, { target: { value: "\\d+" } });
    expect(getByText("Found 0 matches")).toBeDefined();

    // Now change test string to include digits
    fireEvent.change(textInput, { target: { value: "Numbers: 123, 456, and 789" } });
    expect(getByText("Found 3 matches")).toBeDefined();
  });

  it("should display 'Invalid Regex Pattern' and error style when pattern is invalid syntax", () => {
    const { getByText, container } = render(<Highlighter />);
    const patternInput = container.querySelector("input")!;

    // Invalid unclosed bracket
    fireEvent.change(patternInput, { target: { value: "[unclosed" } });

    expect(getByText("Invalid Regex Pattern")).toBeDefined();
    expect(patternInput.className).toContain("border-red-500");
    expect(patternInput.className).toContain("bg-red-50");
  });

  it("should recover to valid state when invalid pattern is corrected", () => {
    const { getByText, container } = render(<Highlighter />);
    const patternInput = container.querySelector("input")!;

    // Break it
    fireEvent.change(patternInput, { target: { value: "(" } });
    expect(getByText("Invalid Regex Pattern")).toBeDefined();

    // Fix it
    fireEvent.change(patternInput, { target: { value: "\\b[a-z]+\\b" } });
    expect(getByText(/Found \d+ matches/)).toBeDefined();
  });

  it("should handle empty pattern and empty text safely", () => {
    const { getByText, container } = render(<Highlighter />);
    const patternInput = container.querySelector("input")!;
    const textInput = container.querySelector("textarea")!;

    fireEvent.change(patternInput, { target: { value: "" } });
    fireEvent.change(textInput, { target: { value: "" } });

    expect(getByText(/Found \d+ matches/)).toBeDefined();
  });
});
