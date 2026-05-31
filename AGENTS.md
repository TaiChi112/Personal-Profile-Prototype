# Agent Instructions: taichi112.works

**Repository**: personal-profile-prototype (v0.1.0)  
**Purpose**: Canonical agent-oriented repository guidance  
**Intended canonical repository guidance for supported agent workflows**

---

## Project Identity

This repository powers `taichi112.works`, a personal software platform built with Next.js and TypeScript.

Current areas include:
- portfolio-facing pages and content
- Fumadocs-based technical documentation
- authentication and database-backed functionality
- software engineering and design-pattern learning artifacts
- Docker and deployment configuration

Strategic direction:
- evolve the project toward maintainable AI-agent-integrated software workflows

---

## Technology Stack (Verified)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.7 + React 19.2.3 (App Router) |
| Language | TypeScript 5.9 (strict mode) |
| Database | PostgreSQL 16 + Prisma 7 + PrismaPg adapter |
| Auth | NextAuth.js v5 beta (Google OAuth + Credentials) |
| Docs | Fumadocs + MDX (content in `/docs`, rendered in `/app/docs`) |
| Styling | Tailwind CSS 4 + PostCSS |
| Containerization | Docker + Docker Compose (Alpine node:20) |
| CI/CD | GitHub Actions (build → GHCR → GCP SSH deploy) |
| Runtime Scripting | Bun (for fast script execution) |

---

## Repository Boundaries

| Area | Content | Rules |
|------|---------|-------|
| `/app` | Next.js App Router application routes and UI | Inspect existing conventions before integrating code from other boundaries. |
| `/docs` | Fumadocs-based Markdown and MDX documentation source | Preview in dev server when making edits. See Documentation Changes section. |
| `/src` | Design-pattern and demo-related code | Treat as a separate boundary unless import/build relationships are verified for the task. |
| `/lib` | Shared application utilities and service setup | Inspect lifecycle and initialization behavior before modifying shared utilities. |
| `/prisma` | Database schema and migration files | Use approved `prisma migrate dev` workflow for schema changes. Do not edit or delete applied migrations. |

---

## Critical Rules

### DO NOT MODIFY (without explicit approval)

- `.env*` files (secrets)
- `auth.ts` (authentication logic)
- `Dockerfile`, `docker-compose*.yml` (runtime and deployment configuration)
- `.github/workflows/deploy.yml` (CI/CD pipeline)
- `next.config.ts`, `source.config.ts` (framework config)

An explicit user task targeting authentication, runtime/deployment, CI/CD, or framework configuration permits inspection and a proposed change in that area, but the agent must explain risks and run task-appropriate validation before finalizing changes.

Never read, expose, or modify real secret values unless the user provides a specific, security-conscious instruction and the action is strictly necessary.

### Database Schema Changes

**Approved workflow:**
1. Edit `prisma/schema.prisma` with your changes
2. Run `npm run prisma:migrate:dev`
3. Prisma CLI prompts for migration name; confirm
4. Review generated `.sql` migration file
5. Run `npm run build` to verify TypeScript

**Never:**
- Delete or rename existing migrations
- Edit applied migration `.sql` files
- Execute production migrations without explicit approval

### Development Commands (Verified from package.json)

```bash
# Development
npm run dev              # Start Next.js dev server (webpack)
npm run build            # Compile + type-check
npm run lint             # ESLint validation
npm run start            # Production server (after build)

# Database
npm run db:up            # Start PostgreSQL + app (docker-compose)
npm run db:down          # Stop services
npm run db:logs          # Tail PostgreSQL logs
npm run prisma:migrate:dev    # Create & apply dev migration
npm run prisma:migrate:status  # Check migration status

# Scripts & Tests
npm run integration:http-crud         # Integration test (Bun runtime)
npm run integration:auth-db           # Auth + database integration test
npm run integration:http-admin-users  # Admin users integration test
```

---

## Package Manager Status (UNRESOLVED)

**Current state**: Both `bun.lock` and `package-lock.json` exist; Dockerfile uses Bun.

**Guidance for agents:**
- **Do not modify dependencies or lockfiles** until policy is explicitly confirmed by the repository owner
- If a dependency must be added, ask for approval first
- Do not run `npm install` or `bun install` unless instructed

---

## Validation by Change Type

| Change Type | Minimum Validation |
|---|---|
| Instruction files only (`AGENTS.md`, `CLAUDE.md`) | Review diff and confirm no unrelated files changed |
| Prose-only `/docs/**/*.{md,mdx}` edits | Preview the affected page when practical |
| MDX imports, components, navigation metadata, or docs configuration | Preview affected routes and run `npm run build` |
| Application TypeScript/React changes | Run `npm run lint` and `npm run build` |
| Prisma schema or migration changes | Follow the approved migration workflow and run relevant build/database checks |
| Authentication, deployment, CI/CD, or environment-related changes | Require explicit approval and define a task-specific validation plan before editing |

---

## Documentation Changes

Documentation in `/docs/**/*.{md,mdx}`:
- **Prose-only edits**: Preview in dev server (low risk)
- **Metadata/frontmatter changes**: Verify in browser after `npm run dev`
- **Config changes** (`source.config.ts`, Fumadocs plugins): Run `npm run build` to validate
- **Link changes**: Test links manually in dev server

Documentation is rendered via Fumadocs in `/app/docs`; content changes do not require migrations.

---

## Agent Instruction Layers

- `AGENTS.md` is the detailed repository guidance for supported agent workflows.
- `CLAUDE.md` is the thin Claude Code adapter that imports `@AGENTS.md`.
- `.github/copilot-instructions.md` is the concise GitHub Copilot compatibility baseline for supported Copilot surfaces.
- Keep detailed repository policy in `AGENTS.md`; do not duplicate it across adapter files.
- Add path-specific instructions only after a concrete repository need is identified and explicitly approved.

---

## When to Propose New Instruction Files / Skills / Hooks

Do not add the following without explicit approval:

- **Path-specific instructions** (`.github/instructions/*.instructions.md`)
- **Skills** (reusable workflows)
- **Hooks** (Git pre-commit, watch, etc.)
- **MCP servers**
- **Custom agents**
- **Dependencies**

Evaluate or propose agent extensions when the user explicitly requests agent-environment setup or when a concrete repository-specific capability gap is identified. Do not install or configure extensions without explicit approval.

---

## Escalation

If you encounter a situation not covered here:
1. Document what you tried and why it failed
2. Propose the lowest-risk path forward
3. **Wait for approval** before proceeding
4. After resolution, request this file be updated with the new guidance

---

**Version**: 1.1 | **Last Updated**: 2026-05-29 | **Status**: Active
