# Scoped Lint Cleanup Prompt

Read `AGENTS.md`, `PROJECT_STRUCTURE.md`, and `AGENT_WORKFLOWS.md` first.

Target lint group:
- Files: `<paths>`
- Rules: `<rules>`

Goal:
1. Start from clean `main` and create branch `<branch>`.
2. Run `bun run lint` and capture the baseline by file and rule.
3. Confirm the targeted failures still exist.
4. Fix only the approved lint group with behavior-preserving changes.
5. Run targeted lint, `git diff --check`, `bun run build`, and full
   `bun run lint`.
6. Report unrelated remaining lint debt without fixing it.
7. Stage only the approved files, commit, push, and create a PR.
8. Inspect PR checks and reviews. Merge only if explicitly requested and safe.

Do not modify dependencies, generated files, or unrelated lint findings.

Report fixed rules, remaining lint summary, validation, PR status, final branch,
and final `git status --short`.
