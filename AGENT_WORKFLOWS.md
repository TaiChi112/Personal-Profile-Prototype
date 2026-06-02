# Agent Workflows

## 1. Purpose

This file provides portable procedures for recurring AI-assisted repository work.
It is designed for Codex, Claude Code, GitHub Copilot, Cursor, Windsurf, Kiro,
and future coding agents.

Read `AGENTS.md` for repository policy and `PROJECT_STRUCTURE.md` for boundary
guidance before using these procedures. This file does not replace either one.

## 2. When to Use This File

Use this file when a task includes repeated Git or pull-request steps, such as:

- auditing changes without editing
- applying a narrowly scoped fix
- cleaning up one lint group
- updating an approved dependency
- making a docs-only change
- publishing, checking, merging, syncing, and cleaning up a branch

Reusable prompt templates live under `prompts/agent-workflows/`.

## 3. Workflow Modes

| Mode | Use when | Expected outcome |
|---|---|---|
| Audit-only | The user wants evidence, risks, or a commit plan | Inspect and report. Do not modify, stage, commit, or push. |
| Scoped PR lifecycle | One approved task group should be implemented and published | Create one branch, change only approved files, validate, commit, push, and open one PR. |
| Batch cleanup | A larger debt area must be reduced incrementally | Select one small low-risk group and publish it separately. Do not fix the whole backlog at once. |
| Stop-and-report | A safety gate fails or the correct behavior is unclear | Stop before broadening scope. Report the blocker, current state, and lowest-risk next action. |

## 4. Standard PR Lifecycle

Use one task group, one branch, and one pull request.

1. Read `AGENTS.md` and `PROJECT_STRUCTURE.md`.
2. Run `git status --short` and `git branch --show-current`.
3. Start from clean `main`, then run `git pull --ff-only`.
4. Create a descriptive branch for the single task group.
5. Inspect the target files and confirm the allowed file list.
6. Implement the smallest complete change.
7. Run task-appropriate validation.
8. Run `git diff --check` and review `git status --short`.
9. Stage only approved files with explicit paths.
10. Confirm the staged set with `git diff --cached --name-status`.
11. Commit with a focused message.
12. Push the branch and create a PR targeting `main`.
13. Inspect PR checks, reviews, and actionable comments.
14. Merge only when the PR is open, mergeable, fully green, and has no formal
    requested-changes review.
15. Switch to `main`, run `git pull --ff-only`, and confirm a clean tree.
16. Delete only the safely merged local branch. Keep the remote branch unless
    the user explicitly authorizes deletion.

## 5. Universal Stop Gates

Stop and report before continuing when:

- the working tree is not clean before a new task branch is created
- changed or staged files fall outside the approved scope
- a build fails with a real application, type, or runtime error
- a pull-request check is pending, failing, or cancelled
- a formal requested-changes review exists
- production, deployment, database, authentication, or secret handling is
  uncertain
- completing the task would require unapproved dependency or lockfile changes
- the correct behavior is ambiguous

Environment-only failures may be retried conservatively without changing
repository files. Report the retry and any temporary environment setting used.

## 6. Validation Matrix

| Change type | Minimum validation |
|---|---|
| Docs-only prose or repository guidance | Review diff, run `git diff --check`, and preview when practical |
| Docs metadata, navigation, or rendering integration | Run `git diff --check`, preview affected routes, and run `bun run build` |
| Application TypeScript or React | Run targeted validation when useful, `git diff --check`, `bun run lint`, and `bun run build` |
| Dependency security update | Inspect exact versions, update only approved dependencies with Bun, review `package.json` and `bun.lock`, run `git diff --check`, `bun run lint`, and `bun run build` |
| Deployment or CI/CD | Define a task-specific validation plan before editing; include syntax checks where available |
| Database schema or migration | Follow the migration workflow in `AGENTS.md`, inspect generated SQL, and run relevant build and database checks |
| Lint cleanup | Capture the baseline, fix one approved lint group, rerun targeted lint, run `git diff --check`, `bun run build`, and rerun full lint to report remaining debt |

Existing unrelated lint debt may be reported without being fixed when the task
scope explicitly excludes it.

## 7. PR Body Template

```markdown
## Summary
- Describe the focused change.
- State the repository boundary or behavior affected.

## Validation
- `git diff --check` passed.
- List task-specific validation results.

## Notes
- State important exclusions.
- State any known unrelated debt or follow-up work.
```

## 8. Final Report Template

Report:

1. Branch name.
2. Commit hash.
3. PR URL and number.
4. Files changed.
5. Exact change summary.
6. Validation results.
7. Remaining known debt or risks.
8. Check and review status.
9. Whether the PR was merged.
10. Merge commit hash, when merged.
11. Final branch and `git status --short`.
12. Local branch cleanup result, when applicable.

## 9. Change Isolation Rules

- Use one task group, one branch, and one PR.
- Never mix dependency or security updates with unrelated lint, code, docs, or
  repository-policy changes.
- Never stage with broad patterns when explicit file paths are available.
- Treat unrelated working-tree changes as user-owned work.
- Do not create tool-specific skills, hooks, slash commands, MCP servers, or
  custom agents without explicit approval.
