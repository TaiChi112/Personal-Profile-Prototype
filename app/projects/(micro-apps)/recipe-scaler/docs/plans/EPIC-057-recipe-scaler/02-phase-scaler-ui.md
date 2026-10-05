# Phase 2: Input & Formatted UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs a clear visual distinction between the "Original" amounts they entered and the "Target" amounts the app calculated, formatted so it's readable while cooking.
- **The Solution:** Build a top-level header controlling the serving ratio. Build an input bar for adding ingredients. Render the list items with the original amount struck through and the scaled amount highlighted.

## 2. Acceptance Criteria
- [ ] Build a top header containing two large number inputs (`baseServings` and `targetServings`) separated by a visual arrow indicator.
- [ ] Build a multi-input row allowing the user to type an ingredient name, a numeric amount, and a unit string, with a "+" button to submit to the store.
- [ ] Render the `ingredients` array as a vertical list.
- [ ] For each list item, display the original amount in a small, strikethrough font, and the derived scaled amount in a large, bold, highly visible color.
- [ ] Format the derived scaled amount: if it resolves to a whole number, display no decimals. If it results in a fraction, use `.toFixed(1)` or similar to prevent massive decimal strings (e.g., `3.333333`).

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic styling based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
