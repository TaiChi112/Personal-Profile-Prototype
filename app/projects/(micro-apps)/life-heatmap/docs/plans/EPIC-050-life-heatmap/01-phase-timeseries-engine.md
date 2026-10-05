# Phase 1: Date Generation & State Engine

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app must dynamically generate an array representing exactly the last 365 days, regardless of when the user opens the app, and track the user's input for each specific day.
- **The Solution:** Build a state initialization function using native JS `Date` objects to generate a 365-element array. Implement a state store to hold this array and provide a mutation function to cycle a specific day's intensity level.

## 2. Acceptance Criteria
- [ ] Implement a utility function that generates an array of 365 objects. Each object must contain a unique `id` (index), a formatted `date` string (YYYY-MM-DD), and an initial `level` integer (defaulting to 0).
- [ ] Ensure the last object in the array always corresponds to the current local date (`Date.now()`), stepping backwards chronologically.
- [ ] Establish a client-side state store holding this `days` array.
- [ ] Implement a `toggleDay` function that accepts an ID and increments that day's `level` by 1. If the level reaches a maximum threshold (e.g., 4), it must wrap back to 0.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Use native JS `Date` iteration for the array generation to minimize dependencies.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
