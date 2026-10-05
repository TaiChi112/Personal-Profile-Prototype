import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { useMoodStore } from "../../../app/projects/(micro-apps)/zen-mood/store/useMoodStore";
import Mood from "../../../app/projects/(micro-apps)/zen-mood/components/Mood";
import ZenMoodPage from "../../../app/projects/(micro-apps)/zen-mood/page";

const initialEntry = {
  id: 1,
  mood: "😁",
  energy: 8,
  date: "2026-10-04"
};

describe("Zen Mood Micro-App", () => {
  beforeEach(() => {
    (useMoodStore as any).setState({
      entries: [{ ...initialEntry }],
    });
  });

  describe("useMoodStore", () => {
    it("should initialize with default entry", () => {
      const state = (useMoodStore as any).getState();
      expect(state.entries).toHaveLength(1);
      expect(state.entries[0].mood).toBe("😁");
      expect(state.entries[0].energy).toBe(8);
    });

    it("should prepend new entry to entries array with current timestamp id", () => {
      const { add } = (useMoodStore as any).getState();
      const newEntry = { mood: "🙂", energy: 9, date: "2026-10-05" };
      add(newEntry);

      const state = (useMoodStore as any).getState();
      expect(state.entries).toHaveLength(2);
      expect(state.entries[0].mood).toBe("🙂");
      expect(state.entries[0].energy).toBe(9);
      expect(state.entries[0].date).toBe("2026-10-05");
      expect(typeof state.entries[0].id).toBe("number");
      // Previous entry is preserved at index 1
      expect(state.entries[1].id).toBe(1);
    });

    it("should support multiple sequential entries", () => {
      const { add } = (useMoodStore as any).getState();
      add({ mood: "😐", energy: 4, date: "2026-10-05" });
      add({ mood: "😠", energy: 2, date: "2026-10-05" });

      const state = (useMoodStore as any).getState();
      expect(state.entries).toHaveLength(3);
      expect(state.entries[0].mood).toBe("😠");
      expect(state.entries[1].mood).toBe("😐");
    });
  });

  describe("Mood Component", () => {
    it("should render mood question, buttons, energy slider, and recent entries", () => {
      const { getByText, container } = render(<Mood />);
      expect(getByText("How are you today?")).toBeInTheDocument();
      expect(getByText(/Energy Level:/i)).toBeInTheDocument();
      expect(getByText("Save Journal")).toBeInTheDocument();
      expect(getByText("Recent Entries")).toBeInTheDocument();

      const slider = container.querySelector("input[type='range']") as HTMLInputElement;
      expect(slider).toBeInTheDocument();
      expect(slider.value).toBe("5");
    });

    it("should allow changing mood selection", () => {
      const { container } = render(<Mood />);
      const buttons = container.querySelectorAll(".flex.justify-center.gap-4 button");
      expect(buttons.length).toBe(5);

      // Select first mood button
      act(() => {
        fireEvent.click(buttons[0]);
      });
      expect(buttons[0].className).toContain("scale-125");

      // Select second mood button
      act(() => {
        fireEvent.click(buttons[1]);
      });
      expect(buttons[1].className).toContain("scale-125");
      expect(buttons[0].className).not.toContain("scale-125");
    });

    it("should allow changing energy slider", () => {
      const { container, getByText } = render(<Mood />);
      const slider = container.querySelector("input[type='range']") as HTMLInputElement;

      act(() => {
        fireEvent.change(slider, { target: { value: "9" } });
      });

      expect(getByText("9")).toBeInTheDocument();
    });

    it("should save new journal entry and display in recent entries list", () => {
      const { getByText, container } = render(<Mood />);
      const buttons = container.querySelectorAll(".flex.justify-center.gap-4 button");
      const slider = container.querySelector("input[type='range']") as HTMLInputElement;
      const saveBtn = getByText("Save Journal");

      // Select a mood and energy
      act(() => {
        fireEvent.click(buttons[3]); // 🙂
        fireEvent.change(slider, { target: { value: "7" } });
        fireEvent.click(saveBtn);
      });

      const state = (useMoodStore as any).getState();
      expect(state.entries).toHaveLength(2);
      expect(state.entries[0].energy).toBe(7);

      const recentItems = container.querySelectorAll(".space-y-3 > .rounded-2xl");
      expect(recentItems.length).toBe(2);
    });
  });

  describe("Page Component", () => {
    it("should render page header, back link, and title", () => {
      const { getByText } = render(<ZenMoodPage />);
      expect(getByText(/ZenMood/i)).toBeInTheDocument();
      const backLink = getByText("← Back");
      expect(backLink).toBeInTheDocument();
      expect(backLink.getAttribute("href")).toBe("/projects");
    });
  });
});
