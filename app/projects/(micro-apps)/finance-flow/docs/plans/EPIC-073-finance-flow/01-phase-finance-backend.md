# Phase 1: Database & Aggregation Logic

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Financial data must be securely saved, and the app needs a way to summarize spending patterns without sending massive amounts of raw data to the client.
- **The Solution:** Establish the database schema. Write Server Actions for adding/deleting transactions, and write a specific data-fetching function that leverages the database engine to group and sum expenses.

## 2. Acceptance Criteria
- [ ] Define a `FinanceTransaction` database schema (containing `id`, `userId`, `amount` float, `label` string, and `type` string).
- [ ] Implement Server Actions (`addTransaction`, `deleteTransaction`) that verify the user session and manipulate the database, followed by path revalidation.
- [ ] Implement a `getTransactions` data-fetching function that securely retrieves the user's transaction history, ordered by creation date.
- [ ] Implement a `getExpenseSummary` data-fetching function. It must query the database to filter by `expense`, group the results by `label`, and sum the `amount` for each group, returning an analytics array.
- [ ] In the main server component (`page.tsx`), execute both fetch functions and pass the resulting arrays to the client component.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Utilize standard Next.js App Router patterns (Server Components, Server Actions) and Prisma (specifically `prisma.groupBy` for analytics).
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
