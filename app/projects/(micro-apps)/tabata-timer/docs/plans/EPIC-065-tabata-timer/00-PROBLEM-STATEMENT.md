# Epic: Tabata HIIT Timer (Micro-App)

## The Problem
High-Intensity Interval Training (HIIT) requires strict adherence to alternating periods of intense work and brief rest (e.g., 40 seconds on, 20 seconds off). Using a standard phone stopwatch is impossible during a workout because it requires constant manual resetting and monitoring, breaking the user's physical flow.

## Desired Outcome
A "Tabata Timer" micro-app that acts as an automated workout orchestrator. Users configure their Work time, Rest time, and total Rounds. Once started, the app handles the countdowns automatically, transitioning between states. It uses massive typography and full-screen background color changes to signal phase shifts peripherally, so users don't even have to look directly at their screen.

## Core Capabilities
- **Finite State Machine (FSM):** A client-side store maintaining the configuration variables alongside the active session state (`idle`, `work`, `rest`), `timeLeft`, and `currentRound`.
- **Interval-Based Orchestrator:** A logic layer utilizing native JavaScript `setInterval` within component lifecycles to tick the clock down, intercept zero-boundaries, and transition the FSM to the next phase automatically.
- **State-Bound Theming UI:** A presentation layout featuring a massive numeric display, where the parent container's CSS background color is bound directly to the FSM state (e.g., red for Work, green for Rest), providing immediate peripheral feedback.

## Constraints & Environment
- The application MUST operate entirely on the client-side to manage high-frequency interval ticks.
- The React component lifecycle MUST handle memory cleanup (`clearInterval`) rigorously to prevent duplicate clocks from overlapping and accelerating the countdown artificially.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, safe `setInterval` cleanup patterns in React) and file structure before writing any code.
