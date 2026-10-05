# Epic: Subscription Auditor (Micro-App)

## The Problem
Consumers suffer from "death by a thousand cuts" due to recurring monthly subscriptions. Because services advertise as "$10/month" or "400 THB/month", the human brain downplays the impact. Users need to see the annualized "Burn Rate" to realize they are actually spending thousands per year on services they barely use.

## Desired Outcome
A "Subscription Auditor" micro-app designed to inflict mild financial shock. It lists the user's recurring expenses as interactive toggles. As the user checks or unchecks a service, a massive "Yearly Burn Rate" billboard instantly recalculates, visually proving how much money they can save over a year by canceling a small monthly fee.

## Core Capabilities
- **Aggregation State Engine:** A client-side data store holding an array of subscription entities (name, monthly price, and an active boolean status), with a targeted mutation function to toggle the active state.
- **Burn Rate Derivation Logic:** A mathematical layer that filters the global array for active items, reduces the prices to a monthly sum, and scales it by 12 to calculate the annualized cost in real-time.
- **Psychological Impact UI:** A split-pane layout featuring an interactive, clickable checklist on one side, and a stark, highly-contrasting (e.g., red/warning color) billboard on the other side that displays the massive yearly total using localized number formatting.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency financial calculations when a user toggles a service.
- The UI must rely heavily on typography and color to convey financial urgency, rather than complex charts.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, array reduction math patterns) and file structure before writing any code.
