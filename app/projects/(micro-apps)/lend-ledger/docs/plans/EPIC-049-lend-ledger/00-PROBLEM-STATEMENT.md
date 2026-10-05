# Epic: Lend Ledger (Micro-App)

## The Problem
People frequently lend books, tools, video games, or small amounts of cash to friends and acquaintances, only to completely forget about it weeks later. Generic note apps lack structure for tracking these specific transactions, resulting in lost property and awkward conversations.

## Desired Outcome
A "Lend Ledger" micro-app that acts as a secure, persistent inventory for lent items. Users can quickly input "Who" and "What," and the app automatically tracks the date. Users can easily mark items as returned or delete the record entirely, ensuring they always know exactly who has their belongings.

## Core Capabilities
- **Persistent Asset Tracker:** A secure backend integration that links a user's authenticated session to a database repository, permanently storing their ledger of lent items.
- **Transactional Ledger Logic:** Backend mutation endpoints that handle the Create, Update (Toggle Return status), and Delete operations for ledger records, prioritizing data integrity.
- **Interactive Ledger UI:** A frontend interface featuring a streamlined input form and an actionable list view. It leverages asynchronous transition states to disable controls while server mutations process, preventing duplicate entries.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot view or manipulate ledger data.
- The UI MUST handle server-side action delays gracefully (e.g., using `useTransition` to disable buttons during the network request) rather than implementing complex optimistic state rollbacks.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions, database schema for asset tracking, React concurrent features like `useTransition` for loading states) and file structure before writing any code.
