# Phase 1: State Engine & View Routing

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to securely hold a few strings of text and know whether it should be asking for input or displaying the saved location.
- **The Solution:** Build a centralized client-side store containing the location strings and a `saved` boolean. Use this boolean in the main component to conditionally return one of two distinct UI trees.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `floor`, `pillar`, `note` (strings) and `saved` (boolean).
- [ ] Implement a `savePark` function that accepts the location strings, updates the store, and sets `saved` to true.
- [ ] Implement a `clearPark` function that resets the strings and sets `saved` to false.
- [ ] In the main component, implement a conditional rendering block: `if (saved)` return the Ticket UI, `else` return the Input UI.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
