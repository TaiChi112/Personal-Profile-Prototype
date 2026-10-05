# Epic: AI Tech Stack & Salary Estimator (Micro-App)

## The Problem
Standard portfolios struggle to attract organic traffic. Without a viral, high-utility hook to draw visitors in, the developer's brand visibility remains low, and there is no mechanism to capture passive income from inbound traffic.

## Desired Outcome
An "AI Tech Stack & Salary Estimator" micro-app designed specifically as a viral marketing tool. It estimates a developer's market value based on their tech stack, outputs a highly shareable visual result card, and subtly monetizes the traffic via contextual affiliate links for upskilling.

## Core Capabilities
- **Interactive Intake:** A smooth, engaging multi-step input form for user data collection.
- **AI Analysis Engine:** An LLM-powered backend endpoint to analyze skills and generate strictly structured JSON containing salary estimates and learning roadmaps.
- **Viral Mechanics:** A dynamic "Shareable Result Card" with data visualization and one-click image-export functionality.
- **Passive Monetization:** An intelligent affiliate matching engine that maps AI-recommended skills to sponsored courses automatically.

## Constraints & Environment
- Must process and return LLM results rapidly (e.g., under 10 seconds) to prevent user abandonment.
- The AI must reliably return strictly formatted JSON to prevent catastrophic UI rendering errors.
- Must remain completely stateless (no database for history tracking) to maintain a zero-maintenance, low-cost architecture.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., fast LLM SDKs with structured output, client-side image rendering libraries, stateless affiliate matching strategies) and file structure before writing any code.
