# Test Cases

**Project Name:** Personal Profile Prototype (taichi112.works)  
**Last Updated:** 2026-08-30  

---

## 1. Authentication & Authorization

| Test ID | Module | Scenario / Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-AUTH-01 | Admin | Navigate to `/admin/resume` without active session | Redirected to Home (`/`) or Login screen | ⏳ Pending |
| TC-AUTH-02 | Admin | Login with Google account NOT matching Admin email | Redirected to Home (`/`), access to Admin denied | ⏳ Pending |
| TC-AUTH-03 | Admin | Login with Google account matching Admin email | Access granted, Dashboard loads successfully | ⏳ Pending |

## 2. UI & Navigation (Portfolio SPA)

| Test ID | Module | Scenario / Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-NAV-01 | Routing | Click on "Projects" in Navbar | URL updates to `/projects`, Projects component mounts without full page reload | ⏳ Pending |
| TC-NAV-02 | Routing | Click on "Docs" in Navbar | User is redirected successfully to `/en/docs` (Fumadocs Index) | ⏳ Pending |
| TC-THEME-01 | UI | Click Theme Toggle icon | Theme switches from Light to Dark (or vice-versa), persistent on reload | ⏳ Pending |

## 3. Resume & Lead Generation

| Test ID | Module | Scenario / Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-RES-01 | Form | Submit Resume Export form with missing Email | HTML5 validation prevents submission | ⏳ Pending |
| TC-RES-02 | Form | Submit Resume Export form with valid data | 1. Toast notification "Success"<br>2. PDF download starts<br>3. `ResumeDownloadLead` saved in DB | ⏳ Pending |

## 4. Fumadocs

| Test ID | Module | Scenario / Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-DOCS-01 | i18n | Navigate to `/en/docs/computer_science` then switch language to Thai | URL changes to `/th/docs/...`, content renders in Thai | ⏳ Pending |
| TC-DOCS-02 | UI | Click on Bento Card in Docs Index | Navigates to the correct relative path without 404 errors | ✅ Pass |

## 5. Accessibility (a11y) & Code Quality

| Test ID | Module | Scenario / Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-A11Y-01 | Global | Run `bunx axe http://localhost:3000 --tags wcag2aa` | 0 Violations (Color contrast must pass) | ✅ Pass |
| TC-LINT-01 | Global | Run `bun run lint` | 0 Errors (Strictly no `any` types allowed) | ✅ Pass |
