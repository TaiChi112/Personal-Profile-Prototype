# Epic: Omni-Status Widget (Live Activity)

## The Problem
A static portfolio feels impersonal and outdated, failing to convey the developer's current activity level, personality, or immediate availability for freelance work, which reduces engagement from potential clients or recruiters.

## Desired Outcome
An engaging, dynamic "Live Activity" (Omni-Status) widget that continually cycles through real-time data (current music, coding activity, and manual work status) to present a highly active, relatable, and accessible personal brand.

## Core Capabilities
- **Music Integration:** Real-time fetching of currently playing or recently played tracks.
- **Developer Metrics:** Display of coding activity and recent version control commits.
- **Availability Control:** A manual admin toggle to signal work availability.
- **Dynamic UI:** An animated, rotating UI component that expands into a detailed view upon interaction.

## Constraints & Environment
- External API responses must be aggressively cached to prevent rate-limiting and ensure fast load times.
- Animations must be smooth but non-distracting to the core reading experience.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., API authentication flows, caching mechanisms, animation libraries) and file structure before writing any code.
