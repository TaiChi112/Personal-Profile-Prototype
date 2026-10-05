# Phase 2: Client UI & Transitions

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** When the user clicks "Delete" or "Add", the app needs to talk to the server. If the network is slow, the user might click the button multiple times, causing errors.
- **The Solution:** Build the UI using `useTransition`. Wrap all server action calls in `startTransition`, and use the `isPending` boolean to disable inputs and show a loading overlay over the list.

## 2. Acceptance Criteria
- [ ] Build a top input row containing a text input and an "Add" button. Implement `onKeyDown` to allow submitting via the Enter key.
- [ ] Render the list of tasks passed from the server.
- [ ] For each task, render a checkbox bound to the `toggleTodo` action, the task text (applying strikethrough CSS if `completed` is true), and a "Delete" button bound to the `deleteTodo` action.
- [ ] Implement `useTransition`. Wrap the invocations of all three server actions (`addTodo`, `toggleTodo`, `deleteTodo`) inside `startTransition()`.
- [ ] Apply the `disabled={isPending}` attribute to all inputs, checkboxes, and buttons.
- [ ] Render a semi-transparent absolute overlay over the task list containing an "Updating..." message that only appears when `isPending` is true.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React hook patterns (`useTransition`, `useState` for the text input) and CSS layout structures based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
