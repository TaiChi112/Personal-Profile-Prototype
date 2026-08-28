---
name: update-documentation-files
description: Workflow command scaffold for update-documentation-files in Personal-Profile-Prototype.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-documentation-files

Use this workflow when working on **update-documentation-files** in `Personal-Profile-Prototype`.

## Goal

Updates or adds documentation files to provide guidance, instructions, or navigation for users and developers.

## Common Files

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `docs/**/*.mdx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or create relevant markdown or MDX documentation files (e.g., AGENTS.md, CLAUDE.md, README.md, docs/**/*.mdx).
- Commit the changes with a message describing the documentation update.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.