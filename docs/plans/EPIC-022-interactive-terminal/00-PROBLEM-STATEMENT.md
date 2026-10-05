# Epic: Interactive AI Terminal (Easter Egg)

## The Problem
Standard portfolios are predictable and lack interactive elements that specifically target the tech-savvy demographic (e.g., developers, CTOs, tech recruiters). This results in lower memorability and missed opportunities to showcase creativity and technical prowess.

## Desired Outcome
An engaging, hidden "Easter Egg" Interactive Terminal mode that overlays the portfolio. It acts as an intelligent, command-line interface allowing users to explore the candidate's background via traditional UNIX-style commands or conversational AI.

## Core Capabilities
- **Realistic Terminal Interface:** A full-screen UI with authentic typing animations and command history.
- **Static Command Parser:** Instant, client-side execution of foundational commands (e.g., `help`, `clear`, `cat resume`).
- **AI Persona Integration:** A backend AI endpoint configured with a distinct persona (e.g., SysAdmin) to answer complex queries.
- **Hybrid Routing:** Seamless transition between local static commands and network-based AI responses.

## Constraints & Environment
- The terminal must be entirely secure (read-only); the AI must absolutely not have access to execute real backend system commands.
- Local static commands must execute client-side instantly without any network latency.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., terminal UI libraries, state management for command history, AI streaming integration) and file structure before writing any code.
