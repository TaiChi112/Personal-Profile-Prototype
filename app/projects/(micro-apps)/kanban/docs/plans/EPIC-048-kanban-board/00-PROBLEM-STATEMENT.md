# Epic: Kanban Task Board (Micro-App)

## The Problem
Standard text-based to-do lists fail to communicate the lifecycle of a task. When managing projects, users need to see what is pending, what is actively being worked on, and what is completed, all at a glance. Furthermore, task tracking tools often feel sluggish because they require full page reloads to update the status of an item.

## Desired Outcome
A robust "Kanban Board" micro-app that visualizes workflows across three distinct stages (To Do, In Progress, Done). It securely saves tasks to the user's centralized profile while utilizing Optimistic UI updates on the frontend, ensuring that moving a card between columns feels instantaneous and frictionless.

## Core Capabilities
- **Persistent Workflow State Engine:** Secure backend endpoints utilizing the core authentication service to query and mutate the user's task entities within the centralized database via a repository pattern.
- **Optimistic Client-Side Board UI:** A frontend layout that maintains local state, applying immediate UI changes when a user interacts with a task (adding, moving, deleting) before the asynchronous backend transaction concludes.
- **Categorized Card Rendering:** A dynamic layout component that filters the global task array by status and renders context-aware action controls (e.g., hiding the "Promote" button if the task is already "Done").

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot view or manipulate the board.
- The UI MUST prioritize perceived performance through Optimistic UI patterns, minimizing loading spinners during routine actions like moving a card.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server-side mutation patterns, React local state synchronization, column-based CSS grids) and file structure before writing any code.
