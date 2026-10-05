# Epic: Regex Lab (Micro-App)

## The Problem
Writing Regular Expressions (Regex) is notoriously error-prone. Developers often struggle to visualize exactly what their pattern is matching, and a single missed character can break an entire script. Opening heavy IDEs or relying on external websites to test a quick regex string breaks the developer's flow.

## Desired Outcome
A "Regex Lab" micro-app providing a lightning-fast, zero-friction testing environment. Users input a regex pattern and a test string, and the app instantly compiles the pattern, reporting syntax errors or displaying the total number of matches found in real-time.

## Core Capabilities
- **String Validation State:** A lightweight client-side data store holding the user's input pattern and the target test string, updating instantly on every keystroke.
- **Real-Time Compilation Engine:** A rendering layer that intercepts the pattern string and attempts to compile it into a native Regular Expression object safely, catching syntax errors before they crash the application.
- **Contextual Match UI:** A presentation component that binds the output of the compilation engine to the UI, highlighting the pattern input in red if the syntax is invalid, or boldly displaying the match count if valid.

## Constraints & Environment
- The application MUST operate entirely on the client-side to ensure instant, keystroke-level feedback.
- The real-time compilation MUST be wrapped in robust error handling. Native `RegExp` constructors throw fatal, app-crashing errors on incomplete syntax (e.g., an unclosed bracket `[`), which is inevitable while a user is typing.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., lightweight reactive state management, safe native `RegExp` compilation patterns) and file structure before writing any code.
