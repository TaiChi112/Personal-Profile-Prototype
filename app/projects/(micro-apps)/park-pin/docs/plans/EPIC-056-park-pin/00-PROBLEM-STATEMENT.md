# Epic: ParkPin Location Tracker (Micro-App)

## The Problem
Drivers frequently park in massive, multi-level structures (malls, airports) and forget their exact spot. Taking a photo is common, but it clutters the camera roll and can be hard to read in bright sunlight. Standard notes apps require too many taps to create a new, legible entry just for a parking spot.

## Desired Outcome
A "ParkPin" micro-app designed for extreme speed and legibility. It provides a massive, high-contrast form to input Floor and Pillar. Once saved, the UI completely transforms into a "Digital Ticket"—a high-visibility, read-only screen that displays the location in huge text, making it instantly readable at a glance when returning to the garage.

## Core Capabilities
- **Binary Mode State Engine:** A client-side data store holding string variables (Floor, Pillar, Note) alongside a critical `saved` boolean flag. This flag acts as the primary router for the application's view state.
- **Contextual View Swapping:** A unified presentation component that dynamically swaps between two entirely different interfaces (an Input Form vs. a Read-Only Ticket) based on the store's boolean state.
- **High-Contrast Typography UI:** The "Ticket" view must utilize massive font sizes and high-contrast color palettes (e.g., black and yellow) to ensure rapid legibility on mobile screens in varying lighting conditions.

## Constraints & Environment
- The application MUST operate entirely on the client-side for immediate interactions.
- The UI must prioritize massive, touch-friendly inputs and typography over dense information display.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight state management for view routing, Tailwind typography scaling) and file structure before writing any code.
