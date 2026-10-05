# Phase 2: Dual-Pane UI & Live Preview

**Status:** Backlog
**Link:** Problem Statement

---
## 1. Milestone Goal
- **The Problem:** Writing raw markdown can be difficult to visualize, and relying on the server to render previews causes unacceptable input lag.
- **The Solution:** Build a client-side dual-pane editor. The left pane accepts raw text input, while the right pane parses that local state into HTML instantly. Include a sidebar to switch between different notes.

## 2. Acceptance Criteria
- [ ] Build a sidebar component that lists all loaded notes. Clicking a note must update the active local state (`activeNoteId`, `localTitle`, `localContent`) instantly.
- [ ] Build an input header for editing the note's title, alongside explicit "Save" and "Delete" action buttons.
- [ ] Build the main dual-pane workspace: a raw `<textarea>` on the left bound to `localContent`, and a preview `div` on the right that parses `localContent` into basic HTML (e.g., converting `# Header` to `<h1>Header</h1>` and `\n` to `<br/>`).
- [ ] Wrap the `handleSave`, `handleAdd`, and `handleDelete` functions in asynchronous transition hooks, utilizing the `isPending` state to provide visual feedback (e.g., changing button text to "Saving...") and prevent spam clicks.

---
## 3. Technical Implementation Context
**[Architectural Notes for AI Execution]**
- **Libraries:** Select appropriate React state patterns (`useState`, `useTransition`) and basic regex or lightweight markdown parsing libraries based on your architecture research.
- **Execution:** Proceed autonomously based on the Agentic Architect Directive established in `00-PROBLEM-STATEMENT.md`. Map your file targets and execute step-by-step.
