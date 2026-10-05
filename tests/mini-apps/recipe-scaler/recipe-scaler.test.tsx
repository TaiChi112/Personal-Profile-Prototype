import { describe, it, expect, beforeEach } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRecipeStore } from "@/app/projects/(micro-apps)/recipe-scaler/store/useRecipeStore";
import Scaler from "@/app/projects/(micro-apps)/recipe-scaler/components/Scaler";
import RecipeScalerPage from "@/app/projects/(micro-apps)/recipe-scaler/page";

describe("Recipe Scaler Micro-App", () => {
  beforeEach(() => {
    // Reset store state
    useRecipeStore.setState({
      baseServings: 2,
      targetServings: 5,
      ingredients: [
        { id: 1, name: "Flour", amount: 200, unit: "g" },
        { id: 2, name: "Eggs", amount: 2, unit: "pcs" },
        { id: 3, name: "Milk", amount: 100, unit: "ml" },
      ],
    });
  });

  describe("useRecipeStore Zustand Store", () => {
    it("has expected default state", () => {
      const state = useRecipeStore.getState() as any;
      expect(state.baseServings).toBe(2);
      expect(state.targetServings).toBe(5);
      expect(state.ingredients.length).toBe(3);
    });

    it("updates base servings with setBase", () => {
      const store = useRecipeStore.getState() as any;
      store.setBase(4);
      expect((useRecipeStore.getState() as any).baseServings).toBe(4);
    });

    it("updates target servings with setTarget", () => {
      const store = useRecipeStore.getState() as any;
      store.setTarget(10);
      expect((useRecipeStore.getState() as any).targetServings).toBe(10);
    });

    it("adds a new ingredient with unique timestamp id", () => {
      const store = useRecipeStore.getState() as any;
      store.addIng({ name: "Sugar", amount: 50, unit: "g" });
      const state = useRecipeStore.getState() as any;
      expect(state.ingredients.length).toBe(4);
      const added = state.ingredients.find((i: any) => i.name === "Sugar");
      expect(added).toBeDefined();
      expect(added.amount).toBe(50);
      expect(added.unit).toBe("g");
      expect(typeof added.id).toBe("number");
    });

    it("deletes an ingredient by id", () => {
      const store = useRecipeStore.getState() as any;
      store.delIng(2); // Remove Eggs
      const state = useRecipeStore.getState() as any;
      expect(state.ingredients.length).toBe(2);
      expect(state.ingredients.find((i: any) => i.id === 2)).toBeUndefined();
    });

    it("handles deleting non-existent id gracefully", () => {
      const store = useRecipeStore.getState() as any;
      store.delIng(9999);
      const state = useRecipeStore.getState() as any;
      expect(state.ingredients.length).toBe(3);
    });
  });

  describe("Scaler Component & Scaling Calculations", () => {
    it("renders initial recipe scaling UI with scaled amounts", () => {
      render(<Scaler />);

      expect(screen.getByText(/RecipeScaler/i)).toBeInTheDocument();
      expect(screen.getByText("Original Servings")).toBeInTheDocument();
      expect(screen.getByText("Target Servings")).toBeInTheDocument();

      // Check ingredient names
      expect(screen.getByText("Flour")).toBeInTheDocument();
      expect(screen.getByText("Eggs")).toBeInTheDocument();
      expect(screen.getByText("Milk")).toBeInTheDocument();

      // Original base 2 -> target 5 scaling:
      // Flour: (200 / 2) * 5 = 500 g
      expect(screen.getByText("500 g")).toBeInTheDocument();
      // Eggs: (2 / 2) * 5 = 5 pcs
      expect(screen.getByText("5 pcs")).toBeInTheDocument();
      // Milk: (100 / 2) * 5 = 250 ml
      expect(screen.getByText("250 ml")).toBeInTheDocument();
    });

    it("recalculates scaled amounts when base servings change", () => {
      render(<Scaler />);

      const baseInput = screen.getAllByRole("spinbutton")[0];
      // Change base from 2 to 4 (scale factor: 5 / 4 = 1.25)
      fireEvent.change(baseInput, { target: { value: "4" } });

      // Flour: (200 / 4) * 5 = 250 g
      expect(screen.getByText("250 g")).toBeInTheDocument();
      // Eggs: (2 / 4) * 5 = 2.5 pcs (testing toFixed(1) for decimals)
      expect(screen.getByText("2.5 pcs")).toBeInTheDocument();
      // Milk: (100 / 4) * 5 = 125 ml
      expect(screen.getByText("125 ml")).toBeInTheDocument();
    });

    it("recalculates scaled amounts when target servings change", () => {
      render(<Scaler />);

      const targetInput = screen.getAllByRole("spinbutton")[1];
      // Change target from 5 to 6 (scale factor: 6 / 2 = 3)
      fireEvent.change(targetInput, { target: { value: "6" } });

      // Flour: (200 / 2) * 6 = 600 g
      expect(screen.getByText("600 g")).toBeInTheDocument();
      // Eggs: (2 / 2) * 6 = 6 pcs
      expect(screen.getByText("6 pcs")).toBeInTheDocument();
      // Milk: (100 / 2) * 6 = 300 ml
      expect(screen.getByText("300 ml")).toBeInTheDocument();
    });

    it("handles zero base servings fallback safely (division by zero guard)", () => {
      render(<Scaler />);

      const baseInput = screen.getAllByRole("spinbutton")[0];
      // Change base to 0 -> fallback to 1: (amount / 1) * target
      fireEvent.change(baseInput, { target: { value: "0" } });

      // Target is 5. Flour: (200 / 1) * 5 = 1000 g
      expect(screen.getByText("1000 g")).toBeInTheDocument();
    });

    it("adds a new ingredient via form submission and displays scaled amount", () => {
      render(<Scaler />);

      const nameInput = screen.getByPlaceholderText(/Ingredient \(e.g. Sugar\)/i);
      const amountInput = screen.getByPlaceholderText(/Amt \(e.g. 50\)/i);
      const unitInput = screen.getByPlaceholderText(/Unit \(g, ml\)/i);
      const addBtn = screen.getByRole("button", { name: "+" });

      // Try adding with empty fields - should do nothing
      fireEvent.click(addBtn);
      expect(screen.queryByText("Butter")).toBeNull();

      // Fill in fields
      fireEvent.change(nameInput, { target: { value: "Butter" } });
      fireEvent.change(amountInput, { target: { value: "40" } });
      fireEvent.change(unitInput, { target: { value: "g" } });

      fireEvent.click(addBtn);

      // Verify newly added ingredient appears with scaled value: (40 / 2) * 5 = 100 g
      expect(screen.getByText("Butter")).toBeInTheDocument();
      expect(screen.getByText("100 g")).toBeInTheDocument();

      // Inputs should be reset
      expect((nameInput as HTMLInputElement).value).toBe("");
      expect((amountInput as HTMLInputElement).value).toBe("");
      expect((unitInput as HTMLInputElement).value).toBe("");
    });

    it("does not add ingredient if only name is provided without amount", () => {
      render(<Scaler />);
      const nameInput = screen.getByPlaceholderText(/Ingredient \(e.g. Sugar\)/i);
      const addBtn = screen.getByRole("button", { name: "+" });

      fireEvent.change(nameInput, { target: { value: "Salt" } });
      fireEvent.click(addBtn);

      expect(screen.queryByText("Salt")).toBeNull();
    });

    it("handles zero target servings fallback safely", () => {
      render(<Scaler />);
      const targetInput = screen.getAllByRole("spinbutton")[1];
      fireEvent.change(targetInput, { target: { value: "0" } });

      // Target 0 falls back to 1. Flour: (200 / 2) * 1 = 100 g
      expect(screen.getByText("100 g")).toBeInTheDocument();
    });

    it("deletes an ingredient when delete button is clicked", () => {
      render(<Scaler />);

      expect(screen.getByText("Flour")).toBeInTheDocument();
      const deleteButtons = screen.getAllByRole("button", { name: "✕" });
      expect(deleteButtons.length).toBe(3);

      // Delete first ingredient (Flour)
      fireEvent.click(deleteButtons[0]);
      expect(screen.queryByText("Flour")).toBeNull();
      expect(screen.getByText("Eggs")).toBeInTheDocument();
    });
  });

  describe("Recipe Scaler Page Component", () => {
    it("renders page container with back link and Scaler component", () => {
      render(<RecipeScalerPage />);
      expect(screen.getByText("← Back")).toBeInTheDocument();
      expect(screen.getByText(/RecipeScaler/i)).toBeInTheDocument();
    });
  });
});
