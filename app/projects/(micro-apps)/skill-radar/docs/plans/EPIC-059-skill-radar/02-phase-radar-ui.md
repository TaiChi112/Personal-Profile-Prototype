# Phase 2: Input Sliders & SVG UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The mathematical points need to be drawn beautifully, and the user needs an intuitive way to change the underlying data in real-time.
- **The Solution:** Build a side-by-side (or stacked on mobile) layout. On one side, draw the native SVG chart (grid lines, axes, and the filled data polygon). On the other side, render the list of range sliders bound to the store.

## 2. Acceptance Criteria
- [ ] Render the native `<svg>` element.
- [ ] Render the background grid: derive 4-5 scaled polygons (representing levels 2, 4, 6, 8, 10) and draw them as faint, unfilled shapes.
- [ ] Render the axes: draw `<line>` elements from the center to the outer edge for each skill.
- [ ] Render the primary data shape: draw a `<polygon>` using the `points` string derived in Phase 1, styled with a semi-transparent fill and bold stroke.
- [ ] Render the labels: place `<text>` elements at the outer edge of each axis displaying the skill `name`.
- [ ] Build the control panel: render a `<input type="range" min="1" max="10">` for each skill, bound to the `updateSkill` mutation.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and CSS styling (e.g., Tailwind accent colors for range inputs) based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
