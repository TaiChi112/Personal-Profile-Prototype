# Phase 2: Micro & Macro Charting

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need visual context beyond the current price to understand recent volatility and comparative historical trends.
- **The Solution:** Integrate a robust client-side charting library to embed tiny sparklines inside the individual asset cards, and a large, multi-series area chart to compare major assets over a 30-day period.

## 2. Acceptance Criteria
- [ ] Implement a mini sparkline chart within each asset card that visualizes a short, recent price history (simulated random walk or actual data).
- [ ] The sparkline color should reflect the 24h performance (e.g., green if positive, red if negative).
- [ ] Implement a large, responsive area chart below the asset cards that displays a 30-day historical trend.
- [ ] The macro chart must plot multiple assets (e.g., BTC, ETH, SOL) simultaneously with interactive tooltips and a legend.
- [ ] The charts must resize gracefully across desktop and mobile breakpoints.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select an appropriate, performant client-side charting library based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
