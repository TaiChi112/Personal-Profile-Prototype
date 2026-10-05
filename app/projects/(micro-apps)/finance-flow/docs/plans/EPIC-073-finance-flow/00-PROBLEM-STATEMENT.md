# Epic: FinanceFlow Tracker (Micro-App)

## The Problem
Tracking daily expenses using traditional spreadsheets is friction-heavy and lacks immediate visual feedback. Users need a centralized, secure application that not only logs transactions but automatically categorizes spending and calculates their true live balance.

## Desired Outcome
An authenticated "FinanceFlow" micro-app. Users can quickly log income and expenses. The application stores this data persistently and instantly updates a massive "Total Balance" billboard. Furthermore, the backend automatically groups expenses by label, providing a visual analytics breakdown of where the user is spending the most money.

## Core Capabilities
- **Full-Stack Finance Persistence:** A robust architecture utilizing session authentication and secure server actions. It performs CRUD operations on transaction entities within a centralized database, ensuring long-term financial data retention.
- **Client-Side Balance Aggregation:** A logic layer that processes the fetched array of transactions, mathematically reducing them into gross income and gross expense to derive the live total balance.
- **Server-Side Analytics Grouping:** A backend aggregation layer leveraging the database ORM to group and sum expenses by label, returning pre-calculated analytics data for the client to render as relative bar charts.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot view or manipulate financial data.
- The UI MUST handle network latency gracefully during database mutations, disabling inputs to prevent duplicate transactions.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions, database schema for Transactions, ORM groupBy queries) and file structure before writing any code.
