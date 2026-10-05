# Phase 1: State & Progressive Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to accept raw income numbers and accurately apply complex deduction caps and tiered percentage brackets to find the final tax amount.
- **The Solution:** Build a centralized client-side store for the inputs. In the main view, write the derivation logic that applies standard caps (`Math.min/max`) and a cascaded `if/else` block to calculate the progressive tax.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `salary`, `bonus`, `ssf`, and `insurance` (all numbers).
- [ ] Implement a unified `update` mutation function that accepts a field name and a numeric value to update the store.
- [ ] In the main component, derive `totalIncome` (`salary * 12 + bonus`).
- [ ] Derive `standardDeduction` safely: `Math.min(totalIncome * 0.5, 100000)`.
- [ ] Derive `netIncome` safely: `Math.max(0, totalIncome - standard - personal(60k) - ssf - insurance)`.
- [ ] Implement the progressive tax bracket logic using cascaded `if/else if` statements (e.g., `> 5M = 35%`, `> 2M = 30%`, down to `> 150k = 5%`), accumulating the base tax for lower brackets.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Use standard JS math functions.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
