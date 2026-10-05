# Epic: Time Block Pie (Micro-App)

## The Problem
People often overestimate how much time they have in a day. Traditional calendars list events vertically, which fails to visually communicate the finite constraint of a 24-hour cycle. Users need to physically see the "slices" of their day disappearing to understand their true capacity and find their remaining free time.

## Desired Outcome
A "Time Block" micro-app that visualizes a 24-hour budget. Authenticated users add activities with start and end times, and select a color. The app instantly translates these time spans into slices on a dynamic CSS donut chart. The center of the donut clearly displays the exact number of hours of "Free Time" remaining, preventing over-scheduling.

## Core Capabilities
- **Persistent User Data Lifecycle:** A robust backend integration requiring user authentication. It utilizes server actions to perform CRUD (Create, Read, Delete) operations on time-block entities stored securely in a database.
- **Duration Derivation Logic:** A logic layer that calculates the exact hourly duration between two HTML time string inputs (HH:MM), gracefully handling math for activities that cross the midnight boundary.
- **Conic Gradient Projection UI:** A presentation layout that converts the duration hours into sequential percentage stops out of 24. These stops are dynamically injected into a native CSS `conic-gradient` to render an interactive pie/donut chart without heavy charting libraries.

## Constraints & Environment
- The application MUST enforce user authentication. Unauthenticated users cannot view or manipulate the 24-hour budget and must be intercepted.
- The chart rendering relies strictly on inline CSS `conic-gradient` math, which requires sequential accumulation of percentages.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., secure server actions for database writes, React transitions for optimistic UI, CSS `conic-gradient` math) and file structure before writing any code.
