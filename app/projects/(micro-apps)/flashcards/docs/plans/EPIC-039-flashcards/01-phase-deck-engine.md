# Phase 1: Deck State & Progression Engine

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to manage a list of Q&A data, track which card the user is currently viewing, and keep a reliable tally of their correct answers.
- **The Solution:** Implement a centralized client-side state store holding an array of card objects, an index pointer, and a score integer. Create a progression function that evaluates the user's input and advances the pointer.

## 2. Acceptance Criteria
- [ ] A state management module is established to track `cards` (array of objects with `q` and `a`), `currentIndex` (integer), and `score` (integer).
- [ ] A `nextCard` function is implemented that accepts a boolean (`correct`). If true, it increments the score.
- [ ] The `nextCard` function must increment the `currentIndex` safely, preventing out-of-bounds errors when the deck is exhausted.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
