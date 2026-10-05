# Phase 2: RPG Dashboard & Quests UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need a satisfying, game-like interface to interact with their habits. A simple HTML list won't trigger the desired dopamine response.
- **The Solution:** Build a dedicated Hero Status panel showcasing their level and a visual EXP bar. Below it, render the daily habits as "Quests" with prominent action buttons to earn EXP.

## 2. Acceptance Criteria
- [ ] Build a "Hero Status" header component that prominently displays the user's current `level` and a dynamic progress bar filling up based on their `exp` out of 100.
- [ ] Create an input field and submit button for adding new quests, wired to the backend mutation.
- [ ] Render the list of habits as "Daily Quests". Pending quests should have a prominent "+ EXP" call-to-action button. Completed quests should appear visually disabled/checked off.
- [ ] Wrap the interaction buttons in asynchronous transition hooks to disable them while the backend processes the EXP transaction, preventing duplicate submissions.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI patterns, asynchronous state hooks (e.g., `useTransition`), and dynamic CSS styling based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
