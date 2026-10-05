# Epic: Type Trainer (Micro-App)

## The Problem
Developers spend hours typing, yet rarely practice typing actual code syntax (brackets, semicolons, camelCase). Standard typing tests use classic literature, which doesn't accurately measure or improve a programmer's specific keyboard dexterity, leading to slower coding speeds.

## Desired Outcome
A "Type Trainer" micro-app tailored for developers. The user is presented with a string of code syntax. As they type, the app provides real-time, character-by-character color-coded feedback (green for correct, red for errors). It silently tracks timestamps in the background to calculate and display a live Words Per Minute (WPM) score.

## Core Capabilities
- **WPM Derivation Engine:** A client-side data store holding the prompt, the user's input string, and a `startTime` timestamp. A specialized mutation function sets the timer on the first keystroke and calculates WPM dynamically on every subsequent keystroke.
- **Character-Mapping UI:** A rendering layer that splits the target prompt into individual character `<span>` elements. It compares the index of each span against the user's input string, applying conditional CSS classes for correct/incorrect states instantly.
- **Invisible Input Capture:** A presentation component that relies on a hidden native `<input>` element paired with a React `useRef` to capture mobile and desktop keyboard events cleanly without disrupting the stylized text display.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure zero-latency keystroke processing and accurate timestamp generation.
- The UI must actively manage focus. Clicking anywhere within the trainer container must programmatically focus the hidden input field so the user can type seamlessly.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, timestamp-based WPM math, React `useRef` focus management) and file structure before writing any code.
