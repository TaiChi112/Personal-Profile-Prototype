# Claude Code Adapter

@AGENTS.md

---

# 🛑 CRITICAL RULE: STRICT TYPESCRIPT (NO `any`)
- **NEVER use the `any` type.**
- **NEVER use `as any`.**
- The project's CI/CD has `@typescript-eslint/no-explicit-any` configured as an error. Your code will fail the build if you use `any`.
- Always define precise interfaces/types, or use `unknown` if the runtime type is truly unverified.

---

- For multi-file, architecture-sensitive, data-model, auth, or deployment-related work, present a short plan before editing.
- Do not install skills, configure MCP servers, add hooks, or change Claude permissions/settings without explicit approval.

---

**Last Updated**: 2026-05-29 | **Status**: Active
