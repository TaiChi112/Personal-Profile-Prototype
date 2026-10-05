# Phase 1: State & WPM Math Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to track exactly when the user starts typing and continuously calculate their speed based on a standardized metric (5 characters = 1 word).
- **The Solution:** Build a centralized client-side store containing the prompt, input, and start time. Implement the math to derive elapsed minutes and convert raw characters into WPM.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `prompt` (string, initialized with a code snippet like `const x = "code";`), `input` (string), `startTime` (number/null), and `wpm` (number).
- [ ] Implement a `reset` mutation function to clear input, time, and WPM.
- [ ] Implement a `setInput` mutation function that accepts a new string.
- [ ] Inside `setInput`: If `startTime` is null and `input.length > 0`, capture `Date.now()` as the `startTime`.
- [ ] Inside `setInput`: If `startTime` exists, calculate elapsed time in minutes: `(Date.now() - startTime) / 60000`.
- [ ] Inside `setInput`: Calculate `wpm` using standard typing metrics: `(input.length / 5) / elapsedMinutes`. Save it to state.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
