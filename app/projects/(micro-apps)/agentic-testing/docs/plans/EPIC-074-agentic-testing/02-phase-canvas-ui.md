# Phase 2: Flowchart Canvas & Metrics

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs to see the graph mutate in real-time based on their text input, and the executive metrics need to reflect the AI's decisions.
- **The Solution:** Build a split layout. The left sidebar contains the executive QA metrics. The main pane houses the React Flow canvas and a bottom chat input bar.

## 2. Acceptance Criteria
- [ ] Initialize the client component with base `nodes` and `edges` representing a simple 3-step flow (e.g., Start -> Process -> End).
- [ ] Initialize local state for `metrics` (QA Score, Coverage, Edge Cases).
- [ ] Render the main canvas using a node-graph library (e.g., `<ReactFlow>`), binding it to the local node/edge state arrays.
- [ ] Build a bottom input bar. When submitted, hit the backend API route with the current graph state and user input.
- [ ] In the API response handler, meticulously mutate the client arrays:
  - Add the new nodes to the `nodes` array (calculating their geometric X/Y position dynamically based on surrounding nodes if possible).
  - Filter out any edges present in the `edgesToRemove` array.
  - Add the new edges to the `edges` array.
- [ ] Update the `metrics` sidebar based on the AI's `impact` payload (e.g., increment `edgeCasesFound` by `testCasesAdded`).
- [ ] Render the updated metrics visually in the left sidebar (e.g., utilizing a CSS progress bar for the QA Score).

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side rendering tools (e.g., `@xyflow/react` for the canvas) based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
