import { describe, it, expect, beforeEach, afterEach, } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import { useWheelStore } from "../../../app/projects/(micro-apps)/decision-wheel/store/useWheelStore";
import Spinner from "../../../app/projects/(micro-apps)/decision-wheel/components/Spinner";
import DecisionWheelPage from "../../../app/projects/(micro-apps)/decision-wheel/page";

const initialOptions = ["KFC", "Sushi", "Pad Thai", "Pizza", "Salad"];

describe("Decision Wheel Micro-App", () => {
  let timeoutCallbacks: Array<{ callback: () => void; delay: number }> = [];
  let intervalCallbacks: Array<{ callback: () => void; interval: number; id: number }> = [];
  let nextIntervalId = 1;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;

  const flushTimeouts = () => {
    const cbs = [...timeoutCallbacks];
    timeoutCallbacks = [];
    cbs.forEach(t => t.callback());
  };

  const flushIntervals = (ticks: number) => {
    for (let i = 0; i < ticks; i++) {
      const active = [...intervalCallbacks];
      active.forEach(item => item.callback());
    }
  };

  beforeEach(() => {
    timeoutCallbacks = [];
    intervalCallbacks = [];
    nextIntervalId = 1;

    globalThis.setTimeout = ((cb: () => void, delay = 0) => {
      timeoutCallbacks.push({ callback: cb, delay });
      return timeoutCallbacks.length as any;
    }) as any;

    globalThis.clearTimeout = ((id: any) => {}) as any;

    globalThis.setInterval = ((cb: () => void, interval = 0) => {
      const id = nextIntervalId++;
      intervalCallbacks.push({ callback: cb, interval, id });
      return id as any;
    }) as any;

    globalThis.clearInterval = ((id: any) => {
      intervalCallbacks = intervalCallbacks.filter(i => i.id !== id);
    }) as any;

    (useWheelStore as any).setState({
      options: [...initialOptions],
      result: null,
      isSpinning: false,
    });
  });

  afterEach(() => {
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    globalThis.setInterval = originalSetInterval;
    globalThis.clearInterval = originalClearInterval;
  });

  describe("useWheelStore", () => {
    it("should initialize with default options and idle state", () => {
      const state = (useWheelStore as any).getState();
      expect(state.options).toEqual(initialOptions);
      expect(state.result).toBeNull();
      expect(state.isSpinning).toBe(false);
    });

    it("should spin and pick a random option from the list", () => {
      const { spin } = (useWheelStore as any).getState();
      spin();

      const state = (useWheelStore as any).getState();
      expect(state.isSpinning).toBe(true);
      expect(initialOptions).toContain(state.result);
    });

    it("should not spin when options list is empty", () => {
      (useWheelStore as any).setState({ options: [] });
      const { spin } = (useWheelStore as any).getState();
      spin();

      const state = (useWheelStore as any).getState();
      expect(state.isSpinning).toBe(false);
      expect(state.result).toBeNull();
    });

    it("should stop spinning", () => {
      (useWheelStore as any).setState({ isSpinning: true });
      const { stopSpin } = (useWheelStore as any).getState();
      stopSpin();

      expect((useWheelStore as any).getState().isSpinning).toBe(false);
    });

    it("should add a new option", () => {
      const { addOption } = (useWheelStore as any).getState();
      addOption("Burgers");

      const state = (useWheelStore as any).getState();
      expect(state.options).toHaveLength(6);
      expect(state.options[5]).toBe("Burgers");
    });

    it("should delete an option by value", () => {
      const { delOption } = (useWheelStore as any).getState();
      delOption("KFC"); // Removes 'KFC'

      const state = (useWheelStore as any).getState();
      expect(state.options).toHaveLength(4);
      expect(state.options).not.toContain("KFC");
    });
  });

  describe("Spinner Component", () => {
    it("should render placeholder display and all initial options", () => {
      const { getByText } = render(<Spinner />);
      expect(getByText("?")).toBeInTheDocument();
      expect(getByText("SPIN!")).toBeInTheDocument();

      initialOptions.forEach(opt => {
        expect(getByText(opt)).toBeInTheDocument();
      });
    });

    it("should allow adding a new option via form input", () => {
      const { getByText, getByPlaceholderText } = render(<Spinner />);
      const input = getByPlaceholderText("Add option...");
      const addBtn = getByText("+");

      act(() => {
        fireEvent.change(input, { target: { value: "Steak" } });
        fireEvent.click(addBtn);
      });

      expect(getByText("Steak")).toBeInTheDocument();
      expect((useWheelStore as any).getState().options).toContain("Steak");
    });

    it("should allow deleting an option using delete button", () => {
      const { getByText, queryByText, container } = render(<Spinner />);
      const deleteButtons = container.querySelectorAll(".flex.flex-wrap button");

      act(() => {
        fireEvent.click(deleteButtons[0]);
      });

      expect(queryByText("KFC")).toBeNull();
      expect((useWheelStore as any).getState().options).not.toContain("KFC");
    });

    it("should disable SPIN! button when options are empty", () => {
      (useWheelStore as any).setState({ options: [] });
      const { getByText } = render(<Spinner />);
      const spinBtn = getByText("SPIN!");
      expect(spinBtn.hasAttribute("disabled")).toBe(true);
    });

    it("should spin, cycle choices, and display final result when timers complete", () => {
      const { getByText, container } = render(<Spinner />);
      const spinBtn = getByText("SPIN!");

      // Start spinning
      act(() => {
        fireEvent.click(spinBtn);
      });

      expect((useWheelStore as any).getState().isSpinning).toBe(true);

      // Cycle interval ticks past 20 to complete spin
      act(() => {
        flushIntervals(25);
      });

      expect((useWheelStore as any).getState().isSpinning).toBe(false);
      const result = (useWheelStore as any).getState().result;
      const displayEl = container.querySelector(".text-5xl.font-black");
      expect(displayEl?.textContent).toBe(result);
    });
  });

  describe("Page Component", () => {
    it("should render page header, back link, and title", () => {
      const { getByText } = render(<DecisionWheelPage />);
      expect(getByText(/Decision Spinner/i)).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
    });
  });
});
