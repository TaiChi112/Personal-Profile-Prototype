# GitHub Copilot Instructions: taichi112.works

This repository powers `taichi112.works`, a Next.js and TypeScript personal software platform with application code, Fumadocs documentation, Prisma/PostgreSQL data-backed functionality, and deployment configuration.

Use `AGENTS.md` as the detailed repository guidance when the active Copilot surface supports agent instructions.

- Inspect nearby code and conventions before editing.
- Keep changes focused and do not modify unrelated files.
- Documentation content lives under `/docs` and includes both Markdown and MDX.
- Bun is the canonical package manager; `bun.lock` is the dependency lockfile.
- Treat auth, deployment, CI/CD, framework configuration, environment, and dependency changes as sensitive; explain risks and validate carefully when explicitly requested.
- Do not add dependencies, skills, hooks, MCP integrations, custom agents, or instruction layers without explicit approval.
