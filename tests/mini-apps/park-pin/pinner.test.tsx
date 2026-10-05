import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Pinner from "@/app/projects/(micro-apps)/park-pin/components/Pinner";
import { useParkStore } from "@/app/projects/(micro-apps)/park-pin/store/useParkStore";

describe("Pinner Component", () => {
  beforeEach(() => {
    useParkStore.setState({
      floor: "",
      pillar: "",
      note: "",
      saved: false,
    });
  });

  it("should render unpinned form state by default with disabled submit button", () => {
    const { getByText, getByPlaceholderText } = render(<Pinner />);
    expect(getByText(/ParkPin/)).toBeDefined();
    expect(getByPlaceholderText("5B")).toBeDefined();
    expect(getByPlaceholderText("H4")).toBeDefined();
    expect(getByPlaceholderText("Near the elevator...")).toBeDefined();

    const pinBtn = getByText(/Pin Location/) as HTMLButtonElement;
    expect(pinBtn.disabled).toBe(true);
  });

  it("should enable pin button when floor is filled and save parking on click", () => {
    const { getByText, getByPlaceholderText } = render(<Pinner />);
    const floorInput = getByPlaceholderText("5B");
    const pillarInput = getByPlaceholderText("H4");
    const noteInput = getByPlaceholderText("Near the elevator...");
    const pinBtn = getByText(/Pin Location/) as HTMLButtonElement;

    fireEvent.change(floorInput, { target: { value: "3A" } });
    fireEvent.change(pillarInput, { target: { value: "P12" } });
    fireEvent.change(noteInput, { target: { value: "Beside Pillar" } });

    expect(pinBtn.disabled).toBe(false);
    fireEvent.click(pinBtn);

    const state = useParkStore.getState() as any;
    expect(state.floor).toBe("3A");
    expect(state.pillar).toBe("P12");
    expect(state.note).toBe("Beside Pillar");
    expect(state.saved).toBe(true);
  });

  it("should render pinned summary view when saved is true", () => {
    useParkStore.setState({
      floor: "7F",
      pillar: "B2",
      note: "Near Zone B entrance",
      saved: true,
    });

    const { getByText } = render(<Pinner />);
    expect(getByText("You Parked At")).toBeDefined();
    expect(getByText("7F")).toBeDefined();
    expect(getByText("B2")).toBeDefined();
    expect(getByText(/Near Zone B entrance/)).toBeDefined();
    expect(getByText(/I Found My Car/)).toBeDefined();
  });

  it("should reset state and return to form view when 'I Found My Car' is clicked", () => {
    useParkStore.setState({
      floor: "7F",
      pillar: "B2",
      note: "Near Zone B entrance",
      saved: true,
    });

    const { getByText } = render(<Pinner />);
    const foundCarBtn = getByText(/I Found My Car/);

    fireEvent.click(foundCarBtn);

    const state = useParkStore.getState() as any;
    expect(state.saved).toBe(false);
    expect(state.floor).toBe("");
    expect(state.pillar).toBe("");
    expect(state.note).toBe("");

    // Returns to form view
    expect(getByText(/ParkPin/)).toBeDefined();
  });

  it("should omit note section in summary view if note is empty", () => {
    useParkStore.setState({
      floor: "B1",
      pillar: "A1",
      note: "",
      saved: true,
    });

    const { getByText, queryByText } = render(<Pinner />);
    expect(getByText("B1")).toBeDefined();
    expect(getByText("A1")).toBeDefined();
    expect(queryByText(/📝/)).toBeNull();
  });
});
