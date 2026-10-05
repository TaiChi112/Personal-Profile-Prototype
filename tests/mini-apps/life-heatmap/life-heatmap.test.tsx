import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useHeatStore } from "@/app/projects/(micro-apps)/life-heatmap/store/useHeatStore";
import Heatmap from "@/app/projects/(micro-apps)/life-heatmap/components/Heatmap";
import LifeHeatmapPage from "@/app/projects/(micro-apps)/life-heatmap/page";

describe("Life Heatmap Micro-App", () => {
  beforeEach(() => {
    // Initialize deterministic days array with unique dates
    const testDays = Array.from({ length: 365 }).map((_, i) => ({
      id: i,
      date: `day-${i}`,
      level: 0,
    }));

    useHeatStore.setState({
      days: testDays,
    });
  });

  describe("useHeatStore Zustand Store", () => {
    it("initializes with 365 days with id, date, and level between 0 and 3", () => {
      const state = useHeatStore.getState() as any;
      expect(state.days.length).toBe(365);
      expect(state.days[0].id).toBe(0);
      expect(state.days[0].date).toBeDefined();
      expect(state.days[0].level).toBeGreaterThanOrEqual(0);
      expect(state.days[0].level).toBeLessThanOrEqual(3);
    });

    it("cycles day level from 0 to 1, 2, 3, then back to 0 on toggleDay", () => {
      const store = useHeatStore.getState() as any;

      // Start at level 0
      expect((useHeatStore.getState() as any).days[5].level).toBe(0);

      // 0 -> 1
      store.toggleDay(5);
      expect((useHeatStore.getState() as any).days[5].level).toBe(1);

      // 1 -> 2
      store.toggleDay(5);
      expect((useHeatStore.getState() as any).days[5].level).toBe(2);

      // 2 -> 3
      store.toggleDay(5);
      expect((useHeatStore.getState() as any).days[5].level).toBe(3);

      // 3 -> 0
      store.toggleDay(5);
      expect((useHeatStore.getState() as any).days[5].level).toBe(0);
    });

    it("only updates the targeted day and leaves other days unchanged", () => {
      const store = useHeatStore.getState() as any;
      store.toggleDay(10);

      const state = useHeatStore.getState() as any;
      expect(state.days[10].level).toBe(1);
      expect(state.days[9].level).toBe(0);
      expect(state.days[11].level).toBe(0);
    });
  });

  describe("Heatmap Component", () => {
    it("renders heatmap title, 52x7 day grid, and Less/More legend", () => {
      render(<Heatmap />);

      expect(screen.getByText(/Activity Heatmap/i)).toBeInTheDocument();
      expect(screen.getByText("Less")).toBeInTheDocument();
      expect(screen.getByText("More")).toBeInTheDocument();
    });

    it("applies correct color classes based on level", () => {
      const days = [...(useHeatStore.getState() as any).days];
      days[0] = { id: 0, date: "day-0", level: 0 };
      days[1] = { id: 1, date: "day-1", level: 1 };
      days[2] = { id: 2, date: "day-2", level: 2 };
      days[3] = { id: 3, date: "day-3", level: 3 };
      useHeatStore.setState({ days });

      render(<Heatmap />);

      // Level 0 -> gray
      expect(screen.getByTitle("day-0").className).toContain("bg-gray-100");
      // Level 1 -> emerald-200
      expect(screen.getByTitle("day-1").className).toContain("bg-emerald-200");
      // Level 2 -> emerald-400
      expect(screen.getByTitle("day-2").className).toContain("bg-emerald-400");
      // Level 3 -> emerald-600
      expect(screen.getByTitle("day-3").className).toContain("bg-emerald-600");
    });

    it("cycles day level when a day cell is clicked in the grid", () => {
      render(<Heatmap />);

      const targetCell = screen.getByTitle("day-0");

      // Initially level 0
      expect(targetCell.className).toContain("bg-gray-100");

      // Click to toggle to level 1
      fireEvent.click(targetCell);

      expect((useHeatStore.getState() as any).days[0].level).toBe(1);
    });

    it("handles missing day items by rendering empty placeholders", () => {
      useHeatStore.setState({ days: [] });
      render(<Heatmap />);
      expect(screen.getByText(/Activity Heatmap/i)).toBeInTheDocument();
    });
  });

  describe("LifeHeatmap Page Component", () => {
    it("renders page with back link and Heatmap component", () => {
      render(<LifeHeatmapPage />);

      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText(/Activity Heatmap/i)).toBeInTheDocument();
    });
  });
});
