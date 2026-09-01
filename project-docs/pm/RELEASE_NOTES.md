# Release Notes

**Project Name:** Personal Profile Prototype (taichi112.works)  

---

## v0.1.0 (2026-08-30)

This is a major stabilization release focusing on architecture refactoring, documentation architecture (Docs-as-Code), and eliminating technical debt to prepare the platform for the upcoming AI Assistant integration (Phase 4).

### 🎉 Features & Enhancements
- **SDLC Documentation:** Established a complete `project-docs/` structure containing PRD, Architecture, Design System, Test Plans, and User Manuals following industry standards.
- **Admin Dashboard & Lead Tracking:** Finalized the `/admin/resume` protected route. The system now securely validates the owner's email via NextAuth and displays `ResumeDownloadLead` entries stored in PostgreSQL.
- **Fumadocs Integration Fixes:** 
  - Removed the deprecated SPA `DocsSection` mock.
  - Implemented a clean redirect from `/docs` to the default Fumadocs i18n route (`/en/docs`).
  - Fixed relative path resolutions in the Fumadocs Bento Box UI (`index.mdx`) so internal links route correctly across languages.

### 🐛 Bug Fixes & Technical Debt
- **Type Safety (Option A Completed):** Audited the test suites and completely removed all `@typescript-eslint/no-explicit-any` violations. The codebase now passes a 100% strict TypeScript linting check.
- **Accessibility (a11y):** Resolved critical WCAG 2.1 AA color contrast violations in `HeroSection.tsx`, specifically adjusting `text-gray-500` against light backgrounds to ensure optimal readability.

### 🔮 Coming Soon (Phase 4)
- **AI Portfolio Assistant:** A chat-based interface allowing visitors to interrogate the portfolio and learn more about the candidate's skills interactively.
