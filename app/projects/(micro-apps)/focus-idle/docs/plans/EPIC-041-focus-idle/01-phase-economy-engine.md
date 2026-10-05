# Phase 1: Timer & Economy State Engine

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to bridge the gap between passing time and earning rewards, ensuring the math for the virtual economy is strictly maintained.
- **The Solution:** Implement a centralized client-side state store that holds the timer data (timeLeft, isRunning) alongside the economy data (coins, buildings). Write an integrated tick function that handles both time deduction and reward payouts.

## 2. Acceptance Criteria
- [ ] A state management module is established tracking `timeLeft`, `isRunning`, `coins`, and `buildings` inventory.
- [ ] A `tick` function is implemented to decrement `timeLeft`.
- [ ] The `tick` function must include a conditional trap: when `timeLeft` reaches 0, it automatically stops the timer, resets the duration, and adds a fixed amount of `coins` to the wallet.
- [ ] A `buyBuilding` function is implemented that verifies the user has enough coins, deducts the cost, and increments the building inventory.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
