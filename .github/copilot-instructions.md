# GitHub Copilot Instructions: taichi112.works

This repository powers `taichi112.works`, a Next.js and TypeScript personal software platform with application code, Fumadocs documentation, Prisma/PostgreSQL data-backed functionality, and deployment configuration.

Use `AGENTS.md` as the detailed repository guidance when the active Copilot surface supports agent instructions.

- Inspect nearby code and conventions before editing.
- Keep changes focused and do not modify unrelated files.
- Bun is the canonical package manager. Use `bun.lock` as the dependency lockfile; do not run `npm install` or commit `package-lock.json`.
- Documentation content under `/docs` includes both Markdown and MDX files.
- For application TypeScript/React changes, run `bun run lint` and `bun run build`.
- For approved Prisma schema changes, edit `prisma/schema.prisma`, use the development migration workflow documented in `AGENTS.md`, and never edit or delete applied migrations.
- Treat `auth.ts`, `Dockerfile`, `docker-compose*.yml`, `.github/workflows/deploy.yml`, `next.config.ts`, and `source.config.ts` as sensitive areas. Explain risks and use task-appropriate validation when a user explicitly requests changes there.
- Never read, expose, or modify real secret values from `.env*` unless the user provides a specific security-conscious instruction and the action is strictly necessary.
- Do not add dependencies, skills, hooks, MCP integrations, custom agents, or additional instruction layers without explicit approval.
