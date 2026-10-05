# Phase 1: Backend Persistence & Duration Math

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to securely save user activities and mathematically determine how many hours an activity takes based on standard HTML time inputs.
- **The Solution:** Set up the database schema and secure Server Actions for CRUD operations. In the client, implement a robust duration calculator that can handle time parsing and midnight crossover.

## 2. Acceptance Criteria
- [ ] Implement Server Actions (`addAction` and `deleteAction`) that verify the user session using the core authentication service.
- [ ] Connect the Server Actions to the database repository to save and delete the time block records (Title, Start string, End string, Color hex).
- [ ] In the main view, ensure the initial data payload is fetched securely and passed to the client component.
- [ ] Write a `getDuration` helper function in the client component. It must split the `HH:MM` strings, convert them to decimal hours, and calculate the difference. If the end time is "less" than the start time (midnight crossover), it must add 24 to the result.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize standard Next.js App Router patterns (Server Components, Server Actions) and Prisma (or equivalent database ORM).
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
