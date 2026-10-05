# Epic: ZenMood Journal (Micro-App)

## The Problem
Mental health and wellness tracking often requires filling out long, tedious journal forms that people abandon after a few days. Users need a frictionless, ultra-fast way to log both their emotional state and their physical energy levels simultaneously to track long-term wellness patterns.

## Desired Outcome
A "ZenMood" micro-app designed for daily check-ins taking less than 5 seconds. Users tap a single icon representing their mood and drag a slider to rate their energy (1-10). The app immediately saves this to a historical log, rendering the past entries as clean cards that visualize energy levels as miniature bar charts.

## Core Capabilities
- **Affective Data Engine:** A client-side state store that manages an array of journal objects (containing a date string, an emotional state indicator, and a numeric energy value). It includes a mutation function to securely prepend new entries to the history.
- **Dual-Input Capture UI:** A streamlined data entry presentation layer that replaces traditional text fields with discrete visual buttons (for mood selection) and a continuous HTML range slider (for energy selection), optimizing for touch interaction.
- **Quantitative History Visualizer:** A layout component that maps over the saved array, rendering each entry as a card. It mathematically converts the stored 1-10 energy integer into a percentage to draw an inline CSS bar chart for quick visual scanning of historical trends.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure immediate saving without network latency.
- The date string generation must securely split standard ISO strings (e.g., extracting just the `YYYY-MM-DD` portion) to ensure clean rendering in the history list.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, inline CSS percentage mapping) and file structure before writing any code.
