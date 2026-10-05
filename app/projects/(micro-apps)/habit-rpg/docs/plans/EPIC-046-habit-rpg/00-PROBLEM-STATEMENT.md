# Epic: Habit RPG (Micro-App)

## The Problem
Traditional to-do lists and habit trackers are clinically boring. Users often suffer from fatigue and lose motivation to maintain daily routines (like drinking water or reading) because checking a box provides no tangible sense of progression or reward.

## Desired Outcome
A gamified "Habit RPG" micro-app that transforms daily chores into "Quests." By checking off habits, users award Experience Points (EXP) to their virtual "Hero." This creates an addictive progression loop where building healthy real-life habits translates to leveling up a digital avatar.

## Core Capabilities
- **Persistent Gamification State:** A secure backend integration layer utilizing the core authentication service to persist the user's RPG stats (Level, EXP) and their custom list of daily habits in a centralized database.
- **Transactional Reward Logic:** Secure backend mutation endpoints that validate quest completions. When a habit is marked done, the logic must mathematically award EXP and handle level-up thresholds, ensuring data integrity.
- **RPG Dashboard UI:** A visually engaging frontend that features a Hero avatar, a dynamic EXP progress bar, and an actionable list of pending quests, providing immediate, satisfying feedback upon completion.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot save RPG progress and must be redirected to a login prompt.
- Because completing a habit requires a database transaction to update EXP, the frontend MUST utilize asynchronous transitions (or optimistic UI updates) to prevent the interface from freezing while awaiting the server response.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server-side mutation patterns, database schema for RPG stats, transition hooks for smooth UI) and file structure before writing any code.
