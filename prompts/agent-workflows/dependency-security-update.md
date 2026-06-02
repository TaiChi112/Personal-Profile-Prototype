# Dependency Security Update Prompt

Read `AGENTS.md`, `PROJECT_STRUCTURE.md`, and `AGENT_WORKFLOWS.md` first.

Approved dependency update:
- Package: `<package>`
- Current version: `<current>`
- Target version: `<target>`

Goal:
1. Start from clean `main` and create branch `<branch>`.
2. Inspect `package.json`, `bun.lock`, and the approved package metadata.
3. Use Bun only. Update only approved existing dependencies.
4. Review exact version and lockfile changes.
5. Run `git diff --check`, `bun run lint`, and `bun run build`.
6. Stop if the update requires unrelated dependencies, application changes, or
   ambiguous migration work.
7. Stage only approved dependency files, commit, push, and create a PR.
8. Inspect PR checks and reviews. Do not merge unless explicitly requested.

Do not run npm commands, audit-fix commands, deployment commands, or database
migrations. Do not combine security remediation with unrelated cleanup.

Report versions before and after, files changed, validation, PR status, and any
expected follow-up.
