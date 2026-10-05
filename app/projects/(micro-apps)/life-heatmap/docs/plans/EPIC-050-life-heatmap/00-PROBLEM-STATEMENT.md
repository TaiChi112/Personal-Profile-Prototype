# Epic: Life Heatmap (Micro-App)

## The Problem
Maintaining daily habits (like working out, reading, or meditating) requires long-term perspective. A simple checklist resets every day, providing no sense of historical consistency. Users love the visual reward of a "GitHub Contribution Graph," but they lack a simple, standalone version of this UI to track their personal, non-coding habits over a full year.

## Desired Outcome
A "Life Heatmap" micro-app that serves as a beautiful, interactive 52-week contribution graph. Users can view the past 365 days as a grid of discrete cells. By clicking on a specific day, they can toggle its "intensity" level, visually building a streak and tracking their consistency in a highly rewarding, color-coded matrix.

## Core Capabilities
- **Time-Series Matrix State:** A client-side data engine that initializes a precise, 365-element linear array representing the past year (mapped to exact dates) and manages the numeric "intensity level" for each node.
- **Grid Projection UI:** A mathematical layout algorithm that projects the linear array into a vertical-first 7x52 matrix (Days of the week X Weeks of the year).
- **Multi-State Interactive Nodes:** Individual cell components that bind their CSS background color to the node's intensity integer, allowing users to rapidly click and cycle through levels (e.g., 0 to 3) to log their daily activity.

## Constraints & Environment
- The application MUST operate entirely on the client-side. The initial 365-day array must be generated dynamically based on the user's current local system clock to ensure the "last cell" is always today.
- The UI mapping logic must accurately translate the 1D array into the standard 2D contribution graph layout without breaking on edge cases (e.g., leap years or offset start days).

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight state management, native JS `Date` manipulation, CSS Grid vs Flexbox for complex 2D mapping) and file structure before writing any code.
