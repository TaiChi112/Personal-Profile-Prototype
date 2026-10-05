import { describe, it, expect, beforeEach } from "bun:test";
import { render, screen, fireEvent, act } from "@testing-library/react";

import {
  useFocusStore,
  FOCUS_TIME,
  SHORT_BREAK_TIME,
  LONG_BREAK_TIME,
} from "@/app/projects/(micro-apps)/focus-flow/store/useFocusStore";
import PomodoroTimer from "@/app/projects/(micro-apps)/focus-flow/components/PomodoroTimer";
import ActivityHeatmap from "@/app/projects/(micro-apps)/focus-flow/components/ActivityHeatmap";
import FocusFlowApp from "@/app/projects/(micro-apps)/focus-flow/page";

describe("Focus Flow Micro-App", () => {
  beforeEach(() => {
    useFocusStore.setState({
      timeLeft: FOCUS_TIME,
      isRunning: false,
      mode: "FOCUS",
      history: [],
    });
  });

  describe("useFocusStore Zustand Store", () => {
    it("has expected default state and time durations", () => {
      const state = useFocusStore.getState();
      expect(state.timeLeft).toBe(25 * 60); // 1500
      expect(state.isRunning).toBe(false);
      expect(state.mode).toBe("FOCUS");
      expect(state.history).toEqual([]);
      expect(SHORT_BREAK_TIME).toBe(5 * 60); // 300
      expect(LONG_BREAK_TIME).toBe(15 * 60); // 900
    });

    it("updates timeLeft and isRunning", () => {
      useFocusStore.getState().setTimeLeft(1200);
      expect(useFocusStore.getState().timeLeft).toBe(1200);

      useFocusStore.getState().setIsRunning(true);
      expect(useFocusStore.getState().isRunning).toBe(true);
    });

    it("resets timeLeft and pauses timer when switching modes", () => {
      useFocusStore.getState().setIsRunning(true);

      // Switch to SHORT_BREAK
      useFocusStore.getState().setMode("SHORT_BREAK");
      expect(useFocusStore.getState().mode).toBe("SHORT_BREAK");
      expect(useFocusStore.getState().timeLeft).toBe(SHORT_BREAK_TIME);
      expect(useFocusStore.getState().isRunning).toBe(false);

      // Switch to LONG_BREAK
      useFocusStore.getState().setMode("LONG_BREAK");
      expect(useFocusStore.getState().mode).toBe("LONG_BREAK");
      expect(useFocusStore.getState().timeLeft).toBe(LONG_BREAK_TIME);
      expect(useFocusStore.getState().isRunning).toBe(false);

      // Switch back to FOCUS
      useFocusStore.getState().setMode("FOCUS");
      expect(useFocusStore.getState().mode).toBe("FOCUS");
      expect(useFocusStore.getState().timeLeft).toBe(FOCUS_TIME);
      expect(useFocusStore.getState().isRunning).toBe(false);
    });

    it("adds focus sessions with date and duration, and clears history", () => {
      useFocusStore.getState().addSession(25);
      expect(useFocusStore.getState().history.length).toBe(1);
      expect(useFocusStore.getState().history[0].durationMinutes).toBe(25);
      expect(useFocusStore.getState().history[0].date).toBeDefined();

      useFocusStore.getState().addSession(15);
      expect(useFocusStore.getState().history.length).toBe(2);

      useFocusStore.getState().clearHistory();
      expect(useFocusStore.getState().history).toEqual([]);
    });
  });

  describe("PomodoroTimer Component", () => {
    it("renders initial formatted timer 25:00 and mode controls", () => {
      render(<PomodoroTimer />);

      expect(screen.getByText("25:00")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "FOCUS" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "SHORT BREAK" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "LONG BREAK" })).toBeInTheDocument();
    });

    it("switches timer mode on button click and displays correct duration", () => {
      render(<PomodoroTimer />);

      // Click Short Break
      const shortBreakBtn = screen.getByRole("button", { name: /short break/i });
      fireEvent.click(shortBreakBtn);

      expect(useFocusStore.getState().mode).toBe("SHORT_BREAK");
      expect(screen.getByText("05:00")).toBeInTheDocument();

      // Click Long Break
      const longBreakBtn = screen.getByRole("button", { name: /long break/i });
      fireEvent.click(longBreakBtn);

      expect(useFocusStore.getState().mode).toBe("LONG_BREAK");
      expect(screen.getByText("15:00")).toBeInTheDocument();
    });

    it("toggles play/pause state when control button is clicked", () => {
      render(<PomodoroTimer />);

      expect(useFocusStore.getState().isRunning).toBe(false);

      // Click START
      const toggleBtn = screen.getByRole("button", { name: "START" });
      fireEvent.click(toggleBtn);
      expect(useFocusStore.getState().isRunning).toBe(true);

      // Click PAUSE
      const pauseBtn = screen.getByRole("button", { name: "PAUSE" });
      fireEvent.click(pauseBtn);
      expect(useFocusStore.getState().isRunning).toBe(false);
    });

    it("resets timer to initial time and stops running when reset is clicked", () => {
      useFocusStore.setState({ timeLeft: 600, isRunning: true });

      render(<PomodoroTimer />);

      const resetBtn = screen.getByTitle("Reset Timer");
      fireEvent.click(resetBtn);

      expect(useFocusStore.getState().timeLeft).toBe(FOCUS_TIME);
      expect(useFocusStore.getState().isRunning).toBe(false);
    });

    it("decrements timeLeft when interval callback triggers while running", () => {
      let intervalCb: any;
      const originalSetInterval = globalThis.setInterval;
      globalThis.setInterval = ((cb: any) => {
        intervalCb = cb;
        return 888 as any;
      }) as any;

      try {
        useFocusStore.setState({ isRunning: true, timeLeft: 100 });
        render(<PomodoroTimer />);
        expect(intervalCb).toBeDefined();

        act(() => {
          intervalCb();
        });

        expect(useFocusStore.getState().timeLeft).toBe(99);
      } finally {
        globalThis.setInterval = originalSetInterval;
      }
    });

    it("completes focus session: logs session and switches to SHORT_BREAK when timer reaches 0", () => {
      useFocusStore.setState({ mode: "FOCUS", timeLeft: 0, isRunning: true });

      render(<PomodoroTimer />);

      expect(useFocusStore.getState().mode).toBe("SHORT_BREAK");
      expect(useFocusStore.getState().history.length).toBe(1);
      expect(useFocusStore.getState().history[0].durationMinutes).toBe(25);
    });

    it("completes break session: switches back to FOCUS when timer reaches 0", () => {
      useFocusStore.setState({ mode: "SHORT_BREAK", timeLeft: 0, isRunning: true });

      render(<PomodoroTimer />);

      expect(useFocusStore.getState().mode).toBe("FOCUS");
    });

    it("completes long break session: switches back to FOCUS when timer reaches 0", () => {
      useFocusStore.setState({ mode: "LONG_BREAK", timeLeft: 0, isRunning: true });

      render(<PomodoroTimer />);

      expect(useFocusStore.getState().mode).toBe("FOCUS");
    });

    it("clears interval timer when unmounted while running", () => {
      useFocusStore.setState({ isRunning: true, timeLeft: 50 });
      const { unmount } = render(<PomodoroTimer />);
      unmount();
    });

    it("resets timer to correct duration in SHORT_BREAK and LONG_BREAK modes", () => {
      useFocusStore.setState({ mode: "SHORT_BREAK", timeLeft: 100, isRunning: true });
      const { rerender } = render(<PomodoroTimer />);

      const resetBtn = screen.getByTitle("Reset Timer");
      fireEvent.click(resetBtn);
      expect(useFocusStore.getState().timeLeft).toBe(SHORT_BREAK_TIME);

      act(() => {
        useFocusStore.setState({ mode: "LONG_BREAK", timeLeft: 100, isRunning: true });
      });
      rerender(<PomodoroTimer />);
      fireEvent.click(resetBtn);
      expect(useFocusStore.getState().timeLeft).toBe(LONG_BREAK_TIME);
    });

    it("handles successful audio playback without errors", async () => {
      const originalAudio = (globalThis as any).Audio;
      (globalThis as any).Audio = class {
        play() {
          return Promise.resolve();
        }
      };

      try {
        useFocusStore.setState({ mode: "FOCUS", timeLeft: 0, isRunning: true });
        render(<PomodoroTimer />);
        await new Promise((resolve) => setTimeout(resolve, 10));
      } finally {
        (globalThis as any).Audio = originalAudio;
      }
    });

    it("handles audio playback rejection and calls alert fallback", async () => {
      const originalAudio = (globalThis as any).Audio;
      const originalAlert = globalThis.alert;
      let alertCalled = false;
      globalThis.alert = (() => {
        alertCalled = true;
      }) as any;

      (globalThis as any).Audio = class {
        play() {
          return Promise.reject(new Error("Audio blocked"));
        }
      };

      try {
        useFocusStore.setState({ mode: "FOCUS", timeLeft: 0, isRunning: true });
        render(<PomodoroTimer />);

        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(alertCalled).toBe(true);
      } finally {
        (globalThis as any).Audio = originalAudio;
        globalThis.alert = originalAlert;
      }
    });

    it("handles audio constructor throwing and falls back to catch alert", () => {
      const originalAudio = (globalThis as any).Audio;
      const originalAlert = globalThis.alert;
      let alertCount = 0;
      globalThis.alert = (() => {
        alertCount++;
      }) as any;

      (globalThis as any).Audio = class {
        constructor() {
          throw new Error("Audio constructor failed");
        }
      };

      try {
        useFocusStore.setState({ mode: "FOCUS", timeLeft: 0, isRunning: true });
        render(<PomodoroTimer />);
        expect(alertCount).toBe(1);
      } finally {
        (globalThis as any).Audio = originalAudio;
        globalThis.alert = originalAlert;
      }
    });
  });

  describe("ActivityHeatmap Component", () => {
    it("renders heatmap grid for 12 weeks with Less/More legends", () => {
      render(<ActivityHeatmap />);

      expect(screen.getByText("Less")).toBeInTheDocument();
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("maps sessions by date and applies color class based on minutes focused across all tiers", () => {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];

      useFocusStore.setState({
        history: [
          { id: "1", date: todayStr, durationMinutes: 130, timestamp: 1 }, // >= 120 -> emerald-600
          { id: "2", date: yesterdayStr, durationMinutes: 90, timestamp: 2 }, // < 120 -> emerald-500
          { id: "3", date: twoDaysAgoStr, durationMinutes: 45, timestamp: 3 }, // < 60 -> emerald-400
          { id: "4", date: threeDaysAgoStr, durationMinutes: 15, timestamp: 4 }, // < 25 -> emerald-200
        ],
      });

      render(<ActivityHeatmap />);

      // Tier >= 120
      const cellToday = screen.getByTitle(`${todayStr}: 130 mins focused`);
      expect(cellToday.className).toContain("bg-emerald-600");

      // Tier < 120
      const cellYesterday = screen.getByTitle(`${yesterdayStr}: 90 mins focused`);
      expect(cellYesterday.className).toContain("bg-emerald-500");

      // Tier < 60
      const cellTwoDaysAgo = screen.getByTitle(`${twoDaysAgoStr}: 45 mins focused`);
      expect(cellTwoDaysAgo.className).toContain("bg-emerald-400");

      // Tier < 25
      const cellThreeDaysAgo = screen.getByTitle(`${threeDaysAgoStr}: 15 mins focused`);
      expect(cellThreeDaysAgo.className).toContain("bg-emerald-200");
    });
  });

  describe("FocusFlow Page Component", () => {
    it("renders header stats, timer, and heatmap widgets", () => {
      const todayStr = new Date().toISOString().split("T")[0];
      useFocusStore.setState({
        history: [
          { id: "1", date: todayStr, durationMinutes: 60, timestamp: 1_700_000_000_000 },
          { id: "2", date: todayStr, durationMinutes: 30, timestamp: 1_700_000_001_000 },
        ],
      });

      render(<FocusFlowApp />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("Pomodoro Timer & Habit Tracker")).toBeInTheDocument();
      // Total sessions: 2
      expect(screen.getByText("2")).toBeInTheDocument();
      // Total minutes: 60 + 30 = 90m -> 1h 30m
      expect(screen.getByText("1h 30m")).toBeInTheDocument();
      expect(screen.getByText("Activity Heatmap")).toBeInTheDocument();
    });

    it("allows clearing history when confirmed", () => {
      const todayStr = new Date().toISOString().split("T")[0];
      useFocusStore.setState({
        history: [
          { id: "1", date: todayStr, durationMinutes: 25, timestamp: 1_700_000_000_000 },
        ],
      });

      const originalConfirm = window.confirm;
      window.confirm = () => true;

      try {
        render(<FocusFlowApp />);

        const clearBtn = screen.getByText("Clear History");
        fireEvent.click(clearBtn);

        expect(useFocusStore.getState().history).toEqual([]);
      } finally {
        window.confirm = originalConfirm;
      }
    });
  });
});
