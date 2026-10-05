# Phase 2: Forms & Collection UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs a clean way to input varied data types (text, dates, numbers) and view them simultaneously without leaving the page.
- **The Solution:** Build a split grid layout. Bind a native HTML form to the add action on the left. On the right, render the fetched database records as a scrollable list of cards.

## 2. Acceptance Criteria
- [ ] Build a responsive two-column grid (`grid-cols-1 md:grid-cols-2`).
- [ ] Render a `<form>` in the left pane containing inputs for `destination` (text), `startDate` (date), `endDate` (date), and `budget` (number, step 0.01).
- [ ] Wire the form's `action` attribute directly to the imported `addTripAction`.
- [ ] Render the `initialTrips` array in the right pane as a vertical list. Apply a fixed `max-h` and `overflow-y-auto` to prevent the list from breaking the layout.
- [ ] For each trip card, display the destination, format the date strings, and format the budget (e.g., `.toFixed(2)`).
- [ ] Implement a "Delete" button on each card. Wire its `onClick` handler to `deleteTripAction`, wrapped in a `startTransition` hook.
- [ ] Use the `isPending` state from `useTransition` to disable the submit and delete buttons during network requests.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React hook patterns (`useTransition`) and CSS layout structures based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
