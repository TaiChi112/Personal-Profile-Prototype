# Phase 2: Split-Pane Summary UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need to understand *why* their tax is a certain amount. A single output number isn't enough; they need to see the breakdown of their deductions.
- **The Solution:** Build a responsive, two-column layout. The left column handles data entry. The right column displays a line-by-line breakdown of the derived math, culminating in a massive display of the final tax.

## 2. Acceptance Criteria
- [ ] Build a responsive grid container (`grid-cols-1 lg:grid-cols-2`).
- [ ] Render the "Income & Deductions" pane containing numeric inputs bound to the store. Add clear labels indicating limits (e.g., "Life Insurance (Max 100k)").
- [ ] Render the "Tax Summary" pane using a highly distinct background color (e.g., deep indigo).
- [ ] Display a line-by-line breakdown in the summary pane: Total Yearly Income, Standard Deduction, Personal Deduction, and Net Taxable Income. Format all numbers with `.toLocaleString()`.
- [ ] Build a distinct, visually heavy block at the bottom of the summary pane displaying the final derived `tax` amount in massive typography.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
