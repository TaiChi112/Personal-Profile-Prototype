# Epic: Agentic QA Flow (Micro-App)

## The Problem
Demonstrating "Agentic AI" to engineering managers is difficult using just chat interfaces. They need to see how an AI can actually understand software architecture, modify state machines, and predict the downstream QA impact (like new edge cases) when a user simply types a natural language feature request.

## Desired Outcome
An "Agentic QA Flow" micro-app designed as an interactive architectural playground. Users see a visual flowchart of a business process (e.g., Checkout Flow). They type a natural language intent (e.g., "Add a fraud check before payment"). The application securely communicates with an LLM, which autonomously restructures the flowchart and recalculates the enterprise QA metrics (coverage, edge cases) in real-time based on the complexity of the change.

## Core Capabilities
- **LLM-Driven Generative Graph Engine:** A backend architectural layer utilizing an AI SDK and strict schema enforcement (`z.object`). It accepts the current graph state and user intent, forcing the LLM to return precise JSON structural mutations (new nodes, edges, and edges to remove).
- **Dynamic Node Canvas UI:** A frontend presentation layer integrating a robust flowchart visualization library. It projects the state arrays visually and animating transitions smoothly as the AI injects new steps into the process.
- **Enterprise Metrics Telemetry:** A secondary client-side state engine that listens to the AI's impact analysis payload, updating an executive dashboard with extrapolated project management data (e.g., Sprint QA Score, Test Cases Added, Complexity Increase).

## Constraints & Environment
- The application MUST rely on a backend API route utilizing the AI SDK to securely communicate with the Gemini model, keeping API keys off the client.
- The LLM prompt must strictly instruct the model on graph theory (e.g., to insert a node between A and B, it must create the new edges AND explicitly return the ID of the old A->B edge so the client can delete it).

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., `@xyflow/react` for the canvas, `ai` SDK `generateObject` for structured LLM output) and file structure before writing any code.
