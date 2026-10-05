# Epic: Smart Timetable (Micro-App)

## The Problem
Standard calendar apps (like Google Calendar) require multiple clicks, form fills, and date selections just to block out a recurring weekly schedule (like a university class timetable). Students and teachers need a dead-simple, highly visual grid where they can just click and type to see their entire week at a glance.

## Desired Outcome
A "Smart Timetable" micro-app featuring a friction-free, interactive 2D grid (Monday to Friday, across predefined time slots). Users can click into any cell and start typing immediately. The app highlights filled cells automatically, providing a clean, instant overview of their weekly commitments without complex event forms.

## Core Capabilities
- **Matrix State Engine:** A lightweight client-side data store holding a flat, fixed-length array representing the 2D grid cells. It tracks the string input for each cell and updates instantly on keystroke.
- **2D Grid Projection UI:** A layout engine (utilizing CSS Grid) that maps the flat state array into a precise matrix of rows (Times) and columns (Days), ensuring perfect alignment of headers and data cells.
- **Inline Editable Cells:** Textareas embedded directly into the grid structure that allow instant data entry. The cells utilize conditional formatting (e.g., changing background color) when populated to visually separate busy times from free time.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency typing and layout rendering.
- The UI must utilize horizontal overflow scrolling gracefully, as the 6-column grid (5 days + 1 time column) will exceed standard mobile viewport widths.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, CSS Grid structures for flat array mapping) and file structure before writing any code.
