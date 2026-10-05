# Phase 1: Authentication & Ledger Mutations

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The ledger must securely store data so users don't lose track of their lent items if they switch devices.
- **The Solution:** Establish a server-side entry point that verifies the user. Build secure backend mutation functions to add records, toggle their return status, and delete them from the database.

## 2. Acceptance Criteria
- [ ] Implement an authentication guard at the root route. Display a login prompt for unauthenticated users.
- [ ] Create secure server-side mutation endpoints for `addRecord`, `toggleReturn`, and `deleteRecord`.
- [ ] The server mutations must verify the user's session before interacting with the database repository.
- [ ] Fetch the user's ledger records server-side on page load and pass them to the client component.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize the established authentication service and ORM/database repository patterns based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
