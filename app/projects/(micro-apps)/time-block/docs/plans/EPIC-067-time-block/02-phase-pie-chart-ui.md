# Phase 2: Conic Chart & Forms

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The derived durations need to be visualized as a pie chart, and the user needs a seamless form to submit new blocks to the server.
- **The Solution:** Build a split layout. Construct the pie chart using a derived `conic-gradient` CSS string. Build the input form utilizing React's `useTransition` for smooth loading states during server mutations.

## 2. Acceptance Criteria
- [ ] Implement the `conic-gradient` math: map over the activities, accumulate a running percentage based on `(duration / 24) * 100`, and push the color stops into an array. If total duration < 24, fill the remainder with a neutral grey.
- [ ] Render a `<div rounded-full>` and apply the derived gradient string as its background. Place an inner div to create the "donut" hole, displaying the remaining "Free Time" (24 - total hours).
- [ ] Render a list of active blocks with a delete button wired to the delete Server Action (wrapped in `startTransition`).
- [ ] Render a `<form>` at the bottom with inputs for Title, Start (type: time), End (type: time), and a native HTML color picker.
- [ ] Wire the form's `action` to the submit Server Action, clearing the form on successful resolution.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React hook patterns (`useTransition`, `useRef` for forms) and dynamic inline CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
