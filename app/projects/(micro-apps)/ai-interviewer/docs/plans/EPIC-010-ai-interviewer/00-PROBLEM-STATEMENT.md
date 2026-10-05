# Epic: AI Technical Interview Platform (Micro-App)

## The Problem
Companies waste countless engineering hours screening junior to mid-level developer candidates. HR departments lack the technical expertise to evaluate code submissions, and senior developers are too expensive to spend their time on initial filtering interviews.

## Desired Outcome
An "AI Technical Interview Platform" micro-app targeting the B2B SaaS market. It acts as an automated, rigorous "Senior Tech Lead" that conducts interactive, chat-based coding interviews, evaluates candidate logic in real-time, and sends detailed, private scorecards directly to HR.

## Core Capabilities
- **Interactive Workspace:** A split-screen UI featuring an AI chat interface and a syntax-highlighted code editor.
- **Strict Evaluation Engine:** An LLM prompted to aggressively question ("grill") candidates, withhold direct answers, and evaluate logic, culminating in an automated tool-call to submit scores.
- **HR Command Center:** A secure dashboard for HR to generate single-use interview links, view candidate leaderboards, and access deep-dive reports.
- **B2B Monetization:** A pay-per-link billing model allowing companies to purchase interview credits.

## Constraints & Environment
- MUST NOT implement true Remote Code Execution (RCE) on the server to avoid severe security vulnerabilities; rely on AI logic evaluation and client-side formatting.
- Interview links must be strictly single-use (cryptographic tokens) to prevent candidate cheating or link sharing.
- Candidates must never see their final score or detailed evaluation; this data must be routed directly to the secure database for HR.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., client-side code editors, LLM tool/function calling, secure single-use token generation, B2B payment gateways) and file structure before writing any code.
