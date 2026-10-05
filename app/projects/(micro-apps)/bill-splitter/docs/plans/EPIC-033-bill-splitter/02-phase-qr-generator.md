# Phase 2: Payment Payload & QR Visualizer

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Knowing the split amount isn't enough; friends still have to manually type the recipient's phone number to transfer money.
- **The Solution:** Generate a standard peer-to-peer payment payload (like PromptPay) embedded with the exact split amount, and render it visually as a QR code so others can simply scan to pay.

## 2. Acceptance Criteria
- [ ] Implement a utility function that strictly formats the recipient ID and the calculated split amount into a valid regional payment payload string (e.g., EMVCo standard).
- [ ] Integrate a client-side rendering library to visually display the generated payload as a scannable QR code.
- [ ] The QR code must dynamically update in real-time as the user adjusts the total bill or headcount.
- [ ] Ensure the QR code only renders when a valid recipient identifier is provided.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate QR rendering components and payload formatting utilities based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
