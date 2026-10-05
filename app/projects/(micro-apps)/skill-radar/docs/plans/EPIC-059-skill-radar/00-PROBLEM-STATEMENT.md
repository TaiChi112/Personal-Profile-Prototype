# Epic: Skill Radar (Micro-App)

## The Problem
Standard resumes and lists of skills (e.g., "React: 8/10", "Backend: 5/10") fail to communicate the overall "shape" of a professional or individual. People struggle to visualize if they are a "T-shaped" generalist or highly specialized without a proper multidimensional diagram, but importing massive charting libraries just for a simple self-assessment is overkill.

## Desired Outcome
A "Skill Radar" micro-app that serves as an interactive RPG-style attribute visualizer. Users adjust their skill levels using simple 1-10 sliders, and the app instantly recalculates and renders a native SVG radar (spider) chart. This provides immediate visual feedback on their overall skill shape, strengths, and weaknesses.

## Core Capabilities
- **Attribute State Engine:** A lightweight client-side data store holding an array of skill objects (name and bounded 1-10 integer value) and a targeted update mutation function.
- **SVG Radial Math Projection:** A rendering layer that utilizes standard trigonometry (polar to Cartesian coordinates) to project the linear array of skill values into a closed, multi-point SVG polygon dynamically.
- **Dual-View Sync UI:** A synchronized layout pairing the visual chart with standard HTML range sliders, ensuring real-time chart manipulation as the user drags a slider.

## Constraints & Environment
- The application MUST operate entirely on the client-side for zero-latency slider interactions.
- The radar chart MUST be built using raw `<svg>` elements and native JS math within the React render cycle, strictly avoiding external charting libraries (like Chart.js or Recharts) to maintain the micro-app's lightweight footprint.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, SVG coordinate math patterns) and file structure before writing any code.
