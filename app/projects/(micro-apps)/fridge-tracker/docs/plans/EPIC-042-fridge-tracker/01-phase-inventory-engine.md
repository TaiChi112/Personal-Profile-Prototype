# Phase 1: Inventory State & Date Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to reliably store a list of items and their associated dates, and accurately calculate the difference between those dates and "today".
- **The Solution:** Implement a centralized client-side state store holding an array of items. Write a utility function that performs a mathematical time-delta calculation between the stored date string and the current timestamp to return the remaining days.

## 2. Acceptance Criteria
- [ ] A state management module is established to track `items` (array of objects with `id`, `name`, and `expiry`).
- [ ] Functions to `addItem` and `delItem` are implemented.
- [ ] A `getStatus` utility function is implemented that takes a date string, compares it to the current date, and returns a categorized result based on thresholds (e.g., `< 0` days = expired, `<= 2` days = warning, otherwise = safe).

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Use native Javascript `Date` objects for delta calculations to minimize bundle size.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
