# Epic: Trip Planner (Micro-App)

## The Problem
Travelers often lose track of upcoming trips, budgets, and dates scattered across various emails and notes apps. They need a centralized, persistent dashboard to track their itineraries and financial allocations for travel in one clean interface.

## Desired Outcome
An authenticated "Trip Planner" micro-app. Users can log in and manage a persistent list of upcoming trips, inputting the destination, date range, and allocated budget. The application provides a clear, two-pane interface separating data entry from the read-only summary list, securely storing all data across sessions.

## Core Capabilities
- **Secure Data Lifecycle:** A robust backend integration that intercepts unauthenticated users at the page level. It utilizes secure Server Actions to perform CRUD operations on trip entities within a centralized database, ensuring data persistence.
- **Asynchronous Form UI:** A presentation layer that natively binds HTML `<form>` elements to Server Actions. It utilizes React's `useTransition` to track the pending state of network requests, gracefully disabling inputs to prevent duplicate submissions.
- **Split-Pane Collection UI:** A responsive layout featuring a structured data-entry form on the left, and a scrollable, read-only list of summarized itinerary cards on the right.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users must be intercepted with a clear message and unable to access the data entry forms.
- The UI MUST gracefully handle network latency during database mutations (Add/Delete) using transition states.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions, database schema for Trips, React form actions) and file structure before writing any code.
