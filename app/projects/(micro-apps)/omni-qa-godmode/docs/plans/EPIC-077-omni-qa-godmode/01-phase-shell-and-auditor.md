# Phase 1: Shell & Compliance Auditor

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs its global shell, and we need a way to visually demonstrate how an AI flags specific architectural components for security risks.
- **The Solution:** Build the global layout with a distinct "God Mode" header. Build the Compliance Auditor module using React Flow, implementing a function that sweeps the graph and mutates node styles to indicate compliance failures.

## 2. Acceptance Criteria
- [ ] Build the main page wrapper with extreme dark-mode styling and an amber-accented `<header>`.
- [ ] Implement local state `activeTab` ('auditor' | 'reverse' | 'coder').
- [ ] Build a navigation button component utilizing `framer-motion` for a sliding active indicator.
- [ ] Build the `ComplianceAuditor` component utilizing `<ReactFlow>`.
- [ ] Render a base graph representing a data flow. Add a "Run Compliance Audit" button.
- [ ] When clicked, trigger a simulated loading state (e.g., 2500ms). Upon completion, mutate the `nodes` array: specifically target certain nodes and override their `style` objects with warning colors (e.g., red borders, warning icons) to simulate a detected vulnerability.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `framer-motion` for transitions and `@xyflow/react` for the graphs.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
