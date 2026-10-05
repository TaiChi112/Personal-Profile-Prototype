# Epic: Text-to-Architecture Diagram (Micro-App)

## The Problem
High-value technical leads and architects need quick ways to visualize systems, but manual diagramming tools are slow and tedious. Without a high-utility, free tool to attract these decision-makers organically, a developer's portfolio lacks a sustainable inbound funnel for consulting services or digital products.

## Desired Outcome
A "Text-to-Architecture Diagram" micro-app that serves as a powerful lead magnet. It allows users to describe an architecture in plain text, instantly generates a visual diagram via AI, and subtly cross-sells the developer's premium consulting services and component marketplace.

## Core Capabilities
- **AI Diagram Generation:** An intelligent prompt engine instructing an LLM to generate syntactically correct diagram-as-code (e.g., Mermaid.js) from plain text.
- **Resilient Live Rendering:** A client-side renderer that draws the SVG in real-time, complete with robust error boundaries and zoom/pan functionality.
- **High-Res Export:** A reliable export system allowing users to download their diagrams in vector (SVG) or raster (PNG) formats with transparent backgrounds.
- **Integrated Sales Funnel:** Seamlessly integrated native ad banners and post-export popups to convert free users into paying clients.

## Constraints & Environment
- The application must be entirely stateless (no database for saving diagrams) to keep hosting and maintenance costs near zero.
- The AI must be heavily constrained to output ONLY valid diagram syntax to prevent catastrophic rendering failures.
- The client-side renderer must include robust error handling to gracefully recover if the LLM hallucinates invalid syntax.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., structured LLM generation, client-side diagram rendering engines, canvas-based image export) and file structure before writing any code.
