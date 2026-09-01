# Product Requirements Document (PRD)

**Project Name:** Personal Profile Prototype (taichi112.works)  
**Version:** 1.0  
**Status:** In Progress  
**Author:** Product Management / Agentic AI  
**Last Updated:** 2026-08-29  

---

## 1. Executive Summary & Objective

**Personal Profile Prototype** is a modern, highly optimized personal software platform built with Next.js, TypeScript, and Prisma. It serves as a unified digital identity, showcasing professional experiences, learning artifacts, and technical documentation. 

The primary objective is to evolve the project into a **maintainable, AI-agent-integrated software platform** that not only presents a digital resume but also acts as an educational hub (via Fumadocs) and a demonstration of standard Software Development Life Cycle (SDLC) best practices.

## 2. Target Audience & Personas

1. **Recruiters & Hiring Managers (The Evaluators):**
   - *Goal:* Quickly assess the candidate's skills, download resumes, and verify real-world implementation of complex architectures.
   - *Needs:* Clear UI, fast loading times, and a seamless resume download experience.
2. **Developers & Technical Peers (The Explorers):**
   - *Goal:* Read technical documentation, explore codebase patterns, and learn from design decisions.
   - *Needs:* Well-structured documentation (Fumadocs), clean code structure, and deep-dive technical articles.
3. **The Owner (Admin):**
   - *Goal:* Track who downloads the resume, manage content, and act as the single source of truth for all technical knowledge.
   - *Needs:* Secure Admin Dashboard, analytics tracking, and automated deployment pipelines.

## 3. Problem Statement

Traditional portfolios are static and fail to demonstrate a candidate's full capability in building full-stack, production-ready applications. Additionally, scattered technical notes across different platforms (Notion, Obsidian, Medium) make it difficult to maintain a centralized knowledge base.

**Solution:** A centralized Next.js application that integrates a dynamic resume, a lead-generation system (for resume downloads), and a structured documentation engine (Fumadocs) to house all technical knowledge in one place.

## 4. Scope

### In-Scope (Phase 1 - Phase 4)
- Responsive, accessible Web UI using Tailwind CSS and Bento layouts.
- Dynamic Resume Builder with PDF Export capabilities.
- Lead Generation system tracking resume downloads (`ResumeDownloadLead`) via PostgreSQL.
- Admin Dashboard to view leads and analytics (Role-based access via NextAuth).
- Fumadocs integration for Markdown/MDX-based technical documentation.
- AI Assistant / Agent Integration (Phase 4) for interacting with the portfolio content.
- Strict CI/CD, linting, and accessibility compliance (Lighthouse, Axe-core).

### Out-of-Scope
- E-commerce or paid subscription features.
- Full-blown CMS UI for writing documentation (Markdown files via GitHub is sufficient).
- Native iOS/Android applications.

## 5. Functional Requirements (Features)

| ID | Feature | Description | Priority | Status |
|---|---|---|---|---|
| F01 | **Homepage (Bento UI)** | A dynamic bento-box style layout summarizing skills, projects, and current status. | High | Done |
| F02 | **Fumadocs Engine** | MDX-based documentation system supporting multiple categories (Computer Science, Business) and i18n routing (`/en/docs`). | High | Done |
| F03 | **Resume Export** | Ability for users to view and export a professional resume to PDF. | High | Done |
| F04 | **Lead Tracking** | Store user data (email, name, purpose) in PostgreSQL when they download the resume. | Medium | Done |
| F05 | **Admin Dashboard** | Protected route (`/admin/resume`) to view download metrics. Requires Owner authentication. | Medium | Done |
| F06 | **AI Assistant** | An integrated LLM chat interface capable of answering questions based on the portfolio and docs. | High | Planned (Phase 4) |

## 6. Non-Functional Requirements

- **Strict Typing:** 100% strict TypeScript. The use of `any` or `unknown` as a bypass is strictly forbidden.
- **Performance:** Minimum Lighthouse Performance score of 90+. Core Web Vitals (LCP, CLS, FID) must pass Google's standards.
- **Accessibility:** Must pass Axe-core WCAG 2.1 AA standards (e.g., proper color contrast, ARIA labels).
- **Security:** 
  - Routes like `/admin` must be protected by NextAuth session validation.
  - Environment variables must never be exposed to the client unless explicitly required (`NEXT_PUBLIC_`).
- **Data Integrity:** Prisma migrations must be strictly version-controlled. 

## 7. UI/UX Considerations

- **Design Philosophy:** Minimalist, clean, and professional. Avoid overly complex "AI-generated" aesthetics (excessive icons, neon themes).
- **Dark/Light Mode:** Full support across all components.
- **Consistency:** SSOT (Single Source of Truth) validation for UI elements across Mobile and Desktop breakpoints.

## 8. Success Metrics & KPIs

1. **Engagement:** Average time spent on Fumadocs articles > 2 minutes.
2. **Conversion:** Number of Resume Downloads / Leads generated per month.
3. **Quality:** 0 ESLint errors (specifically `@typescript-eslint/no-explicit-any`), 0 build warnings.
4. **Performance:** 90+ Lighthouse score on Mobile and Desktop.

## 9. Dependencies & Risks

- **Dependencies:** Next.js App Router updates, Fumadocs library updates, NextAuth v5 (beta) stability, Google OAuth configuration.
- **Risks:** 
  - Over-engineering the UI leading to degraded performance.
  - Vercel/GCP deployment environment mismatch with local Docker containers.

## 10. Future Roadmap

- **Phase 4:** AI Portfolio Assistant integration.
- **Phase 5:** Automated content generation and CI/CD enhancements.
- **Phase 6+:** Broadening the documentation to encompass all learned disciplines (Food Science, Wellness, Finance).
