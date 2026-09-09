# AI Software Factory - Master Prompt

**Instruction:** Copy the prompt below and paste it into your AGY CLI or Copilot CLI on the fresh remote server.

---

## 🛠️ The Master Prompt

```text
You are an expert Cloud Architect and DevOps Engineer. I want you to transform this empty remote server into a highly scalable "AI Software Factory" and testing sandbox. 

My goal is to clone, test, and tweak many different GitHub repositories here without causing dependency conflicts. I also want to use this environment for AI-driven software development (reading requirements from Google Sheets -> GitHub Issues HITL -> executing code).

Please execute the following setup sequence. Ask for my confirmation if any step requires a destructive action, `sudo` access, or a system reboot.

### Phase 1: High-Performance Infrastructure Setup
1. Update system packages (`apt-get update && apt-get upgrade -y` or equivalent).
2. Install `Docker` and `Docker Compose`. This is critical for scaling because every GitHub repo I clone will be tested inside its own isolated Docker container to avoid dependency hell.
3. Ensure my current user is added to the `docker` group so we can run containers without `sudo`.
4. Install `Git` and `GitHub CLI` (`gh`).
5. Install `Bun` globally via the official curl script. We will prioritize Bun over Node.js for extreme performance.
6. Install `Go` and `Rust` toolchains (via rustup) for compiling high-performance tools natively.

### Phase 2: Factory Workspace & Scaling Architecture
Create the following directory structure in my home directory (e.g., `~/ai-factory/`):
- `~/ai-factory/workspaces/`: The primary directory where I (or the AI) will `git clone` various repositories from GitHub.
- `~/ai-factory/docker-templates/`: Create basic reusable `Dockerfile` and `docker-compose.yml` templates for Bun, Go, and Rust. When I clone a random project, the AI can copy these templates to quickly containerize and test it.
- `~/ai-factory/mcp/`: For storing Model Context Protocol (MCP) server configurations.

### Phase 3: MCP Integrations (The AI Brain)
To automate the workflow, please set up or provide the configuration instructions for the following MCP servers:
1. **GitHub MCP Server**: Configure this so the AI agent can read/write GitHub Issues, manage PRs, and clone my starred repositories automatically.
2. **Google Drive / Sheets MCP Server**: Configure this so the AI agent can ingest structured requirements (Matrix format) and images from my clients.

### Phase 4: Initialization & Verification
1. Prompt me to run `gh auth login` to authenticate the GitHub CLI.
2. Write a quick health-check script (`bun run health-check.ts` or `check.sh`) in `~/ai-factory/` that verifies Docker is running, Bun is installed, and the directories are set up correctly.

Please proceed with Phase 1 and walk me through the setup step-by-step. Let me know when you are ready to begin.
```
