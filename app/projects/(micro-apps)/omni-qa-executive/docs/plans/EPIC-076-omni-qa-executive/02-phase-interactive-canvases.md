# Phase 2: Time Machine & War Room

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs to physically interact with the architecture to understand how proposed changes affect the system (Time Machine) and how the team communicates about them (War Room).
- **The Solution:** Build two distinct React Flow instances. The Time Machine will simulate an AI predicting bottlenecks when a node is added. The War Room will render custom nodes containing simulated human/AI chat threads.

## 2. Acceptance Criteria
- [ ] Build the `TimeMachine` component utilizing `<ReactFlow>`.
- [ ] Implement a "Forecast Impact" button. When clicked, trigger a simulated loading state (e.g., 2000ms timeout).
- [ ] After the timeout, mutate the nodes array to add a "Ghost Node" (representing a new feature) and mutate the edges array to add warning edges (e.g., dashed red lines) representing predicted architectural bottlenecks.
- [ ] Build the `WarRoom` component utilizing `<ReactFlow>`.
- [ ] Define custom node data that includes complex HTML (a simulated chat interface).
- [ ] Render a node where a Product Manager leaves a comment on the flowchart, and an AI agent "replies" directly within the node's UI, simulating multiplayer architectural planning.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@xyflow/react` for the interactive node canvases.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
