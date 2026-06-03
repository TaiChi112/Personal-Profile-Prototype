# Workflow: Status and Next

**Goal**:
Understand the repository state, guidance, boundaries, and workflow rules, and recommend the next safest task.

**Mode**:
Audit-only.

**Rules**:
* Read the following files first:
  - `AGENTS.md`
  - `PROJECT_STRUCTURE.md`
  - `AGENT_WORKFLOWS.md`
  - `AI_PROJECT_STANDARD.md`
  - `PRODUCT_VISION.md`
  - `AGENTIC_ARCHITECTURE.md`
  - `ROADMAP.md`
  - `DECISION_LOG.md`
* Do not modify files.
* Do not stage anything.
* Do not commit anything.
* Do not push.
* Do not create branches.
* Do not install dependencies or run modifying commands.

**Steps**:
1. Run `git status --short` and `git branch --show-current`.
2. Inspect the specified guidance and planning files.
3. Summarize the current repository state and boundaries.
4. Propose the next 3 tasks, ordered by safety and value, based on current repository state, repository boundaries, workflow rules, product vision, roadmap priorities, and known debt or risks.

Stop after reporting. Do not modify files.
