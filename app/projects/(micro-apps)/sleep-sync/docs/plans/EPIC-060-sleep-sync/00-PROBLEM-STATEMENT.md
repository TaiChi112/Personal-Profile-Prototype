# Epic: Sleep Sync Calculator (Micro-App)

## The Problem
Waking up in the middle of a deep sleep cycle leaves people feeling groggy and exhausted, regardless of how many total hours they slept. Calculating 90-minute sleep cycles backwards from a desired wake-up time, while accounting for the time it takes to actually fall asleep, is tedious mental math.

## Desired Outcome
A "Sleep Sync" micro-app that optimizes sleep schedules instantly. The user inputs their desired wake-up time, and the app calculates backwards using standard 90-minute REM cycles (plus a 15-minute sleep latency buffer). It presents a clear list of optimal bedtimes to ensure the user wakes up feeling refreshed between cycles.

## Core Capabilities
- **Temporal State Engine:** A lightweight client-side data store holding the target wake-up time string, paired with a mutation function to update it dynamically.
- **Cycle Derivation Logic:** A mathematical rendering layer that converts the target time to a Date object, applies a sleep latency offset (-15 mins), and sequentially derives a list of bedtimes by subtracting 90-minute chunks (representing 3, 4, 5, and 6 sleep cycles).
- **Recommended Options UI:** A specialized presentation component featuring a massive time input field and a visually tiered list of results, highly emphasizing the optimal (6-cycle) result as the primary recommendation.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure instant, lag-free calculations as the user adjusts the target time.
- The mathematical derivation MUST utilize native JS `Date` objects and millisecond calculations to safely cross midnight boundaries without complex external moment libraries.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, native Date math patterns) and file structure before writing any code.
