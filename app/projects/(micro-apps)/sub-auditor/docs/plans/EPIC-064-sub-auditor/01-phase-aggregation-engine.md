# Phase 1: State & Reduction Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to track multiple subscriptions and calculate their combined long-term impact on the fly.
- **The Solution:** Build a centralized client-side store containing the subscription array. Implement the array filtering and reduction logic within the main component to derive the monthly and yearly totals.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `subs` (an array of objects: `id`, `name`, `price`, `active` boolean).
- [ ] Initialize the store with 3-5 mocked subscriptions (e.g., Video Streaming, Music, Gym) with varied prices and active states.
- [ ] Implement a `toggle` mutation function that accepts an ID and flips the `active` boolean for that specific object.
- [ ] In the main component, write derivation logic: `activeMonthly` = filter array where `active === true`, then `.reduce` the prices into a sum.
- [ ] Derive `activeYearly` by multiplying the monthly sum by 12.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
