# Phase 2: Multi-Layout Dashboard & API Reference

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users need a way to input a username, supply their PAT if rate-limited, and view the resulting data in a format that is much easier to read than raw JSON.
- **The Solution:** Build a search header, a layout toggle (Bento vs Timeline), and the corresponding visualization components that map over the state data. Include a static API cheat sheet for developers.

## 2. Acceptance Criteria
- [ ] Create a search bar component that binds to `searchQuery` and triggers the data fetch sequence.
- [ ] Create a settings/configuration modal or section to input and save the `userPat`.
- [ ] Implement a Layout Toggle control (e.g., Bento, Tabs, Timeline) that updates a `layoutMode` state variable.
- [ ] Build the visualization components that consume `userData` and `reposData` and render them conditionally based on the `layoutMode`.
- [ ] Build an "API Endpoint Explorer / Cheat Sheet" section containing categorized, copy-pasteable REST API URLs for developer reference.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI patterns and layout components based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
