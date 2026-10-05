# Phase 2: Input Lists & SVG Projection

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The data needs to be editable, and the asset allocation needs to be visualized without importing a heavy charting library.
- **The Solution:** Build a split layout. Render the data arrays as lists of numeric inputs. Build a custom SVG donut chart by manipulating the `strokeDasharray` property of multiple overlapping `<circle>` elements.

## 2. Acceptance Criteria
- [ ] Build a responsive grid container (`grid-cols-1 md:grid-cols-2`).
- [ ] In the right pane, render the `assets` and `liabilities` arrays as lists. Each item should display its name and a `<input type="number">` bound to the `updateItem` mutation.
- [ ] In the left pane, build the SVG Donut chart container.
- [ ] Define a base `<svg viewBox="0 0 42 42">` containing a background `<circle>` with `cx="21" cy="21"` and a specific radius `r="15.91549430918954"` (which makes the circumference exactly 100).
- [ ] Map over the `assets` array. For each asset, calculate its percentage of `totalAssets`. Create a new `<circle>` overlay where `strokeDasharray` represents the percentage and `strokeDashoffset` shifts the start point based on a cumulative tracking variable.
- [ ] Overlay an HTML `div` perfectly centered inside the SVG donut to display the derived `netWorth` variable in large typography.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering loops and native SVG properties based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
