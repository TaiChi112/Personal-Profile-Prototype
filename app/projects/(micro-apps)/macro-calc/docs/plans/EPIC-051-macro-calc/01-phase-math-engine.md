# Phase 1: State & Derivation Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to reliably store three independent variables and run consistent mathematical formulas against them every time a change occurs.
- **The Solution:** Implement a centralized state store for the raw gram values. Within the main view component, implement the derivation logic that calculates total calories (Protein*4, Carbs*4, Fat*9) and their respective percentages.

## 2. Acceptance Criteria
- [ ] A state management module is established tracking `protein`, `carbs`, and `fat` (all integers, initialized with reasonable defaults).
- [ ] A dynamic `update` function is created that accepts a field name and a new numeric value.
- [ ] Derivation logic is implemented within the main component to calculate `total` calories safely.
- [ ] Derivation logic calculates the percentage variables (`pPct`, `cPct`, `fPct`), ensuring no division-by-zero errors occur if `total` is 0.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
