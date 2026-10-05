# Phase 2: Flip Card UI & Gamification

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Presenting both the question and answer simultaneously defeats the purpose of active recall. The user needs a tactile, engaging way to reveal the answer and grade themselves.
- **The Solution:** Build a dedicated Flashcard UI component. It must use localized component state to track whether it is "flipped" or not, controlling the visibility of the answer and the grading buttons.

## 2. Acceptance Criteria
- [ ] Implement a large, central "Card" component that defaults to displaying only the `q` (Question) text.
- [ ] Implement a click interaction on the Card that toggles a `flipped` state, revealing the `a` (Answer) text using smooth CSS transitions (e.g., opacity or 3D transform).
- [ ] Conditionally render "Correct" and "Wrong" action buttons *only* when the card is in the `flipped` state.
- [ ] Ensure that clicking a grading button triggers the state engine's `nextCard` function and resets the local `flipped` state back to false for the next card.
- [ ] Create a "Finished" summary screen that displays the final score once `currentIndex` exceeds the deck length.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React state hooks and CSS animation utilities based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
