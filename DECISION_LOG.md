# Decision Log

This document records significant architectural and workflow decisions for the project.

## Initial Decisions

### 1. Bun is Canonical
- **Decision**: Use Bun as the sole package manager and script runner.
- **Rationale**: Speed, built-in tooling, and a single lockfile (`bun.lock`). npm is restricted unless required for bootstrapping.

### 2. AGENTS.md is Canonical Policy
- **Decision**: All repository policy, boundaries, and rules live in `AGENTS.md`.
- **Rationale**: Prevents scattered instructions and ensures a single source of truth for all AI agents.

### 3. PROJECT_STRUCTURE.md Defines Boundaries
- **Decision**: Explicitly map production, documentation, and sandbox areas.
- **Rationale**: Prevents agents from confusing learning code (`/src`) with production code (`/app`).

### 4. AGENT_WORKFLOWS.md Defines Procedures
- **Decision**: Reusable Git, PR, and validation procedures are standardized.
- **Rationale**: Ensures predictable, safe agent behavior and prevents uncontrolled autonomy.

### 5. Tool Adapters Stay Thin
- **Decision**: Files like `GEMINI.md` and `CLAUDE.md` must only point to `AGENTS.md`.
- **Rationale**: Avoids context bloat and out-of-sync policies across different AI platforms.

### 6. No Premature AI Tooling
- **Decision**: Do not build custom skills, slash commands, or MCP servers until a repeated need is proven.
- **Rationale**: Prevents tool lock-in and maintenance overhead for unused features.

### 7. Scoped PR Lifecycle
- **Decision**: One task group = one branch = one PR.
- **Rationale**: Ensures atomic, easily reviewable changes and minimizes regression risks.
