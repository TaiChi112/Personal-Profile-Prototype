# Phase 1: Authentication & Backend RPG Engine

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs a secure, persistent way to store user habits and calculate RPG stats (EXP, Level) without allowing users to cheat the system client-side.
- **The Solution:** Establish a server-side entry point protected by authentication. Build secure mutation functions that interact with the database to add habits and mark them complete, automatically calculating and updating the user's EXP.

## 2. Acceptance Criteria
- [ ] Implement an authentication guard at the root route, displaying a login prompt for unauthenticated users.
- [ ] Create secure server-side mutation endpoints (e.g., Server Actions or API routes) for `addHabit` and `completeHabit`.
- [ ] The `completeHabit` mutation must verify the user's session, update the habit's status to "done", and trigger an update to the user's global RPG stats (incrementing EXP).
- [ ] Server-side queries must be established to fetch the user's current stats and their list of habits on page load.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize the established authentication service and ORM/database client based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
