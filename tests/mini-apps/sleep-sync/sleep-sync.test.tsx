import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSleepStore } from "@/app/projects/(micro-apps)/sleep-sync/store/useSleepStore";
import SleepCalc from "@/app/projects/(micro-apps)/sleep-sync/components/SleepCalc";
import SleepSyncPage from "@/app/projects/(micro-apps)/sleep-sync/page";

describe("Sleep Sync Micro-App", () => {
  beforeEach(() => {
    useSleepStore.setState({
      wakeTime: "07:00",
    });
  });

  describe("useSleepStore Zustand Store", () => {
    it("initializes with default wakeTime 07:00", () => {
      const state = useSleepStore.getState() as any;
      expect(state.wakeTime).toBe("07:00");
    });

    it("updates wakeTime with setWakeTime", () => {
      const store = useSleepStore.getState() as any;
      store.setWakeTime("06:30");
      expect((useSleepStore.getState() as any).wakeTime).toBe("06:30");
    });
  });

  describe("SleepCalc Component & Sleep Cycle Math", () => {
    it("renders sleep cycles for default 07:00 wake time", () => {
      render(<SleepCalc />);

      expect(screen.getByText(/SleepSync/i)).toBeInTheDocument();
      expect(screen.getByText("I need to wake up at")).toBeInTheDocument();

      // Cycles: 6 (9 hrs), 5 (7.5 hrs), 4 (6 hrs), 3 (4.5 hrs)
      expect(screen.getByText("6 Cycles")).toBeInTheDocument();
      expect(screen.getByText("9 hours sleep")).toBeInTheDocument();

      expect(screen.getByText("5 Cycles")).toBeInTheDocument();
      expect(screen.getByText("7.5 hours sleep")).toBeInTheDocument();

      expect(screen.getByText("4 Cycles")).toBeInTheDocument();
      expect(screen.getByText("6 hours sleep")).toBeInTheDocument();

      expect(screen.getByText("3 Cycles")).toBeInTheDocument();
      expect(screen.getByText("4.5 hours sleep")).toBeInTheDocument();
    });

    it("highlights the recommended first cycle (6 cycles)", () => {
      render(<SleepCalc />);

      const sixCyclesEl = screen.getByText("6 Cycles").closest(".p-4");
      expect(sixCyclesEl?.className).toContain("bg-indigo-600");

      const fiveCyclesEl = screen.getByText("5 Cycles").closest(".p-4");
      expect(fiveCyclesEl?.className).toContain("bg-slate-800");
    });

    it("updates sleep suggestions when user changes wake time input", () => {
      render(<SleepCalc />);

      const timeInput = screen.getByDisplayValue("07:00");
      fireEvent.change(timeInput, { target: { value: "08:00" } });

      expect((useSleepStore.getState() as any).wakeTime).toBe("08:00");
    });

    it("handles empty wake time string safely without throwing error", () => {
      useSleepStore.setState({ wakeTime: "" });

      render(<SleepCalc />);
      expect(screen.getByText(/SleepSync/i)).toBeInTheDocument();
      // When timeStr is empty, calculateTimes returns []
      expect(screen.queryByText("6 Cycles")).toBeNull();
    });
  });

  describe("SleepSync Page Component", () => {
    it("renders page header and SleepCalc", () => {
      render(<SleepSyncPage />);
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText(/SleepSync/i)).toBeInTheDocument();
    });
  });
});
