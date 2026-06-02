# Scoped PR Lifecycle Prompt

Read `AGENTS.md`, `PROJECT_STRUCTURE.md`, and `AGENT_WORKFLOWS.md` first.

Task group: `<task>`

Allowed files:
- `<path>`

Goal:
1. Start from clean `main`.
2. Run `git pull --ff-only`.
3. Create branch `<branch>`.
4. Inspect and modify only the allowed files.
5. Run `<validation commands>`.
6. Stop if validation fails, scope expands, or behavior is ambiguous.
7. Stage only explicit allowed paths and confirm with
   `git diff --cached --name-status`.
8. Commit with `<commit message>`.
9. Push and create a PR targeting `main`.
10. Inspect checks, reviews, and actionable comments.
11. Merge only if checks pass, the PR is mergeable, and there is no formal
    requested-changes review.
12. If merged, sync `main` and delete only the safely merged local branch.

Do not delete remote branches. Do not broaden the task.

Report branch, commit, PR URL, files changed, validation, checks, merge result,
final branch, and final `git status --short`.
