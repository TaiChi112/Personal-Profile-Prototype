# Epic: WealthViz Dashboard (Micro-App)

## The Problem
Tracking personal net worth often involves clunky spreadsheets or granting external apps access to bank accounts. Users need a simple, visual, and highly responsive way to manually input their broad asset and liability categories and instantly see their overall financial health and asset allocation without heavy, slow-loading charting libraries.

## Desired Outcome
A "WealthViz" micro-app designed for real-time net worth tracking. The user can adjust the values of their Assets (Cash, Stocks) and Liabilities (Loans) via simple inputs. The app aggregates these numbers instantly, calculating the Net Worth and mapping the asset allocation onto a native, ultra-lightweight SVG donut chart.

## Core Capabilities
- **Dual-Array Aggregation Engine:** A client-side data store holding two distinct arrays of financial objects (`assets` and `liabilities`), coupled with a unified mutation function to update the numeric value of any specific item.
- **Net Worth Derivation Logic:** A logic layer within the component that reduces the arrays into sums (Total Assets, Total Liabilities) and subtracts them to derive the live Net Worth.
- **SVG Circumference Projection UI:** A presentation layout that renders a dynamic donut chart natively. It calculates the percentage of each asset against the total, mapping those percentages directly to SVG `strokeDasharray` and `strokeDashoffset` properties using a circumference-optimized radius.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency chart rendering as the user types in the input fields.
- The chart rendering MUST rely strictly on raw `<svg>` elements and native stroke math, avoiding external charting dependencies (like Chart.js) to maintain a minimal micro-app footprint.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, SVG `strokeDasharray` math patterns) and file structure before writing any code.
