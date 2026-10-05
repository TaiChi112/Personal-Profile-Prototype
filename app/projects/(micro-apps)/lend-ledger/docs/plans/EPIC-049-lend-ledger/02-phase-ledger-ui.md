# Phase 2: Ledger Interface & Transitions

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need a simple way to input new loans and check off returned items, but rapid clicking on server actions can cause duplicate entries or errors if not handled correctly.
- **The Solution:** Build a dedicated client component for the ledger. Use asynchronous transition hooks to temporarily disable input fields and buttons while the backend processes the request.

## 2. Acceptance Criteria
- [ ] Build an input section with two text fields ("Who" and "What") and a submit button.
- [ ] When submitting a new record, automatically generate the current date string (e.g., YYYY-MM-DD) on the client before passing it to the server action.
- [ ] Render the ledger records as a list. Include a checkbox to toggle the "returned" status and a delete button on each row.
- [ ] Implement visual feedback for returned items (e.g., strike-through text, reduced opacity).
- [ ] Wrap all mutation calls (add, toggle, delete) in a transition hook (e.g., `useTransition`) and use the `isPending` state to disable inputs and buttons globally during network requests.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React hooks (`useState`, `useTransition`) and CSS styling patterns based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
