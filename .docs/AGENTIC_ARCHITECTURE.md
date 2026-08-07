# Agentic Architecture

This document defines the architecture and collaboration model optimized for AI-agent interaction within the project.

## Human + AI Collaboration Model
The development lifecycle is a partnership:
- **Humans**: Define the vision, approve architectural decisions, set safety gates, review pull requests, and manage production infrastructure.
- **AI Agents**: Execute scoped tasks, audit repositories, write documentation, clean up technical debt, and implement isolated features based on approved plans.

## Development-Time Agents
Current AI integration focuses on development-time assistance:
- Agents (Gemini, Claude) act as advanced coding partners.
- They utilize the project standard layer (canonical memory, workflows) to orient themselves.
- They operate in strict "Scoped PR lifecycle" modes, ensuring one task group equals one branch and one PR.

## Future Product-Time Agents
As the platform evolves, AI may be integrated into the runtime product:
- E.g., an intelligent portfolio assistant that can answer questions about the documentation or the owner's experience.
- Such agents will be isolated from core system state and will operate via controlled APIs or standard RAG patterns.

## Agent Boundaries and Safety Gates
To ensure safe operations, agents must respect the following boundaries:
- **Production Code (`/app`, `/lib`)**: Requires verification of shared imports.
- **Documentation (`/docs`)**: Lower risk, but requires local previews.
- **Database (`/prisma`)**: Strict adherence to the `prisma migrate dev` workflow.
- **Stop Gates**: Agents must halt and report if builds fail, tests fail, or they encounter ambiguity outside their scoped task.

## Where AI May Integrate Later
- **Documentation Intelligence**: Automated semantic search, tagging, and QA across Fumadocs.
- **Agentic Workflow Dashboard**: A potential internal UI to monitor agent tasks, PRs, and lint debt.

## What Must Remain Human-Approved
Agents are strictly prohibited from independently modifying or executing:
- Infrastructure and deployment configurations (`Dockerfile`, CI/CD workflows).
- Authentication logic (`auth.ts`) and secret management.
- Dependency changes (modifying `package.json` or `bun.lock`).
- Production database migrations.
