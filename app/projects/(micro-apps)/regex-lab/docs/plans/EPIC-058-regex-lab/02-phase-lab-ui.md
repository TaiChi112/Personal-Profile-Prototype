# Phase 2: Input & Validation UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs immediate, clear visual feedback when their regex pattern is broken, and confirmation when it works.
- **The Solution:** Build two main input areas. Bind dynamic CSS classes to the pattern input so it glows red on error, and display a clear status message showing the match count.

## 2. Acceptance Criteria
- [ ] Build a top-level container for the application.
- [ ] Render a text input for the `pattern` state. Apply conditional CSS classes: if `isValid` is false, apply red borders and a red background tint.
- [ ] Below the pattern input, render a dynamic status message: "Invalid Regex Pattern" (in red) if `isValid` is false, or "Found X matches" (in blue/green) if valid.
- [ ] Render a large `<textarea>` for the `text` state, allowing the user to paste multi-line strings for testing.
- [ ] Ensure all inputs update the global store instantly, triggering the compilation engine on every keystroke.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS bindings (e.g., Tailwind template literals) based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
