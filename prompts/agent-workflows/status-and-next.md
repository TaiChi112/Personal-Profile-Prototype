# Workflow: Status and Next

**Goal**:
Understand the repository state, guidance, boundaries, and workflow rules, and recommend the next safest task.

**Mode**:
Audit-only.

**Rules**:
* Read `AGENTS.md`, `PROJECT_STRUCTURE.md`, and `AGENT_WORKFLOWS.md` first.
* Do not modify files.
* Do not stage anything.
* Do not commit anything.
* Do not push.
* Do not create branches.
* Do not install dependencies or run modifying commands.

**Steps**:
1. Run `git status --short` and `git branch --show-current`.
2. Inspect the repository guidance files.
3. Summarize the current repository state and boundaries.
4. Propose the next 3 tasks, ordered by safety and value, based on the current state and roadmap.

Stop after reporting. Do not modify files.
