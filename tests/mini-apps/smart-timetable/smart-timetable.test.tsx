import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useTimetableStore } from "@/app/projects/(micro-apps)/smart-timetable/store/useTimetableStore";
import Timetable from "@/app/projects/(micro-apps)/smart-timetable/components/Timetable";
import SmartTimetablePage from "@/app/projects/(micro-apps)/smart-timetable/page";

describe("Smart Timetable Micro-App", () => {
  beforeEach(() => {
    // Reset timetable store slots
    useTimetableStore.setState({
      slots: Array(25).fill(null),
    });
  });

  describe("useTimetableStore Zustand Store", () => {
    it("initializes with 25 null slots", () => {
      const state = useTimetableStore.getState() as any;
      expect(state.slots).toBeArray();
      expect(state.slots.length).toBe(25);
      expect(state.slots.every((s: any) => s === null)).toBe(true);
    });

    it("updates a specific slot immutably", () => {
      const store = useTimetableStore.getState() as any;
      store.updateSlot(0, "Math 101");

      const state = useTimetableStore.getState() as any;
      expect(state.slots[0]).toBe("Math 101");
      expect(state.slots[1]).toBeNull();
      expect(state.slots.length).toBe(25);
    });

    it("updates multiple slots across different indices", () => {
      const store = useTimetableStore.getState() as any;
      store.updateSlot(4, "Physics Lab");
      store.updateSlot(12, "Lunch Break");
      store.updateSlot(24, "Sports");

      const state = useTimetableStore.getState() as any;
      expect(state.slots[4]).toBe("Physics Lab");
      expect(state.slots[12]).toBe("Lunch Break");
      expect(state.slots[24]).toBe("Sports");
    });
  });

  describe("Timetable Component", () => {
    it("renders all day column headers and time row labels", () => {
      render(<Timetable />);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const times = ["09:00", "10:30", "13:00", "14:30", "16:00"];

      days.forEach((day) => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });

      times.forEach((time) => {
        expect(screen.getByText(time)).toBeInTheDocument();
      });

      const textareas = screen.getAllByPlaceholderText("Empty...");
      expect(textareas.length).toBe(25);
    });

    it("allows user to edit a slot textarea and calls updateSlot", () => {
      render(<Timetable />);

      const textareas = screen.getAllByPlaceholderText("Empty...");
      // Edit Monday 09:00 (index 0)
      fireEvent.change(textareas[0], { target: { value: "Algorithms" } });

      const state = useTimetableStore.getState() as any;
      expect(state.slots[0]).toBe("Algorithms");

      // Edit Wednesday 13:00 (row 2, col 2 -> 2 * 5 + 2 = 12)
      fireEvent.change(textareas[12], { target: { value: "Database Design" } });
      expect((useTimetableStore.getState() as any).slots[12]).toBe("Database Design");
    });

    it("applies highlight styling when a slot is populated", () => {
      useTimetableStore.setState({
        slots: [
          "Operating Systems", // index 0
          ...Array(24).fill(null),
        ],
      });

      render(<Timetable />);

      const textareas = screen.getAllByRole("textbox");
      expect(textareas[0]).toHaveValue("Operating Systems");
      expect(textareas[0].className).toContain("bg-blue-50");

      // Empty slot should have default background
      expect(textareas[1]).toHaveValue("");
      expect(textareas[1].className).toContain("bg-white");
    });
  });

  describe("SmartTimetable Page Component", () => {
    it("renders page with back link and Timetable table", () => {
      render(<SmartTimetablePage />);
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText("Mon")).toBeInTheDocument();
    });
  });
});
