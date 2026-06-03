# Product Vision

## Product Identity
`taichi112.works` is evolving from a standard personal portfolio and documentation site into a robust, AI-agent-integrated software platform. It serves as both a public-facing portfolio and an internal playground for advanced AI agent workflows.

## Target Users
- **Public Users**: Developers, recruiters, and peers exploring technical documentation, design patterns, and professional experience.
- **Internal Users (Human)**: The repository owner orchestrating development, managing AI agents, and deploying infrastructure.
- **Internal Users (AI Agents)**: Coding agents (Gemini, Claude, Copilot) operating within defined boundaries to write, test, and document code.

## Current Product Surface
- Next.js App Router for portfolio pages and UI.
- Fumadocs-based technical documentation in `/docs`.
- Authentication and database-backed functionality (NextAuth, Prisma, PostgreSQL).
- Software engineering and design-pattern learning artifacts in `/src` and `/demo`.

## Future Direction
The project will transition into a platform that actively uses AI to accelerate development, manage documentation, and eventually provide productized AI features to end-users. The goal is to build a maintainable platform where human and AI collaboration is seamless and safe.

## AI Integration Principles
- **Safety First**: AI agents must operate within strict repository boundaries and require human approval for high-risk changes (auth, infra, database).
- **Single Source of Truth**: AI agents must rely on canonical memory (`AGENTS.md`) rather than inferred or disjointed instructions.
- **Incremental Value**: AI integration should focus on solving immediate workflow bottlenecks (e.g., linting, docs) before attempting complex autonomous product features.

## Non-Goals
- Building an autonomous, completely human-free development cycle.
- Over-engineering custom AI tools (skills, hooks) before establishing a clear, repeated need.
- Migrating away from the core Next.js/Bun stack purely for AI experimentation.
