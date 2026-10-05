# Phase 1: State & Derivation Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to track two different types of financial buckets (assets vs debts) and calculate the difference to find the user's true net worth.
- **The Solution:** Build a centralized client-side store containing the two arrays. Implement the array reduction logic in the main view to derive the totals dynamically.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `assets` (array of objects: `id`, `name`, `value`, `color`) and `liabilities` (array of objects: `id`, `name`, `value`, `color`).
- [ ] Initialize the store with mocked data (e.g., Cash, Stocks, Crypto for assets; Car Loan for liabilities).
- [ ] Implement a unified `updateItem` mutation function that accepts the array type ('assets' or 'liabilities'), the item ID, and a new numeric value, updating the store safely.
- [ ] In the main component, utilize array `.reduce` to derive `totalAssets` and `totalLiab`.
- [ ] Derive the `netWorth` variable: `totalAssets - totalLiab`.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
