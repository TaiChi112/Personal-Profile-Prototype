# Phase 2: Tracker Dashboard UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need a highly legible interface to understand their balance instantly, input data rapidly, and view their grouped analytics.
- **The Solution:** Build a unified card layout. The top section is a massive balance billboard. The middle handles inputs and transaction history. The bottom visualizes the server-provided analytics.

## 2. Acceptance Criteria
- [ ] Build the "Billboard" view: Derive the total `income`, `expense`, and `balance` from the raw transactions array. Display the balance prominently using large typography and localized formatting (`.toLocaleString()`).
- [ ] Build the input form row: A select dropdown (Income/Expense), a text input for the label, a number input for the amount, and an Add button. Wire the button to the `addTransaction` action.
- [ ] Implement loading state management (e.g., `useState(false)`) to disable inputs during network requests.
- [ ] Render the transaction history as a scrollable list, highlighting income in green and expenses in red. Include a delete button wired to `deleteTransaction`.
- [ ] Render the "Analytics" view: Iterate over the analytics array. For each group, render the label, total sum, and a mini CSS bar chart calculated relative to the maximum group total in the array.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
