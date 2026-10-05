# Epic: SmartDeal Calculator (Micro-App)

## The Problem
Grocery stores and online retailers often use deceptive packaging and pricing structures (e.g., "Buy 3 for $2.80" vs. "1 for $1.00"). Shoppers struggle to perform rapid unit-cost division in their heads while standing in an aisle, leading them to blindly trust "Sale" tags that aren't actually better deals.

## Desired Outcome
A "SmartDeal Calculator" micro-app designed for rapid, on-the-fly price comparisons. The user inputs the price and quantity/weight for two competing items. The app instantly calculates the exact unit cost for both, boldly declares the winner, and displays the precise percentage saved, eliminating all guesswork from the shopping experience.

## Core Capabilities
- **Comparative State Engine:** A lightweight client-side data store that holds the variables (price and quantity) for two independent items (Item A and Item B) with distinct mutation functions.
- **Unit Cost Derivation Logic:** A mathematical layer that calculates the unit cost for both items, performs conditional logic to declare the "winner," and derives the relative percentage savings between the two unit prices.
- **Dual-Pane Comparison UI:** A visually clear presentation layout featuring distinct, color-coded input cards for Item A and Item B, culminating in a prominent "Verdict" display that provides immediate, color-coded feedback on the best deal.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency calculations as the user punches in numbers.
- The derivation math must gracefully handle edge cases, preventing `NaN` or `Infinity` outputs if a user deletes the quantity field or sets it to 0.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, safe division math logic) and file structure before writing any code.
