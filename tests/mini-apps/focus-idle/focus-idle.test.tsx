import { describe, it, expect, beforeEach, } from "bun:test";
import { render, fireEvent, act } from "@testing-library/react";
import { useFocusIdleStore } from "../../../app/projects/(micro-apps)/focus-idle/store/useFocusIdleStore";
import IdleGame from "../../../app/projects/(micro-apps)/focus-idle/components/IdleGame";
import FocusIdlePage from "../../../app/projects/(micro-apps)/focus-idle/page";

const initialStoreState = {
  timeLeft: 25 * 60,
  isRunning: false,
  coins: 0,
  buildings: 0,
};

describe("Focus Idle Micro-App", () => {
  beforeEach(() => {
    (useFocusIdleStore as any).setState({
      ...initialStoreState,
    });
  });

  describe("useFocusIdleStore", () => {
    it("should initialize with default state", () => {
      const state = (useFocusIdleStore as any).getState();
      expect(state.timeLeft).toBe(1500);
      expect(state.isRunning).toBe(false);
      expect(state.coins).toBe(0);
      expect(state.buildings).toBe(0);
    });

    it("should toggle running state", () => {
      const { toggle } = (useFocusIdleStore as any).getState();
      toggle();
      expect((useFocusIdleStore as any).getState().isRunning).toBe(true);

      toggle();
      expect((useFocusIdleStore as any).getState().isRunning).toBe(false);
    });

    it("should decrement time on tick when timeLeft > 1", () => {
      const { tick } = (useFocusIdleStore as any).getState();
      tick();
      expect((useFocusIdleStore as any).getState().timeLeft).toBe(1499);
    });

    it("should reward 100 coins and reset time when countdown reaches zero", () => {
      (useFocusIdleStore as any).setState({ timeLeft: 0, isRunning: true, coins: 0 });
      const { tick } = (useFocusIdleStore as any).getState();

      tick();

      const state = (useFocusIdleStore as any).getState();
      expect(state.timeLeft).toBe(1500);
      expect(state.isRunning).toBe(false);
      expect(state.coins).toBe(100);
    });

    it("should not buy building if coins are below 50", () => {
      (useFocusIdleStore as any).setState({ coins: 49, buildings: 0 });
      const { buyBuilding } = (useFocusIdleStore as any).getState();

      buyBuilding();

      const state = (useFocusIdleStore as any).getState();
      expect(state.coins).toBe(49);
      expect(state.buildings).toBe(0);
    });

    it("should buy building and deduct 50 coins if sufficient balance", () => {
      (useFocusIdleStore as any).setState({ coins: 120, buildings: 1 });
      const { buyBuilding } = (useFocusIdleStore as any).getState();

      buyBuilding();

      const state = (useFocusIdleStore as any).getState();
      expect(state.coins).toBe(70);
      expect(state.buildings).toBe(2);

      buyBuilding();
      const state2 = (useFocusIdleStore as any).getState();
      expect(state2.coins).toBe(20);
      expect(state2.buildings).toBe(3);
    });
  });

  describe("IdleGame Component", () => {
    it("should render 25:00 countdown, FOCUS button, and stat counters", () => {
      const { getByText } = render(<IdleGame />);
      expect(getByText("25:00")).toBeInTheDocument();
      expect(getByText("FOCUS")).toBeInTheDocument();
      expect(getByText("Coins (Get 100 per Focus)")).toBeInTheDocument();
      expect(getByText("Townhalls")).toBeInTheDocument();

      const buyBtn = getByText(/Buy Townhall/i);
      expect(buyBtn.hasAttribute("disabled")).toBe(true);
    });

    it("should toggle button text to PAUSE when running", () => {
      const { getByText } = render(<IdleGame />);
      const focusBtn = getByText("FOCUS");

      act(() => {
        fireEvent.click(focusBtn);
      });

      expect(getByText("PAUSE")).toBeInTheDocument();
      expect((useFocusIdleStore as any).getState().isRunning).toBe(true);
    });

    it("should enable Buy Townhall button when having enough coins and execute purchase", () => {
      const { getByText, container } = render(<IdleGame />);
      const buyBtn = getByText(/Buy Townhall/i);
      expect(buyBtn.hasAttribute("disabled")).toBe(true);

      // Give 50 coins
      act(() => {
        (useFocusIdleStore as any).setState({ coins: 50 });
      });

      expect(buyBtn.hasAttribute("disabled")).toBe(false);

      act(() => {
        fireEvent.click(buyBtn);
      });

      expect((useFocusIdleStore as any).getState().coins).toBe(0);
      expect((useFocusIdleStore as any).getState().buildings).toBe(1);
      expect(buyBtn.hasAttribute("disabled")).toBe(true);
    });

    it("should format remaining minutes and seconds with padding", () => {
      (useFocusIdleStore as any).setState({ timeLeft: 65 }); // 01:05
      const { getByText } = render(<IdleGame />);
      expect(getByText("01:05")).toBeInTheDocument();
    });
  });

  describe("Page Component", () => {
    it("should render page header, back link, and title", () => {
      const { getByText } = render(<FocusIdlePage />);
      expect(getByText("Focus Idle")).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
    });
  });
});
