# Phase 1: Staged Simulation & Architecture

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** We need to simulate a highly complex AI process (understanding language, changing code, running tests) without actually having an AI backend.
- **The Solution:** Build a finite state machine using string states (`idle`, `thinking`, `updating`) and use cascading `setTimeout` blocks to step through the states. Update a React Flow canvas mid-sequence to prove structural mutation.

## 2. Acceptance Criteria
- [ ] Establish local state tracking `storyStage` ('idle' | 'thinking' | 'updating_canvas' | 'running_agent' | 'complete').
- [ ] Render a base `<ReactFlow>` canvas with a simple 3-step checkout process.
- [ ] Render a large input bar at the bottom of the screen.
- [ ] Implement `handleSubmit`:
  - Change state to `thinking`.
  - After 1.5s, change to `updating_canvas`. Mutate the React Flow `nodes` and `edges` arrays to inject a new node (e.g., "Apple Pay") between existing steps.
  - After another 2s, change to `running_agent`. Start rapidly incrementing a local `testCases` counter.
  - After 3s, change to `complete`.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@xyflow/react` for the interactive node canvases and standard React `useEffect`/`setTimeout` hooks for the simulation logic.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
