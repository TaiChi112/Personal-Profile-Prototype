# Phase 1: State & Derivation Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app must track the price and quantity of two distinct items and mathematically compare their unit costs in real-time.
- **The Solution:** Build a centralized client-side store containing objects for Item A and Item B. Implement derivation math within the main component to calculate unit costs and determine the percentage difference.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `itemA` and `itemB` (objects containing `price` and `qty` numbers).
- [ ] Implement `updateA` and `updateB` mutation functions that accept a field name ('price' or 'qty') and a new numeric value.
- [ ] In the main component, derive `unitA` and `unitB` safely (e.g., `price / (qty || 1)` to prevent division by zero).
- [ ] Implement conditional logic to determine the "winner" (which unit cost is strictly lower) or if they are "Equal Value".
- [ ] Implement math to calculate the percentage saved: `((loserUnit - winnerUnit) / loserUnit) * 100`.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
