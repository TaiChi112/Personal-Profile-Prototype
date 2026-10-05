# Epic: Fridge Expiry Tracker (Micro-App)

## The Problem
Households waste a significant amount of money and food simply because items get pushed to the back of the fridge and forgotten until they spoil. Keeping a mental inventory or using generic to-do lists is ineffective because they lack chronological sorting and visual urgency regarding expiration dates.

## Desired Outcome
A "Fridge Expiry Tracker" micro-app that acts as a frictionless digital kitchen inventory. Users quickly log groceries alongside their expiration dates. The app automatically sorts the inventory from most urgent to least urgent and applies traffic-light color coding (Safe, Warning, Expired) to immediately highlight what needs to be consumed next, reducing food waste.

## Core Capabilities
- **Inventory State Engine:** A robust client-side data store that manages the collection of perishable items, supporting rapid additions and deletions.
- **Time-Delta Evaluation Logic:** A calculation layer that continuously compares each item's designated expiration date against the current system clock to determine the exact number of safe days remaining.
- **Urgency Visualization UI:** A presentation component that enforces chronological sorting on the inventory and maps the time-delta results to distinct, color-coded visual warning states.

## Constraints & Environment
- The application MUST operate entirely on the client-side for immediate responsiveness.
- Date parsing and time-delta mathematics must account for local system time robustly without requiring complex third-party timezone libraries (a simple day-difference calculation is sufficient for the MVP).

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight state management, native JS `Date` logic for delta calculations) and file structure before writing any code.
