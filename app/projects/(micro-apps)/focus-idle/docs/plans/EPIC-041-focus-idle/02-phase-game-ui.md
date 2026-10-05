# Phase 2: Dual-Pane Dashboard UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user needs to clearly see their immediate task (focusing) separated from their reward (the game), while still feeling that the two are connected.
- **The Solution:** Build a split-screen dashboard. The left pane is a massive, distraction-free timer. The right pane is the "Empire" view, showing current wealth and allowing the user to purchase upgrades.

## 2. Acceptance Criteria
- [ ] Build a "Timer" pane prominently displaying the formatted minutes and seconds, along with a massive START/PAUSE toggle button.
- [ ] Implement a `useEffect` interval within the UI component that safely triggers the state engine's `tick` function every second when running.
- [ ] Build an "Empire" pane that displays the current `coins` balance and the count of owned `buildings`.
- [ ] Include a "Buy" button in the Empire pane that is dynamically disabled if the user's `coins` balance is lower than the required cost.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React hooks and UI component patterns based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
