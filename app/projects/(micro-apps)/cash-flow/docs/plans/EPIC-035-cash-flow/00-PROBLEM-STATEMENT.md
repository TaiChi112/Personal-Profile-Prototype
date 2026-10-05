# Epic: CashFlow Stream Visualizer (Micro-App)

## The Problem
Standard budgeting apps rely on complex spreadsheets or tedious transaction logging. Users often want a quick, high-level "sanity check" to visualize exactly how their monthly income is distributed across major expense categories without the cognitive overload of traditional accounting software.

## Desired Outcome
A frictionless, single-page "CashFlow Stream" micro-app that allows users to input their total income and dynamically assign it to various expense buckets. It provides instant visual feedback—using proportional progress bars and color-coding—to reveal exactly what percentage of their income is consumed by each category, highlighting any unallocated funds or deficits.

## Core Capabilities
- **Allocation State Engine:** A client-side data store that tracks a primary value (total income) and an array of subordinate values (expense categories) in real-time.
- **Proportional Visualization UI:** A rendering system that computes the percentage of the primary value consumed by each category, displaying this visually via dynamic progress-bar-style backgrounds.
- **Real-time Balance Calculator:** An instantaneous aggregator that calculates the total expenses against the income, displaying the unallocated remainder or warning the user of a deficit via conditional UI states.

## Constraints & Environment
- The application MUST be entirely stateless and operate strictly on the client-side. Financial data must be ephemeral to guarantee user privacy without requiring authentication or database schemas.
- The UI must react instantly to user numerical inputs without requiring "calculate" or "submit" buttons.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, dynamic CSS utility rendering for proportional bars) and file structure before writing any code.
