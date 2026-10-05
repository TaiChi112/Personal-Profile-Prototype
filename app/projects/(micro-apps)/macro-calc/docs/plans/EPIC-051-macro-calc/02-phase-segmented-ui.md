# Phase 2: Input & Proportional UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need a fast way to input their macros and an immediate, visual understanding of their diet's ratio (e.g., seeing visually that a Keto diet is vastly dominated by fat).
- **The Solution:** Build three distinct, color-coded input bars for the macros. Build a massive central "Total Calories" display, sitting above a segmented, full-width progress bar that acts as a pie chart translated to a linear axis.

## 2. Acceptance Criteria
- [ ] Build a massive, central display for the `total` calories derived in Phase 1.
- [ ] Create a "Segmented Bar" component. It must be a single horizontal container containing three distinct child divs (Protein, Carbs, Fat) colored appropriately, with their CSS `width` mapped directly to their calculated percentage.
- [ ] Create an `InputBar` reusable component. Render three instances of it. Each must display the macro name, a number input bound to the state engine, and the specific caloric sub-total for that macro.
- [ ] Ensure all inputs and visual segments update instantly without lag as the user types.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI patterns and dynamic CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
