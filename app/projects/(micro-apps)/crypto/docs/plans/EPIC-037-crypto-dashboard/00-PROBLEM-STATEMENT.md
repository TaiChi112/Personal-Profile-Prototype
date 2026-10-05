# Epic: Crypto Market Dashboard (Micro-App)

## The Problem
Cryptocurrency investors and enthusiasts need to monitor market trends and asset prices rapidly. Full-scale trading terminals are often overwhelming and clunky for a quick "at-a-glance" check, while basic text-only trackers fail to convey market momentum (up/down ticks) or historical context effectively.

## Desired Outcome
A responsive, visually engaging "Crypto Market Dashboard" micro-app. It provides an immediate overview of key assets through dynamic price cards featuring sparklines and a central historical trend chart. To emulate the feel of a live trading floor, the UI must provide instantaneous visual feedback (flashing colors) whenever asset prices update.

## Core Capabilities
- **Live Price Feed Integration:** A data layer capable of ingesting real-time (or frequently polled) asset pricing and 24-hour performance metrics.
- **Reactive Price Flasher UI:** A specialized UI mechanism that tracks state changes between previous and current values, applying temporary, color-coded visual cues (e.g., green for up, red for down) to highlight momentum.
- **Micro & Macro Charting:** Integration of a client-side charting engine to render both micro-context (asset-specific sparklines) and macro-context (comparative multi-asset historical area charts).

## Constraints & Environment
- The application must efficiently handle rapid data updates without triggering excessive re-renders that could cause browser lag.
- The UI must be fully responsive, ensuring complex charts remain legible on mobile devices.
- For the MVP, if a live WebSocket feed is unavailable, the data layer should robustly simulate or poll mock data to demonstrate the dynamic UI capabilities.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., performant charting libraries, custom React hooks for tracking previous state, data polling strategies) and file structure before writing any code.
