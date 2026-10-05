import { describe, it, expect, beforeEach } from "bun:test";
import { useRegexStore } from "@/app/projects/(micro-apps)/regex-lab/store/useRegexStore";

describe("useRegexStore Zustand Store", () => {
  beforeEach(() => {
    useRegexStore.setState({
      pattern: "[A-Z]\\\\w+",
      text: "Hello World. This is a Test.",
    });
  });

  it("should have correct initial state", () => {
    const state = useRegexStore.getState();
    expect(state.pattern).toBe("[A-Z]\\\\w+");
    expect(state.text).toBe("Hello World. This is a Test.");
  });

  it("should update pattern using setPattern", () => {
    useRegexStore.getState().setPattern("\\d+");
    expect(useRegexStore.getState().pattern).toBe("\\d+");

    useRegexStore.getState().setPattern("^foo.*bar$");
    expect(useRegexStore.getState().pattern).toBe("^foo.*bar$");
  });

  it("should update text using setText", () => {
    useRegexStore.getState().setText("Custom 123 test content 456");
    expect(useRegexStore.getState().text).toBe("Custom 123 test content 456");

    useRegexStore.getState().setText("");
    expect(useRegexStore.getState().text).toBe("");
  });
});
