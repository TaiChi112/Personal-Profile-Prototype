# Epic: Focus Idle Game (Micro-App)

## The Problem
Standard productivity timers are often too clinical and fail to provide the dopamine hit necessary to keep easily distracted individuals (e.g., students, gamers, people with ADHD) engaged in deep work. Without immediate, tangible micro-rewards, users quickly abandon their focus sessions.

## Desired Outcome
A "Focus Idle" micro-app that ingeniously disguises a Pomodoro timer as an incremental idle game. By completing focused work sessions, users earn virtual currency which they can immediately spend to upgrade their virtual "empire." This creates a powerful, gamified feedback loop that turns procrastination into productivity.

## Core Capabilities
- **Time-to-Reward Engine:** A state manager that handles a strict countdown timer and autonomously triggers a payload (awarding virtual currency) the exact moment a session is successfully completed.
- **Idle Economy Logic:** A structured progression system that manages the user's wallet and inventory, validating and executing transactions when the user purchases virtual assets (e.g., buildings) with their earned currency.
- **Gamified Dashboard UI:** A dual-pane interface contrasting the active, minimalist timer on one side with an engaging, asset-rich "Empire" inventory and storefront on the other.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure immediate UI responsiveness.
- The timer logic must be robust enough to handle the transition from "counting down" to "rewarding" cleanly, preventing rapid-fire glitches or double-payouts.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight state management, `setInterval` lifecycle handling within React) and file structure before writing any code.
