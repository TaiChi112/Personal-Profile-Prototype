# Phase 1: Inventory State & Filtering

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app must hold a master list of items but only display the ones relevant to the user's current destination type to prevent checklist bloat.
- **The Solution:** Build a centralized client-side store containing the master inventory array, tagged by category. Implement the filtering logic within the view component to derive the active checklist based on the selected mode.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `tripType` (string) and `items` (an array of objects containing `id`, `name`, `type` tag, and `packed` boolean).
- [ ] Initialize the store with mocked data covering universal items (e.g., "Passport") and specific items (e.g., "Sunscreen" for Beach, "Coat" for Winter).
- [ ] Implement a `setTripType` function to mutate the active context.
- [ ] Implement a `togglePack` function to mutate the `packed` status of a specific item ID within the master array.
- [ ] In the main component, implement a derivation function that filters the `items` array down to objects where `type` matches the current `tripType` OR equals 'All'.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
