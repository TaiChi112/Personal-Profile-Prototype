# Epic: Authenticated Todo List (Micro-App)

## The Problem
Many todo list tutorials build entirely client-side apps that lose data on refresh. Users need a persistent, reliable task manager where their data is securely saved to a database and accessible across sessions, without the UI feeling sluggish during network requests.

## Desired Outcome
A classic, full-stack "Todo List" micro-app. Authenticated users can create, toggle, and delete tasks. The app leverages modern React transitions to maintain a snappy user experience, disabling inputs during network requests and relying on server actions to persist data and revalidate the UI automatically.

## Core Capabilities
- **Persistent User Data Lifecycle:** A robust backend integration relying on user authentication. It utilizes secure server actions to perform CRUD (Create, Read, Update, Delete) operations on task entities stored in a centralized database.
- **Transition State Architecture:** A client-side layer that abandons complex local state duplication in favor of React's `useTransition` hook. It triggers server actions directly and uses the resulting `isPending` state to disable controls and show loading overlays until the server revalidates the route.
- **Classic List UI:** A familiar presentation layout featuring a primary input bar for rapid task entry (with keyboard support) and a vertical list of task cards with tactile checkboxes and delete controls.

## Constraints & Environment
- The application MUST rely on a backend database and user authentication.
- The UI MUST gracefully handle network latency by utilizing `useTransition` to prevent users from double-submitting forms or clicking buttons while a mutation is in flight.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions, database schema for Tasks, React `useTransition` patterns) and file structure before writing any code.
