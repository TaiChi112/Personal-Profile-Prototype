# Epic: Open Source Impact Score (Micro-App)

## The Problem
Developers contribute to Open Source, but standard GitHub profiles only highlight activity quantity (green squares) rather than code quality. There is no automated, objective way for developers to prove their structural coding competency (e.g., architecture, readability, adherence to best practices) to recruiters based on their actual code diffs.

## Desired Outcome
An "Open Source Impact Score" micro-app that serves as both a vanity metric and a powerful portfolio utility for developers. It ingests a GitHub username, analyzes recent Pull Request diffs via AI, and generates a visual radar chart scoring their code quality. It monetizes via B2C micro-transactions, allowing users to purchase a premium, downloadable PDF certificate of their scores.

## Core Capabilities
- **Diff Ingestion Engine:** A backend service that securely authenticates with the GitHub API to fetch a user's recent Pull Request diffs without hitting restrictive public rate limits.
- **AI Code Analyzer:** An LLM prompted to objectively evaluate raw code diffs across multiple dimensions (Architecture, Readability, Complexity) and output strictly formatted JSON scores.
- **Visual Dashboard:** A highly engaging, animated frontend UI featuring a radar chart that displays the developer's strengths.
- **Premium Certification:** A gated checkout system that, upon payment, triggers a client-side rendering pipeline to generate a high-resolution, branded PDF certificate.

## Constraints & Environment
- The system MUST ONLY fetch diffs, NOT full repository clones, to remain highly performant and avoid bandwidth/compute bottlenecks.
- GitHub API calls must be routed through the server using a server-side token to prevent IP-based rate limiting on the client.
- The AI must be constrained to penalize trivial PRs (e.g., README typo fixes) to maintain the legitimacy of the scoring system.

## Agentic Architect Directive
> **ATTENTION AI AGENT:** This is a PM-centric problem statement. Your first task is to act as a System Architect. Research and propose the optimal tech stack (e.g., GitHub API wrappers, structured LLM generation, chart visualization libraries, client-side PDF rendering, secure payment gateways) and file structure before writing any code.
