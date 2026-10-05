# Phase 1: State & Async Algorithm

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to store a random array of numbers and sort them, but a standard `.sort()` happens instantly. We need to intentionally slow down the algorithm so the user can see it work.
- **The Solution:** Build a centralized client-side store for the array. In the main view, write a custom Bubble Sort function that uses `async/await` and `setTimeout` to pause execution and update the store after every single swap.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `array` (an array of numbers) and `isSorting` (boolean).
- [ ] Implement a `generateArray` function that populates the array with randomized integers (e.g., 30 items ranging from 10 to 100).
- [ ] In the main component, implement an asynchronous `bubbleSort` function.
- [ ] The `bubbleSort` function must contain nested loops. When a swap occurs, it must update the store's `array` state immediately.
- [ ] After updating the state, the function must `await new Promise` with a short timeout (e.g., 50ms) to allow React to render the intermediate step before continuing the loop.
- [ ] The function must set `isSorting` to true when starting, and false when complete.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Use standard JS asynchronous Promise patterns.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
