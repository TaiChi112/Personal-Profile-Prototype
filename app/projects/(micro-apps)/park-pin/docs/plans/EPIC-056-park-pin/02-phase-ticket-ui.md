# Phase 2: High-Contrast Interface

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The UI needs to be incredibly fast to use when parking and incredibly easy to read when returning to the car.
- **The Solution:** Build the "Input" mode with massive text fields. Build the "Ticket" mode using a high-contrast (e.g., yellow and black) theme with extreme font sizes for the core data.

## 2. Acceptance Criteria
- [ ] Build the "Input" view containing fields for Floor, Pillar, and Note. Apply CSS to force the text to uppercase and use large text sizes.
- [ ] Implement a prominent "Pin Location" button that fires `savePark`. Disable it if the primary `floor` input is empty.
- [ ] Build the "Ticket" view (rendered when `saved` is true). Display the `floor` and `pillar` variables using massive typography (e.g., `text-7xl`).
- [ ] Wrap the Ticket view in a distinct, high-contrast color theme (like a physical parking ticket) to visually differentiate it from the input mode.
- [ ] Include a prominent "I Found My Car" button in the Ticket view that fires the `clearPark` function, reverting the app to the Input view.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate dynamic CSS styling and typography scaling based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
