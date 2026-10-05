# Phase 2: Visualization UI & Controls

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The raw array of numbers needs to be translated into a visual format where users can instantly recognize sorting progress.
- **The Solution:** Build a DOM-based bar chart using CSS flexbox, where each number in the array dictates the height of a vertical bar. Provide controls to trigger the sorting and generation actions.

## 2. Acceptance Criteria
- [ ] Build a top control bar containing two buttons: "Generate New Array" and "Bubble Sort".
- [ ] Both buttons must be disabled when the store's `isSorting` state is true to prevent concurrent algorithmic loops.
- [ ] Build the visualizer container using flexbox (`flex items-end`). Ensure it has a fixed height (e.g., `h-64`) so the bars scale cleanly.
- [ ] Map over the store's `array`. For each integer, render a `div` styled as a vertical bar (e.g., fixed width, background color).
- [ ] Bind the array integer to the bar's inline CSS `height` property (e.g., `style={{ height: '${val}%' }}`).
- [ ] Apply a subtle CSS `transition-all` to the bars to smooth out the rendering between algorithmic steps.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic inline CSS bindings based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
