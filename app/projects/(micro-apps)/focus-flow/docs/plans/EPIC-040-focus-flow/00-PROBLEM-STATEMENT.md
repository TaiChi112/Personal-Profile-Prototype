# Epic: Focus Flow Tracker (Micro-App)

## The Problem
Individuals struggling with procrastination often use the Pomodoro technique to maintain focus. However, standalone timers fail to provide long-term motivation, and robust productivity apps are often too complex or require paid subscriptions to view historical data. Users need a simple way to not only time their sessions but also visualize their consistency over time to build a lasting habit.

## Desired Outcome
A frictionless "Focus Flow" micro-app that combines a beautiful, distraction-free Pomodoro timer with a GitHub-style activity contribution graph. It motivates users by allowing them to instantly start a focus block while passively building a visual "streak" of their deep-work habits over the year, all saved securely in their own browser.

## Core Capabilities
- **Time-Tracking State Machine:** A robust engine that manages the countdown intervals (Focus, Short Break, Long Break) and securely persists completed session logs to the browser's local storage.
- **Interactive Timer UI:** A responsive, SVG-based radial progress indicator that provides smooth visual feedback synchronized with the countdown, complemented by audio notifications upon completion.
- **Historical Heatmap Visualizer:** A data-aggregation component that processes the persisted session logs into a 52-week grid matrix, color-coding daily cells based on the volume of accumulated focus time.

## Constraints & Environment
- The application MUST operate entirely on the client-side. To ensure user privacy and remove backend friction, historical data must be persisted exclusively via browser `localStorage`.
- The timer must handle browser background-tab throttling gracefully, and audio playback must respect modern browser auto-play policies.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight persistent state management like Zustand with persist middleware, SVG mathematics for radial progress, date manipulation libraries for the heatmap) and file structure before writing any code.
