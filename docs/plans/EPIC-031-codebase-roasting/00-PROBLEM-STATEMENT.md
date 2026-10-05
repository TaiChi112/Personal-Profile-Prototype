# Epic: Viral Lead Magnet (Codebase Roaster)

## The Problem
Viral marketing is difficult for developers. A standard portfolio relies heavily on slow inbound search traffic. It lacks a viral, interactive hook that encourages users (other developers, founders, or technical recruiters) to share the site on social media, thereby drastically limiting the top of the sales funnel.

## Desired Outcome
A "Roast My Repo" interactive micro-app that serves as a viral lead magnet. Users submit their GitHub repository URL, and an AI generates a humorous, sharp critique of their tech stack, outputting a highly shareable image card and seamlessly upselling the developer's consulting services.

## Core Capabilities
- **Lightweight Extraction:** High-speed data fetching of repository metadata and dependency files without cloning the full repository.
- **AI Roaster Engine:** An LLM prompted specifically for humor and technical critique, returning strictly formatted data (grades, roast text).
- **Viral Card Generation:** Dynamic generation of visually appealing, downloadable images containing the AI's critique and a watermark.
- **Contextual Upsell:** A dynamic call-to-action routing users with poor grades directly to the Productized Services storefront.

## Constraints & Environment
- The entire process (fetching, AI generation, and image rendering) must complete in under 10 seconds to prevent user drop-off.
- The AI must reliably return strictly formatted JSON to prevent catastrophic UI rendering errors on the shareable card.
- Must not clone full repositories to preserve server bandwidth and compute resources.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., fast API fetching strategies, LLM SDKs with structured JSON output, dynamic image generation libraries) and file structure before writing any code.
