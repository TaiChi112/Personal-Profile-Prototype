# Phase 2: Matrix Projection UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Displaying 365 items in a single vertical or horizontal list is unreadable. They must be mapped into the standard 7-row (Sunday-Saturday) by 52-column format.
- **The Solution:** Build a layout component that mathematically maps the 1D state array into a 2D DOM structure. Render interactive cells that change color based on their state level.

## 2. Acceptance Criteria
- [ ] Build a container component that forces horizontal overflow scrolling if the screen is too narrow to display 52 columns.
- [ ] Implement a mapping algorithm in the render function to generate 7 rows. Within each row, iterate through the columns, calculating the correct 1D array index (`col * 7 + row`).
- [ ] Render a discrete cell (`div`) for each valid index. The cell must display its `date` string natively via a tooltip (`title` attribute).
- [ ] Bind a click event to each cell that fires the state store's `toggleDay` function.
- [ ] Implement a dynamic styling function (`getColor`) that maps the `level` integer (0-3) to a corresponding CSS class (e.g., varying intensities of green).
- [ ] Render a legend below the heatmap indicating "Less" to "More" activity based on the color scale.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate dynamic CSS styling patterns based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
