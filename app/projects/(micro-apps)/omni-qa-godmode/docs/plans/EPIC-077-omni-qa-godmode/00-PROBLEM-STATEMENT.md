# Epic: OmniQA God Mode (Micro-App)

## The Problem
Enterprise software architecture eventually becomes undocumented legacy code, making it terrifying to modify. Compliance audits require manual mapping of data flows, and implementing new features requires translating PM flowcharts into backend code. Senior architects need a unified tool that can automatically map legacy systems, audit them for compliance, and generate code from architectural diagrams.

## Desired Outcome
An "OmniQA God Mode" micro-app (Phase 3). This represents the pinnacle of agentic testing, featuring three modules:
1. **Compliance Auditor:** Automatically scans flowcharts to flag security or compliance risks (e.g., GDPR violations) in specific architectural nodes.
2. **Reverse Engineer:** Points an AI at a "legacy" system and visually rebuilds the flowchart in real-time as the AI discovers undocumented routes.
3. **Autonomous Coder:** A bidirectional engine where users visually add a feature node to the flowchart, and the AI instantly generates the underlying TypeScript code to implement it.

## Core Capabilities
- **Multi-Context Presentation Shell:** A client-side routing wrapper utilizing framer-motion to transition seamlessly between the three highly complex sub-applications, maintaining a distinct "God Mode" visual aesthetic (high contrast, amber accents).
- **Asynchronous Graph Injection Engine:** A simulation logic layer utilizing React Flow and staggered timeout intervals to progressively build and mutate node arrays, mimicking the real-time processing latency of an AI scanning a legacy codebase or performing a deep compliance audit.
- **Generative Code Rendering UI:** A presentation component that bridges visual architecture and literal code. It tracks structural modifications to the node graph and renders simulated programmatic syntax (e.g., server actions) corresponding to the new nodes injected by the user.

## Constraints & Environment
- The application MUST operate entirely on the client-side for demonstration purposes, relying on timeouts and mocked code strings to simulate the profound latency of true generative AI compilation.
- The React Flow canvases MUST handle dynamic styling conditionally based on the "Auditing" state, flashing warning colors onto specific nodes when a simulated compliance violation is found.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., `@xyflow/react` for visual state machines, staggered rendering loops) and file structure before writing any code.
