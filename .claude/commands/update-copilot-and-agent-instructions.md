---
name: update-copilot-and-agent-instructions
description: Workflow command scaffold for update-copilot-and-agent-instructions in Personal-Profile-Prototype.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /update-copilot-and-agent-instructions

Use this workflow when working on **update-copilot-and-agent-instructions** in `Personal-Profile-Prototype`.

## Goal

Updates both copilot and agent instruction files to refine guidance for contributors and AI agents.

## Common Files

- `.github/copilot-instructions.md`
- `AGENTS.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit .github/copilot-instructions.md to update Copilot guidance.
- Edit AGENTS.md to update agent-specific instructions.
- Commit both files together with a message indicating instruction updates.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.