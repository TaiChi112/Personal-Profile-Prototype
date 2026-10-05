# Phase 1: Structured AI Backend

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** LLMs naturally output unstructured markdown. We need the AI to act as a graph engine, returning strict programmatic instructions to alter an array of nodes and edges without breaking the client application.
- **The Solution:** Build a Next.js API route utilizing `generateObject` from the AI SDK. Define a rigid Zod schema that forces the LLM to return arrays of specific node/edge mutations and an impact analysis object.

## 2. Acceptance Criteria
- [ ] Create an API route (`/api/agentic-testing/intent/route.ts`).
- [ ] Implement a POST handler that accepts `prompt`, `currentNodes`, and `currentEdges` from the client.
- [ ] Utilize `generateObject` with a specific LLM model (e.g., `gemini-2.5-flash`).
- [ ] Define the Zod schema:
  - `nodesToAdd`: Array of `{ id, label }`.
  - `edgesToAdd`: Array of `{ id, source, target }`.
  - `edgesToRemove`: Array of string IDs.
  - `impact`: Object containing `testCasesAdded`, `complexityIncrease`, and a `logMessage`.
- [ ] Write a highly specific system prompt injecting the current state and explicitly teaching the LLM how to insert a node between two existing nodes by deleting the original edge.
- [ ] Return the structured JSON object to the client.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `@ai-sdk/google`, `ai` (`generateObject`), and `zod`.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
