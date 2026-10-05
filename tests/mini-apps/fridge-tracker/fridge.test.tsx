import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Fridge from "@/app/projects/(micro-apps)/fridge-tracker/components/Fridge";
import { useFridgeStore } from "@/app/projects/(micro-apps)/fridge-tracker/store/useFridgeStore";

describe("Fridge Component", () => {
  const today = new Date();
  const formatOffsetDate = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const expiredDate = formatOffsetDate(-2); // 2 days ago
  const expiringSoonDate = formatOffsetDate(1); // 1 day ahead
  const safeDate = formatOffsetDate(7); // 7 days ahead

  beforeEach(() => {
    useFridgeStore.setState({
      items: [
        { id: 101, name: "Fresh Apples", expiry: safeDate },
        { id: 102, name: "Old Cheese", expiry: expiredDate },
        { id: 103, name: "Fresh Milk", expiry: expiringSoonDate },
      ],
    });
  });

  it("should render sorted items according to expiry date ascending", () => {
    const { container } = render(<Fridge />);
    const itemNames = Array.from(container.querySelectorAll("span.font-bold.text-lg")).map(
      (el) => el.textContent
    );
    // Old Cheese (expired) should come first, then Fresh Milk (soon), then Fresh Apples (safe)
    expect(itemNames).toEqual(["Old Cheese", "Fresh Milk", "Fresh Apples"]);
  });

  it("should display correct status badges for expired, expiring soon, and safe items", () => {
    const { getByText } = render(<Fridge />);
    expect(getByText("Expired!")).toBeDefined();
    expect(getByText(/Exp in/)).toBeDefined();
    expect(getByText(/Safe/)).toBeDefined();
  });

  it("should add a new item when name and expiry date are filled and submitted", () => {
    const { container, getByText } = render(<Fridge />);
    const nameInput = container.querySelector('input[type="text"]')!;
    const dateInput = container.querySelector('input[type="date"]')!;
    const addBtn = getByText("+");

    const futureDate = formatOffsetDate(10);
    fireEvent.change(nameInput, { target: { value: "Greek Yogurt" } });
    fireEvent.change(dateInput, { target: { value: futureDate } });
    fireEvent.click(addBtn);

    expect(getByText("Greek Yogurt")).toBeDefined();
    expect(useFridgeStore.getState().items.some((i: any) => i.name === "Greek Yogurt")).toBe(true);
  });

  it("should not add item if name is empty", () => {
    const { container, getByText } = render(<Fridge />);
    const initialCount = useFridgeStore.getState().items.length;
    const dateInput = container.querySelector('input[type="date"]')!;
    const addBtn = getByText("+");

    fireEvent.change(dateInput, { target: { value: formatOffsetDate(5) } });
    fireEvent.click(addBtn);

    expect(useFridgeStore.getState().items.length).toBe(initialCount);
  });

  it("should not add item if expiry date is empty", () => {
    const { container, getByText } = render(<Fridge />);
    const initialCount = useFridgeStore.getState().items.length;
    const nameInput = container.querySelector('input[type="text"]')!;
    const addBtn = getByText("+");

    fireEvent.change(nameInput, { target: { value: "Orange Juice" } });
    fireEvent.click(addBtn);

    expect(useFridgeStore.getState().items.length).toBe(initialCount);
  });

  it("should delete item when delete button is clicked", () => {
    const { getAllByText, queryByText } = render(<Fridge />);
    expect(queryByText("Old Cheese")).toBeDefined();

    const deleteButtons = getAllByText("✕");
    // First item is Old Cheese
    fireEvent.click(deleteButtons[0]);

    expect(queryByText("Old Cheese")).toBeNull();
    expect(useFridgeStore.getState().items.some((i: any) => i.name === "Old Cheese")).toBe(false);
  });
});
