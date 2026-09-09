# AI-Agent-Ready Project Standard

This document defines the standard layer for bootstrapping and maintaining an AI-agent-ready project. It outlines the required structure to ensure future AI coding agents can seamlessly interact with the repository, understand its boundaries, and follow safe contribution rules.

## Core Structure
Every future AI-ready project should include the following core files and folders:

### Canonical Memory
These files serve as the ground truth for repository policy and structure.
- `AGENTS.md`: The canonical repository guidance and policy.
- `PROJECT_STRUCTURE.md`: Defines the boundaries between production, learning, and local-only code.
- `DECISION_LOG.md`: Lightweight ADRs (Architecture Decision Records) for logging significant technical choices.

### Planning and Vision
These files align agents and humans on the project's direction.
- `PRODUCT_VISION.md`: Defines the product identity, target users, and AI integration principles.
- `AGENTIC_ARCHITECTURE.md`: Outlines the human-AI collaboration model and technical architecture.
- `ROADMAP.md`: Strategic timeline and future milestones.

### Workflows
These files define reusable procedures for agent tasks.
- `AGENT_WORKFLOWS.md`: Portable procedures for recurring Git, PR, and repository work.
- `prompts/agent-workflows/`: Reusable prompt templates (e.g., `status-and-next.md`).

### Thin Tool Adapters
These files provide tool-specific entry points without duplicating policy.
- `CLAUDE.md`: For Claude Code.
- `GEMINI.md`: For Gemini agents.
- `.github/copilot-instructions.md`: For GitHub Copilot.

## Bootstrap Guide
To bootstrap this layer after running `bun create next-app`:
1. Create the base canonical memory files (`AGENTS.md`, `PROJECT_STRUCTURE.md`).
2. Create the planning and vision files to establish context.
3. Establish the workflow procedures (`AGENT_WORKFLOWS.md`).
4. Add thin tool adapters that instruct agents to read the canonical memory first.
5. Ensure package manager policies (e.g., Bun as canonical) and linting/formatting rules are strictly defined in `AGENTS.md`.

## Anti-Patterns (What Not To Do)
- **Context Bloat**: Do not include massive logs, unstructured scratchpads, or redundant data in the standard layer.
- **Duplicate Instructions**: Do not copy rules from `AGENTS.md` into tool-specific adapters (`GEMINI.md`, `CLAUDE.md`). Adapters must remain thin.
- **Tool Lock-in**: Do not create tool-specific skills, slash commands, or MCP servers unless a repeated need is proven and explicitly approved.
- **Uncontrolled Autonomy**: Do not allow agents to execute unstructured or unsafe commands. All tasks must follow the defined `AGENT_WORKFLOWS.md` procedures and respect boundaries.
