# Master Test Plan

**Project Name:** Personal Profile Prototype (taichi112.works)  
**Last Updated:** 2026-08-30  

---

## 1. Objectives
The primary objective of this test plan is to ensure that the Personal Profile Prototype delivers a seamless, highly performant, and accessible experience for all users, while securely protecting admin data.

## 2. Scope of Testing
- **In-Scope:** UI Component rendering, Theme switching, Form submissions (Resume Leads), Authentication (NextAuth), Routing (SPA Tabs & Fumadocs), Accessibility (WCAG 2.1 AA), and Performance (Core Web Vitals).
- **Out-of-Scope:** Third-party OAuth provider uptime (Google), external database server uptime (Supabase/Neon).

## 3. Testing Strategies

### 3.1 Unit Testing
- **Tool:** Bun Test (`bun test`), React Testing Library.
- **Coverage:** Core utilities, hooks (e.g., `useContentTabMapper`), and isolated UI components.
- **Requirement:** Tests must be strictly typed (no `any` types allowed).

### 3.2 Integration Testing
- **Tool:** Bun Test (running against local DB).
- **Coverage:** API routes (`/api/leads`), database interactions (Prisma), and NextAuth session generation.

### 3.3 Accessibility (a11y) Testing
- **Tool:** Axe-core (`bunx axe`).
- **Standard:** WCAG 2.1 AA.
- **Coverage:** All public-facing pages must pass automated a11y checks with 0 violations (particularly for color contrast and ARIA labels).

### 3.4 Performance Testing
- **Tool:** Google Lighthouse (Chrome DevTools / CLI).
- **Standard:** Score of 90+ on Mobile and Desktop.
- **Coverage:** Homepage, Resume section, and Fumadocs heavy pages.

## 4. Test Environments
- **Local Development:** macOS, running `bun run dev` (Port 3000), local PostgreSQL via Docker.
- **CI/CD Pipeline:** GitHub Actions running on Ubuntu-latest (Build verification, Linting, and Tests).
- **Production:** Vercel / GCP Cloud Run.

## 5. Execution Criteria
- **Pass:** All unit tests pass, Lighthouse score > 90, 0 Axe-core violations, 0 ESLint warnings/errors.
- **Fail:** Any regression in strict typing (e.g., introduction of `any`), build failures, or unauthorized access to protected routes.
