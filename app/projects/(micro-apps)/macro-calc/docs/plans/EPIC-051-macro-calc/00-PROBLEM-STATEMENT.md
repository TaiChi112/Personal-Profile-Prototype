# Epic: Macro Calculator (Micro-App)

## The Problem
Fitness enthusiasts and bodybuilders often plan their diets around specific macronutrient targets (grams of protein, carbs, and fat). Standard calorie counting apps are bloated with food databases, making it tedious to perform quick, reverse-engineered calculations to see how a specific macro split affects total daily calories and the overall diet ratio.

## Desired Outcome
A frictionless "Macro Calculator" micro-app designed for rapid "what-if" dietary planning. Users simply input the grams for their three core macros. The app instantly applies the standard caloric multipliers (4-4-9) to output total daily calories while simultaneously rendering a segmented, color-coded visual bar showing the exact percentage ratio of the diet.

## Core Capabilities
- **Caloric State Engine:** A lightweight client-side data store that holds the raw integer values (in grams) for Protein, Carbs, and Fat, equipped with a dynamic update function.
- **Real-Time Derivation Logic:** A mathematical layer that instantly computes the caloric weight of each macro, sums the total, and calculates the relative percentage ratio for each segment, safely handling zero-states.
- **Proportional Visualization UI:** A presentation component that binds the derived percentages to a single, segmented horizontal bar graph and displays bold, immediate feedback on total caloric intake.

## Constraints & Environment
- The application MUST operate entirely on the client-side to guarantee real-time, lag-free calculations as the user types.
- The visual segmented bar must use inline CSS calculations for width (e.g., `style={{ width: 'X%' }}`) rather than relying on heavy external charting libraries.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, native React inline styling for proportional bars) and file structure before writing any code.
