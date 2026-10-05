# Phase 2: Split-Pane Impact UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The financial numbers need to feel "painful" and significant, while the act of "canceling" (unchecking) a sub needs to feel instantly rewarding.
- **The Solution:** Build a split grid. On the left, a massive, brightly colored block showing the Yearly sum. On the right, a list of clickable subscription cards that visually recede when deactivated.

## 2. Acceptance Criteria
- [ ] Build a responsive grid layout (1 column on mobile, 2 columns on desktop).
- [ ] Render the "Billboard" view: a solid block of color (e.g., rose/red) displaying the `activeYearly` variable using massive typography (`text-5xl`). Ensure the number is formatted with thousands separators (`.toLocaleString()`).
- [ ] Beneath the yearly total, render the `activeMonthly` total in a smaller, secondary font.
- [ ] Render the "Checklist" view: map over the `subs` array, rendering a clickable card for each item containing a checkbox, name, and price.
- [ ] Apply conditional CSS to the checklist cards: Active cards should have strong borders and background tints. Inactive cards should have opacity reduced and strikethrough text to visually signify they have been "cut" from the budget.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
