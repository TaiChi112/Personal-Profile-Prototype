# Phase 2: ROI Dashboards & HR Sync

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Generating test cases is a technical achievement, but executives need to see how that translates to business value (dollars saved, integration with HR).
- **The Solution:** Build a sidebar that tracks live ROI metrics as the simulation runs. Build a secondary "HR" tab to demonstrate cross-domain ecosystem integration.

## 2. Acceptance Criteria
- [ ] Build a top navigation bar utilizing `framer-motion` to switch between 'canvas' and 'hr' tabs.
- [ ] In the 'canvas' view, build a right-hand metrics sidebar.
- [ ] As the `testCases` counter increments during the `running_agent` phase, mathematically derive and update business metrics in the sidebar (e.g., Hours Saved = TestCases * 0.5; Budget Saved = Hours Saved * $50).
- [ ] Build the 'hr' tab component. Display static mock charts (or visual UI elements) showing "AI Workforce Efficiency".
- [ ] Implement a complex `<SyncButton>` inside the HR tab. It must maintain its own internal state (`idle`, `syncing`, `done`), using timeouts to simulate a 2-second data push to a payroll system, changing colors (e.g., blue to green) upon success.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `framer-motion` for tab transitions and layout animations.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
