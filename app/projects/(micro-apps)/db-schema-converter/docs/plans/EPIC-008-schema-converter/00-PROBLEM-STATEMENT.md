# Epic: DB Schema Converter (Micro-App)

## The Problem
Developers migrating database architectures often waste hours manually rewriting legacy SQL or Prisma schemas into modern ORM formats like Drizzle. There is a lack of frictionless, single-purpose utilities that solve this exact problem without forcing users through a tedious authentication signup wall.

## Desired Outcome
A "DB Schema Converter" micro-app that serves as a frictionless developer utility. It provides a split-screen interface where users paste legacy schema code and instantly receive modern ORM code via an AI backend. It employs a freemium model (limited free daily uses) to hook users, followed by a frictionless one-time micro-transaction for unlimited access.

## Core Capabilities
- **Frictionless UI:** A clean split-screen code editor interface (Input/Output).
- **Strict Code Generation:** An LLM integration explicitly prompted to stream only raw, correct ORM code (stripping out markdown formatting and conversational filler).
- **Stateless Quotas:** A rate-limiting mechanism (e.g., LocalStorage or IP-based) to enforce a generous daily free tier without requiring user accounts.
- **Micro-transaction Unlock:** A seamless payment gateway integration to permanently unlock premium access for a specific client session.

## Constraints & Environment
- MUST NOT implement a traditional authentication/login system to keep the user acquisition funnel entirely frictionless.
- Premium status must be tracked using secure client-side tokens and payment webhooks rather than a persistent user database.
- The AI must be strictly constrained to output raw code only; conversational AI output will break the target code editor interface.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., client-side code editors, strict LLM system prompts, stateless rate limiting, frictionless payment webhooks) and file structure before writing any code.
