import { describe, it, expect, beforeEach, } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import { useTypeStore } from "../../../app/projects/(micro-apps)/type-trainer/store/useTypeStore";
import TypingGame from "../../../app/projects/(micro-apps)/type-trainer/components/TypingGame";
import TypeTrainerPage from "../../../app/projects/(micro-apps)/type-trainer/page";

describe("Type Trainer", () => {
  beforeEach(() => {
    useTypeStore.getState().reset();
  });

  describe("useTypeStore", () => {
    it("should initialize with default state", () => {
      const state = useTypeStore.getState();
      expect(state.prompt).toBe("const developer = new Set(['code', 'sleep', 'repeat']);");
      expect(state.input).toBe("");
      expect(state.startTime).toBeNull();
      expect(state.wpm).toBe(0);
    });

    it("should record start time on first character input", () => {
      const baseTime = 1_700_000_000_000;
      const originalNow = Date.now;
      Date.now = () => baseTime;

      try {
        useTypeStore.getState().setInput("c");
        const state = useTypeStore.getState();
        expect(state.input).toBe("c");
        expect(state.startTime).toBe(baseTime);
      } finally {
        Date.now = originalNow;
      }
    });

    it("should accurately calculate WPM as elapsed time increases", () => {
      let currentTime = 1_700_000_000_000;
      const originalNow = Date.now;
      Date.now = () => currentTime;

      try {
        useTypeStore.getState().setInput("c");
        currentTime += 30_000;
        useTypeStore.getState().setInput("const developer = new Set");

        const state = useTypeStore.getState();
        expect(state.wpm).toBe(10);
      } finally {
        Date.now = originalNow;
      }
    });

    it("should reset state back to defaults", () => {
      useTypeStore.getState().setInput("some input");
      expect(useTypeStore.getState().input).toBe("some input");

      useTypeStore.getState().reset();
      const state = useTypeStore.getState();
      expect(state.input).toBe("");
      expect(state.startTime).toBeNull();
      expect(state.wpm).toBe(0);
    });

    it("should handle setting empty input after typing", () => {
      useTypeStore.getState().setInput("a");
      useTypeStore.getState().setInput("");
      const state = useTypeStore.getState();
      expect(state.input).toBe("");
      expect(state.startTime).toBeDefined();
    });
  });

  describe("TypingGame Component", () => {
    it("should render prompt characters and 0 WPM initially", () => {
      const { getByText, getAllByText } = render(<TypingGame />);
      expect(getByText("0")).toBeInTheDocument();
      expect(getByText("WPM")).toBeInTheDocument();
      
      const prompt = useTypeStore.getState().prompt;
      expect(getAllByText(prompt[0]).length).toBeGreaterThan(0);
    });

    it("should style correct and incorrect characters properly", () => {
      const { container } = render(<TypingGame />);

      act(() => {
        useTypeStore.getState().setInput("c");
      });

      const spans = container.querySelectorAll("span.transition-colors");
      expect(spans[0].className).toContain("text-green-500");

      act(() => {
        useTypeStore.getState().setInput("cx");
      });

      const spansAfterMistake = container.querySelectorAll("span.transition-colors");
      expect(spansAfterMistake[1].className).toContain("text-red-500");
    });

    it("should focus hidden input on mount and on card click", () => {
      const { container } = render(<TypingGame />);
      const inputEl = container.querySelector("input") as HTMLInputElement;
      const card = container.firstChild as HTMLElement;

      act(() => {
        fireEvent.click(card);
      });
      expect(document.activeElement).toBe(inputEl);
    });

    it("should show finish screen when prompt is fully typed and allow playing again", () => {
      const { container, getByText, queryByText } = render(<TypingGame />);
      const prompt = useTypeStore.getState().prompt;

      act(() => {
        useTypeStore.getState().setInput(prompt);
      });

      expect(getByText("You finished!")).toBeInTheDocument();
      const playAgainBtn = getByText("Play Again");
      expect(playAgainBtn).toBeInTheDocument();

      // Trigger input change when already finished - should not change input
      const inputEl = container.querySelector("input") as HTMLInputElement;
      act(() => {
        fireEvent.change(inputEl, { target: { value: prompt + " extra" } });
      });
      expect(useTypeStore.getState().input).toBe(prompt);

      // Click play again
      act(() => {
        fireEvent.click(playAgainBtn);
      });
      expect(useTypeStore.getState().input).toBe("");
      expect(queryByText("You finished!")).toBeNull();
    });

    it("should allow typing input through setInput and updating input element value", () => {
      const { container } = render(<TypingGame />);
      const inputEl = container.querySelector("input") as HTMLInputElement;

      act(() => {
        fireEvent.change(inputEl, { target: { value: "const" } });
      });
      expect(useTypeStore.getState().input).toBe("const");
      expect(inputEl.value).toBe("const");
    });
  });

  describe("Page Component", () => {
    it("should render page header, back link, and typing game", () => {
      const { getByText } = render(<TypeTrainerPage />);
      expect(getByText("Type Trainer")).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
    });
  });
});
