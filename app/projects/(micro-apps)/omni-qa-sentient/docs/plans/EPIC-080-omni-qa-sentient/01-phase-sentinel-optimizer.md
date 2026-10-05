# Phase 1: Heatmaps & Maintenance UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** We need a way to show users how live traffic affects the architecture they built, and how AI can autonomously clean up the mess later.
- **The Solution:** Build a React Flow instance that toggles "Live Traffic" on and off, mutating node colors. Build a static mock of a Pull Request interface demonstrating AI-generated code cleanup.

## 2. Acceptance Criteria
- [ ] Build the global layout with a distinct "Sentient" header and a `framer-motion` tab navigation system.
- [ ] Build the `LiveSentinel` component utilizing `<ReactFlow>`.
- [ ] Implement a "Toggle Live Traffic" button binding to an `isLive` boolean state.
- [ ] In the React Flow node mapping, conditionally inject CSS styles: if `isLive` is true, target specific node IDs (representing bottlenecks) and apply orange/red background colors and glowing box shadows.
- [ ] Build the `SelfOptimizer` component.
- [ ] Render a mock split-screen UI: one side showing "Old Architecture" and the other showing "AI Optimized Architecture".
- [ ] Include an "Approve Pull Request" button that transitions a local state to `approved`, rendering a success message and hiding the diff view.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@xyflow/react` for the interactive node canvases and standard React state for the UI toggles.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
