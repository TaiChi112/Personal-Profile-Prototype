# Phase 1: Biometric State & Calculation Engine

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** The application needs a robust way to handle user inputs and instantly translate them into medical metrics without relying on a slow server backend.
- **The Solution:** Implement a centralized client-side state store to hold biometric variables (age, gender, height, weight) and create a reactive computation layer that instantly calculates BMI and BMR using established medical formulas.

## 2. Acceptance Criteria
- [ ] A state management module is established to track age, gender, height, and weight.
- [ ] The module accurately computes BMI using standard logic `(weight / height^2)`.
- [ ] The module accurately computes BMR using the Mifflin-St Jeor equation, correctly adjusting the constant based on gender.
- [ ] Logic is in place to categorize the BMI result into standard brackets (Underweight, Normal, Overweight, Obese) with associated warning states.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate client-side state management tools based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
