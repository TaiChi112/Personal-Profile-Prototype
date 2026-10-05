# Phase 2: Resilience & Generative UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** We need to visually prove that the system can handle external failures automatically, and that data inputs directly trigger downstream architectural paths.
- **The Solution:** Build the Omni Bridge using React Flow, triggering alternate node styles when an "Outage" toggle is hit. Build the Generative Sandbox, binding an input field's keystrokes to an edge's animation state.

## 2. Acceptance Criteria
- [ ] Build the `OmniBridge` component utilizing `<ReactFlow>`.
- [ ] Implement a toggle button for an "External Outage" state (boolean).
- [ ] In the React Flow node mapping, apply conditional styling: if the outage is true, fade/red-out the external API nodes and highlight the internal fallback nodes (e.g., green glowing borders).
- [ ] Build the `GenerativeSandbox` component utilizing `<ReactFlow>`.
- [ ] Render a text input field for a "Promo Code".
- [ ] Implement a `useEffect` hook listening to the input. On change, set a temporary `activeEdge` boolean to true, then clear it after 500ms using a timeout.
- [ ] In the React Flow edge mapping, conditionally apply `animated: true` and a thicker stroke style to specific graph edges whenever `activeEdge` is true.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@xyflow/react` for the interactive node canvases.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
