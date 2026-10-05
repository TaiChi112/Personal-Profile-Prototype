# Phase 2: Reverse Engineering & Autonomous Code

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** We need to simulate the AI dynamically discovering a system step-by-step, and subsequently generating code when the user alters the graph.
- **The Solution:** Build a staggered rendering loop for the Reverse Engineer to make nodes appear sequentially. Build the Autonomous Coder to split the screen, showing the graph on one side and generated syntax on the other.

## 2. Acceptance Criteria
- [ ] Build the `ReverseEngineer` component utilizing `<ReactFlow>`.
- [ ] Define an array of "discovery steps" (each containing a node, an edge, and a delay time).
- [ ] Implement a "Start Scan" button. When clicked, iterate through the steps array using a sequence of `setTimeout` calls, progressively appending new nodes and edges to the React Flow instance to create an animated "discovery" effect.
- [ ] Build the `AutonomousCoder` component. Divide its view into a React Flow pane and a code block pane.
- [ ] Implement an "Inject Feature" button. When clicked, mutate the graph to add a new functional node (e.g., "Apply Promo Code").
- [ ] Simultaneously, update a local string state `code` with a simulated TypeScript function block that corresponds to the newly injected node, rendering it in the code block pane.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@xyflow/react` for the interactive node canvases.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
