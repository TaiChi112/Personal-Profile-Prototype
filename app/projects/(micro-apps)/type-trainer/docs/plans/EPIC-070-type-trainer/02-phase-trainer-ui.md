# Phase 2: Mapping UI & Focus Capture

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Standard text inputs look boring and don't allow character-by-character color coding.
- **The Solution:** Hide the actual input field. Split the prompt text into spans, style them based on the hidden input's value, and ensure the hidden input is always focused when the user wants to type.

## 2. Acceptance Criteria
- [ ] Build the main container view. Implement an `onClick` handler on the container that calls `.focus()` on a React `useRef` attached to the input.
- [ ] Render a hidden input (`opacity-0 absolute`) bound to the store's `input` and `setInput`. Set `maxLength` to the prompt's length.
- [ ] Render the live `wpm` score prominently at the top of the container.
- [ ] Map over `prompt.split('')` to render the text. For each character, apply a `getCharClass` helper function.
- [ ] Implement `getCharClass(char, index)`: 
  - Return neutral/gray if `index >= input.length`.
  - Return green text/background if `char === input[index]`.
  - Return red text/underline if it does not match.
- [ ] When `input.length === prompt.length`, show a "Finished" state and render a "Play Again" button tied to the `reset` mutation.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns (`useRef`, `useEffect` for initial focus) and dynamic CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
