# Phase 1: State & Derivation Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to store a base recipe and allow the user to modify target servings, dynamically scaling the output without losing the original data.
- **The Solution:** Build a centralized client-side store containing the serving constraints and the ingredient list. Implement derivation math within the component render cycle to calculate the scaled amounts safely.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `baseServings` (number), `targetServings` (number), and `ingredients` (array of objects: `id`, `name`, `amount`, `unit`).
- [ ] Initialize the store with a mocked recipe (e.g., Flour, Eggs, Milk) for testing the math.
- [ ] Implement mutation functions to set `baseServings` and `targetServings`.
- [ ] Implement mutation functions to add a new ingredient to the array and delete an existing one by ID.
- [ ] In the main component, implement a derivation calculation within the `ingredients.map` function: `(ingredient.amount / Math.max(baseServings, 1)) * Math.max(targetServings, 1)`.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
