# User Flows

**Project Name:** Personal Profile Prototype (taichi112.works)  
**Last Updated:** 2026-08-30  

---

## 1. Primary Portfolio Navigation Flow

**Actor:** General User / Recruiter  
**Goal:** Explore the candidate's skills and projects.

1. **Start:** User lands on the Root URL (`/`).
2. **Action:** Next.js middleware or layout routes the user to the `home` tab.
3. **View:** User sees the Homepage featuring the **Bento Box UI** (Summary, Skills, Experience).
4. **Action:** User clicks on navigation items (e.g., Projects, Resume, Docs).
5. **Result:** The SPA-like tab routing dynamically mounts the corresponding section without a full page reload (except for Fumadocs, which is a separate layout).

## 2. Fumadocs Educational Flow

**Actor:** Developer / Student  
**Goal:** Read technical documentation and notes.

1. **Start:** User clicks "Docs" in the navigation bar.
2. **Action:** System redirects the user to `/en/docs` (default language).
3. **View:** Fumadocs Index Page featuring categorized cards (Computer Science, Business, etc.).
4. **Action:** User clicks on a specific category (e.g., `Computer Science > Foundations`).
5. **View:** Documentation page renders with a left-hand sidebar for navigation and a right-hand table of contents.
6. **Action:** User toggles the language switch (if available) to `/th/docs`.
7. **Result:** Content is re-rendered in the Thai language.

## 3. Resume Lead Generation & Export Flow

**Actor:** Recruiter / Hiring Manager  
**Goal:** Download a PDF copy of the candidate's resume.

1. **Start:** User navigates to the "Resume" tab.
2. **Action:** User clicks the "Export PDF" or "Download Resume" button.
3. **View:** A modal appears asking for basic contact information (Name, Company, Email) to track the lead.
4. **Action:** User fills out the form and submits.
5. **System Process:**
   - Client sends POST request to `/api/leads` (or server action).
   - Server validates data and stores a `ResumeDownloadLead` record in PostgreSQL.
   - Server responds with a success status.
6. **Result:** The PDF generation script triggers, and the browser initiates the download of the PDF file. A "Thank You" toast notification is shown.

## 4. Admin Authentication & Dashboard Flow

**Actor:** System Owner (Admin)  
**Goal:** View analytics and resume download leads.

1. **Start:** Admin attempts to navigate to `/admin/resume`.
2. **Validation:** System checks for an active NextAuth session.
   - *If no session:* Redirects to the login page (or displays access denied).
3. **Action:** Admin clicks "Sign in with Google".
4. **System Process:** NextAuth handles the OAuth handshake.
5. **Validation:** Application checks if `session.user.email` matches the hardcoded authorized Admin email.
   - *If unauthorized:* Access is rejected; user sees standard views.
6. **Result:** Admin is granted access to the Dashboard and can view the list of `ResumeDownloadLead` entries, sorted by most recent.
