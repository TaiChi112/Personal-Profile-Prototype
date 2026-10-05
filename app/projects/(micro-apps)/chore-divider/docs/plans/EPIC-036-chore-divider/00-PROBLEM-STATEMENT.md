# Epic: Household Chore Divider (Micro-App)

## The Problem
Roommates and families frequently argue over household responsibilities. Manually assigning chores often leads to perceived unfairness, and tracking whose turn it is to take out the trash or wash the dishes via paper charts or group chats is inefficient and easily ignored.

## Desired Outcome
A frictionless, single-page "Chore Divider" micro-app that acts as an impartial adjudicator. It instantly randomizes and distributes tasks among a group of people with a single click, providing a clear, indisputable "Duty Roster" for the week.

## Core Capabilities
- **Entity State Management:** A client-side store that manages two primary lists: participants (People) and tasks (Chores).
- **Fairness Randomization Engine:** An algorithmic logic layer that shuffles the task list and evenly distributes them among the participants, handling mismatches in list lengths gracefully.
- **Roster Visualization UI:** A clean, easy-to-read dashboard that displays the current participant pool, the pending tasks, and visually maps out the final assignments post-randomization.

## Constraints & Environment
- The application MUST operate entirely on the client-side. Randomization logic and state must execute in the browser to ensure zero latency.
- No user authentication or persistent database is required; the tool is meant for quick, ephemeral adjudications during weekly house meetings.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight client-side state management, efficient shuffling algorithms like Fisher-Yates) and file structure before writing any code.
