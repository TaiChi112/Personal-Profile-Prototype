# Phase 2: Radial UI & Activity Heatmap

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** A standard text countdown is boring. Users need a visual anchor while working, and a rewarding visual representation of their long-term effort to stay motivated.
- **The Solution:** Build a large SVG radial progress timer for the active session. Below it, render a GitHub-style contribution graph that reads the persistent history array and color-codes the past 52 weeks based on daily focus volume.

## 2. Acceptance Criteria
- [ ] Implement an SVG-based circular timer component that dynamically adjusts its `strokeDashoffset` based on the percentage of time remaining.
- [ ] Implement mode-switching UI tabs (Focus, Short Break, Long Break) that instantly reset the timer to the appropriate duration.
- [ ] Implement audio playback functionality that triggers when the timer hits zero.
- [ ] Build a "Heatmap" component that generates a grid of the last 365 days.
- [ ] The Heatmap must aggregate the raw `history` data by date, summing the total focus minutes per day, and apply conditional CSS color intensity to the corresponding grid cell.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Research and utilize native SVG properties for the timer and date manipulation logic (native Date API or lightweight utility) for the heatmap.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
