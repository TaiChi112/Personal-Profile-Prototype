# Phase 2: Proportional Visualization UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Users cannot easily conceptualize raw numbers; they need to "see" their budget flow from the income source into the expense buckets.
- **The Solution:** Build a split-pane or flow-based UI where the main income acts as the source, flowing into expense cards. Each card must visually represent its "weight" (percentage of income) using dynamic background fills.

## 2. Acceptance Criteria
- [ ] Create a prominent input card for the Total Income.
- [ ] Render a list of expense cards bound to the state engine.
- [ ] Implement a dynamic visual indicator (e.g., an absolute positioned background fill) inside each expense card that scales in width relative to `(expenseValue / totalIncome) * 100`.
- [ ] Display the calculated percentage text inside each card for exact clarity.
- [ ] Create a prominent footer/banner that displays the remaining balance, applying distinct styling (e.g., green/positive vs. red/negative) based on whether expenses exceed income.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI component libraries and dynamic styling utilities based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
