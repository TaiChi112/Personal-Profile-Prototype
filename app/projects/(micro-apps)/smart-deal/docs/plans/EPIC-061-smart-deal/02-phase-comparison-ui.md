# Phase 2: Dual-Pane UI & Verdict

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The user is likely holding a phone in one hand and groceries in the other. The UI must be highly distinct and the final answer incredibly obvious at a glance.
- **The Solution:** Build two distinct input cards with massive tap targets, color-coded for visual separation. Build a massive "Verdict" banner that dynamically changes color based on the winning item.

## 2. Acceptance Criteria
- [ ] Build a reusable `InputCard` component that accepts the item data, the specific update function, a title, and a specific color class.
- [ ] Render the two `InputCard` components side-by-side (or stacked on mobile). Ensure they display their specific derived unit cost at the bottom of the card.
- [ ] Build a central "Verdict" display block below the inputs.
- [ ] The Verdict block must bind its text and text-color to the output of the Phase 1 conditional logic (e.g., displaying "Item A is Cheaper!" in green text).
- [ ] Render the calculated percentage saved prominently beneath the winner declaration.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React rendering patterns and dynamic CSS styling based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
