# Phase 1: State & Interval Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to track configuration settings, count down every second reliably, and know exactly what to do when the clock hits zero based on what phase it is currently in.
- **The Solution:** Build a centralized client-side store containing the FSM. Within the main component, utilize `useEffect` hooks and `setInterval` to drive the countdown, coupled with logic to intercept `< 0` and transition the state.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking configurations (`workTime`, `restTime`, `totalRounds`), and live state (`status`: idle/work/rest, `timeLeft`, `currentRound`).
- [ ] Implement mutation functions to update these values cleanly.
- [ ] In the main component, create a clock-tick effect using `setInterval` that fires every 1000ms if `status !== 'idle'`, decrementing `timeLeft`. Ensure `clearInterval` is called on unmount or status change.
- [ ] Create a boundary-interception effect that monitors `timeLeft`. When `timeLeft < 0`:
  - If `status === 'work'`: Transition to `rest` (resetting clock to `restTime`), UNLESS `currentRound >= totalRounds`, in which case transition to `idle`.
  - If `status === 'rest'`: Transition to `work` (resetting clock to `workTime`) and increment `currentRound`.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Use `useRef` to store the interval ID for safe cleanup.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
