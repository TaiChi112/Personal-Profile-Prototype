# Phase 1: State & Derivation Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to accept a standard HTML time string (HH:MM), convert it into a manipulatable format, subtract fixed intervals crossing the midnight boundary safely, and format it back to a readable string.
- **The Solution:** Establish a simple client-side store for the input string. In the main view, write a derivation function that utilizes native JS `Date` objects and millisecond offsets to calculate the array of optimal bedtimes.

## 2. Acceptance Criteria
- [ ] Establish a state management module tracking `wakeTime` (string, e.g., '07:00').
- [ ] Implement a `setWakeTime` mutation function.
- [ ] In the main component, create a `calculateTimes` derivation function that parses `wakeTime` into a temporary `Date` object based on the current day.
- [ ] The derivation function must map over an array of cycles `[6, 5, 4, 3]`. For each cycle, it must subtract the total cycle time (N * 90 mins) PLUS a 15-minute sleep latency buffer from the target `Date`.
- [ ] The derived results must be formatted back into a readable, localized time string (e.g., '10:45 PM') and include the total hours of sleep.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research. Strictly use native JS `Date` for millisecond math.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
