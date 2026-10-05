# Phase 2: Grid Layout & Inline Editing

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The flat array must be rendered as a perfect table/grid, and users need to be able to type directly into the cells without opening popups.
- **The Solution:** Build a CSS Grid layout with 6 columns. Render the headers, then iterate through the times/rows, rendering a row header followed by 5 `<textarea>` cells mapped directly to the 1D state array.

## 2. Acceptance Criteria
- [ ] Build a container utilizing CSS Grid (`grid-cols-6`) and enforce a minimum width (`min-w-[700px]`) to ensure the grid doesn't crush on small screens. Wrap it in a horizontally scrolling parent.
- [ ] Render the top header row: one empty cell, followed by the 5 day labels.
- [ ] Iterate through the `times` array to build the rows. For each row, render the time label cell first.
- [ ] Following the time label, iterate 5 times (for the days). Calculate the 1D array index (`rowIdx * 5 + colIdx`).
- [ ] Render a `<textarea>` for each calculated index, binding its `value` and `onChange` to the state engine.
- [ ] Apply conditional CSS to the textarea: if the cell has text, change its background/border color to highlight it as "busy".

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering loops and Tailwind CSS Grid classes based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
