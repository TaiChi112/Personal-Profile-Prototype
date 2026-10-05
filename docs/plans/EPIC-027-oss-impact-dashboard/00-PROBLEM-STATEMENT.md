# Epic: Open Source Impact Dashboard

## The Problem
A standard GitHub contribution graph (the "green squares") fails to communicate the actual impact and quality of a developer's open-source work. Recruiters and engineering managers cannot easily distinguish between trivial commits to personal repos and significant, high-value contributions to major global projects.

## Desired Outcome
An "Open Source Impact Dashboard" that programmatically extracts and highlights only meaningful contributions (e.g., merged Pull Requests to repositories with a high star count). It presents this data visually as "Gamified Impact Cards" to establish immediate authority and technical credibility.

## Core Capabilities
- **Advanced Data Extraction:** Secure integration with version control APIs (e.g., GraphQL) to perform complex queries.
- **Intelligent Filtering:** Logic to isolate and display only high-value, merged contributions (e.g., ignoring personal or low-star repos).
- **Metric Aggregation:** Calculation of global impact metrics (total stars of contributed projects, net lines of code).
- **Gamified Presentation:** A visually engaging UI dashboard featuring animated, card-based layouts for each contribution.

## Constraints & Environment
- Must strictly implement robust caching strategies (e.g., ISR or SWR) to completely avoid hitting external API rate limits.
- The querying logic must be precise enough to filter out low-value or spam repositories automatically.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., GraphQL clients, data caching strategies, UI card designs) and file structure before writing any code.
