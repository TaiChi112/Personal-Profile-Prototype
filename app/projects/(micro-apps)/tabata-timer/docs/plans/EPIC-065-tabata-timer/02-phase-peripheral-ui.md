# Phase 2: Interface & Peripheral Cues

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users are physically exerting themselves and cannot focus on small text. The interface must be legible from across a room.
- **The Solution:** Build a massive central UI block. Bind the main container's background color strictly to the `status` state so the screen flashes visibly when transitioning between work and rest.

## 2. Acceptance Criteria
- [ ] Build a top control bar containing inputs for Work, Rest, and Rounds. Disable these inputs if the `status` is not `idle`.
- [ ] Render the main countdown block using massive, tabular typography (`text-9xl`, `tabular-nums`) tied to `timeLeft`.
- [ ] Render the round tracker (`Round X / Y`) below the main clock.
- [ ] Build a massive, full-width START/STOP toggle button.
- [ ] Apply state-driven CSS classes to the main container wrapper:
  - `idle`: Dark Slate background
  - `work`: Bright Red/Rose background
  - `rest`: Vibrant Green/Emerald background
  - Ensure a smooth `transition-colors duration-500` CSS rule is applied for a pleasant visual effect.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS bindings (e.g., Tailwind conditional classes) based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
