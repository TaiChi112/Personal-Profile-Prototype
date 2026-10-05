# Phase 1: Shell & Executive Dashboard

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs a global navigation shell to switch between completely different tools, and the executives need to see the high-level metrics first.
- **The Solution:** Build the global layout with a top navigation bar. Implement `framer-motion` for smooth tab switching. Build the `CommandCenter` tab using a charting library to visualize mocked ROI data.

## 2. Acceptance Criteria
- [ ] Build the main page wrapper with dark-mode/glassmorphic styling and a fixed top `<header>`.
- [ ] Implement local state `activeTab` ('time_machine' | 'war_room' | 'executive').
- [ ] Build a navigation pill component utilizing `framer-motion` `layoutId` for a sliding active indicator.
- [ ] Utilize `<AnimatePresence mode="wait">` in the main body to conditionally render the active component based on the tab state.
- [ ] Build the `CommandCenter` component.
- [ ] Within `CommandCenter`, define an array of historical mock data (e.g., Sprint 1-6, Velocity, Escaped Defects).
- [ ] Render a `<ResponsiveContainer>` containing an `<AreaChart>` bound to the historical data to visually demonstrate QA ROI.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize `framer-motion` for transitions and `recharts` for the dashboard charts.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
