# Phase 1: Database & Server Actions

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The app needs to save tasks to a real database associated with a specific user, and retrieve them securely.
- **The Solution:** Define the database schema for a Todo item. Implement Server Actions that verify the user session, execute the database queries, and trigger path revalidation to update the client.

## 2. Acceptance Criteria
- [ ] Ensure a `Todo` database schema exists (containing `id`, `userId`, `text`, `completed` boolean, and timestamps).
- [ ] Implement an `addTodo` server action that accepts a text string, verifies the session, and inserts a new record.
- [ ] Implement a `toggleTodo` server action that accepts a record ID and a boolean, verifying ownership before updating the `completed` status.
- [ ] Implement a `deleteTodo` server action that accepts a record ID, verifying ownership before deletion.
- [ ] Ensure all mutation actions call `revalidatePath` to instruct the framework to refresh the client data.
- [ ] In the main server component (`page.tsx`), fetch the user's existing todos and pass them as a prop to the client component.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize standard Next.js App Router patterns (Server Components, Server Actions) and Prisma (or equivalent database ORM).
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
