# Epic: Recipe Scaler (Micro-App)

## The Problem
Scaling a recipe up or down often requires tedious mental math or a scratchpad. When a recipe written for 4 people needs to be cooked for 7, cooks frequently make calculation errors in the middle of cooking (e.g., forgetting to scale the baking powder), leading to ruined dishes.

## Desired Outcome
A frictionless "Recipe Scaler" micro-app that handles proportional math instantly. Users enter the original servings, their target servings, and the ingredient list. The app dynamically calculates the new amounts, displaying the scaled result prominently while keeping the original amount visible for reference.

## Core Capabilities
- **Proportional State Engine:** A client-side data store holding global variables for `baseServings` and `targetServings`, alongside an array of ingredient objects containing original numeric values and units.
- **Real-Time Derivation Logic:** A mathematical rendering layer that dynamically calculates the scaling ratio `(target / base)` and applies it to every ingredient without permanently mutating the original stored values.
- **Contextual Math UI:** A presentation component featuring a prominent top-level control for the serving ratio, a multi-input form for adding new ingredients, and a list view that formats the derived outputs cleanly (handling decimals gracefully).

## Constraints & Environment
- The application MUST operate entirely on the client-side to guarantee real-time, lag-free scaling as the user adjusts the target servings.
- The mathematical derivation must include safeguards against division-by-zero if the user clears the `baseServings` input field.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, number formatting logic) and file structure before writing any code.
