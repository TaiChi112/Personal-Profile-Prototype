# Phase 2: Interface & Result Tiering

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** A list of raw times can be overwhelming. The UI needs to guide the user toward the healthiest option (the most cycles) while providing alternatives if they are staying up late.
- **The Solution:** Build a sleek, dark-themed UI. Emphasize the top result (6 cycles) with glowing borders and distinct colors, while rendering the other options as acceptable fallbacks.

## 2. Acceptance Criteria
- [ ] Wrap the application in a dark, "night mode" theme (e.g., deep slate/indigo backgrounds).
- [ ] Render a central control panel containing a native `<input type="time">` bound to the store's `wakeTime` state. Style it to be massive and borderless.
- [ ] Render the derived array of bedtimes as a vertical list.
- [ ] Apply conditional tiering CSS: the first item (6 cycles) must be visually distinct, using vibrant background colors and box-shadow glows to indicate it is the recommended choice.
- [ ] Render the subsequent items (5, 4, 3 cycles) using more muted, standard styling to indicate they are secondary options.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic styling (e.g., Tailwind conditional classes) based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
