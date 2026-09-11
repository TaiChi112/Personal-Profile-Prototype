```markdown
# Personal-Profile-Prototype Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill provides guidance on contributing to the **Personal-Profile-Prototype** project, a TypeScript-based codebase with no detected framework. It covers coding conventions, documentation and instruction update workflows, and testing patterns. By following these patterns, contributors can ensure code consistency, maintainability, and smooth collaboration.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `profileHeader.test.ts`

### Import Style
- Use **relative imports** for referencing local modules.
  - Example:
    ```typescript
    import { getUserProfile } from './userProfile';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```typescript
    // userProfile.ts
    export function getUserProfile(id: string) { ... }
    ```

### Commit Patterns
- Use the `feat` prefix for new features.
- Commit messages are freeform, average length ~49 characters.
  - Example: `feat: add user profile header component`

## Workflows

### Update Documentation Files
**Trigger:** When adding or updating documentation, instructions, or navigation for the project.  
**Command:** `/update-docs`

1. Edit or create relevant markdown or MDX documentation files:
    - `AGENTS.md`
    - `CLAUDE.md`
    - `README.md`
    - Any file in `docs/**/*.mdx`
2. Commit your changes with a message describing the documentation update.

**Example:**
```bash
# Edit README.md or docs/intro.mdx
git add README.md
git commit -m "docs: update getting started section"
```

---

### Update Copilot and Agent Instructions
**Trigger:** When improving or synchronizing instructions for GitHub Copilot and project agents.  
**Command:** `/sync-instructions`

1. Edit `.github/copilot-instructions.md` to update Copilot guidance.
2. Edit `AGENTS.md` to update agent-specific instructions.
3. Commit both files together with a message indicating instruction updates.

**Example:**
```bash
# Edit both instruction files
git add .github/copilot-instructions.md AGENTS.md
git commit -m "chore: sync Copilot and agent instructions"
```

## Testing Patterns

- Test files use the pattern `*.test.*` (e.g., `profileHeader.test.ts`).
- Testing framework is **unknown**; check existing test files for style and structure.
- Place tests alongside implementation files or in a dedicated `tests/` directory.

**Example:**
```typescript
// profileHeader.test.ts
import { renderProfileHeader } from './profileHeader';

test('renders user name', () => {
  // ...test implementation
});
```

## Commands

| Command          | Purpose                                                    |
|------------------|------------------------------------------------------------|
| /update-docs     | Update or add documentation files (README, AGENTS, docs)   |
| /sync-instructions | Synchronize Copilot and agent instruction files           |
```
