# Docs-Only Change Prompt

Read `AGENTS.md`, `PROJECT_STRUCTURE.md`, and `AGENT_WORKFLOWS.md` first.

Docs task: `<task>`

Allowed files:
- `<path>`

Goal:
1. Start from clean `main` and create branch `<branch>`.
2. Inspect nearby conventions and the rendered path when relevant.
3. Modify only approved documentation or repository-guidance files.
4. Run `git diff --check`.
5. Preview affected routes when practical.
6. Run `bun run build` for navigation, metadata, rendering integration, or
   repository-wide guidance changes when requested.
7. Stage only explicit allowed paths, commit, push, and create a PR.
8. Inspect PR checks and reviews. Do not merge unless explicitly requested.

Do not modify runtime code, dependencies, generated files, or deployment files
unless the task explicitly authorizes them.

Report files changed, validation, PR URL, check status, final branch, and final
`git status --short`.
