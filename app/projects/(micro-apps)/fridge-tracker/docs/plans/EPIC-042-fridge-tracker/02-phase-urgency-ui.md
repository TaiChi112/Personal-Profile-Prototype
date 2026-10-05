# Phase 2: Urgency Dashboard UI

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** A random, unsorted list of dates is hard for the user to parse at a glance. They need the most critical information forced to the top with clear visual indicators.
- **The Solution:** Build a dashboard that automatically sorts the state array chronologically. It should render each item as a distinct row, applying the categorized time-delta results as color-coded badges to command the user's attention.

## 2. Acceptance Criteria
- [ ] Create an input row with a text field for the item name, a native date picker input for the expiry, and a submit button.
- [ ] Render the inventory list below the input. The array MUST be sorted dynamically so that the earliest expiration dates appear at the top.
- [ ] Each rendered item must display the time-delta status using distinct styling (e.g., red background for "Expired!", amber for "Exp in X days", green for "Safe").
- [ ] Include a prominent delete/remove button on each item row for when the item is consumed or thrown away.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate UI patterns and dynamic CSS utility classes based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
