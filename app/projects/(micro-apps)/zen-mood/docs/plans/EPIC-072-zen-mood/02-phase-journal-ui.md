# Phase 2: Capture & History UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Traditional forms are too slow for daily habit tracking. The history log needs to be visually scannable so users can see their energy trends at a glance.
- **The Solution:** Build a large, tactile input card with visual icons and a slider. Build a history list below it that transforms raw numbers into visual bar charts.

## 2. Acceptance Criteria
- [ ] Build the top input card. Render an array of 5 visual indicators (e.g., standard text icons) representing emotional states. Apply scaling/highlight CSS classes to the actively selected mood.
- [ ] Render a `<input type="range" min="1" max="10">` bound to the local `energy` state. Display the current numeric value above it prominently.
- [ ] Render a large "Save Journal" button tied to the `handleSave` function.
- [ ] Below the input card, iterate over the `entries` array from the store.
- [ ] For each entry, render a small card displaying the `mood` and the `date` string.
- [ ] Inside the entry card, build a miniature bar chart: render a background div, and an inner div whose `width` is mathematically derived `((energy / 10) * 100)%` applied via inline CSS.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS styling based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
