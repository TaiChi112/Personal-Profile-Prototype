# Database Schema Document

**Project Name:** Personal Profile Prototype (taichi112.works)  
**ORM:** Prisma  
**Database:** PostgreSQL 16  
**Last Updated:** 2026-08-29  

---

## 1. Overview

The database acts as the persistent storage for two main domains of the application:
1. **Authentication & Identity:** User accounts and OAuth connections (NextAuth).
2. **Resume Builder & Analytics:** Structured data for generating resumes (Skills, Projects, Experiences) and tracking lead generation (`ResumeDownloadLead`).

## 2. Core Entities

### Authentication Domain

- **`User` (`users`)**
  - Standard NextAuth user model.
  - Fields: `id`, `name`, `email`, `emailVerified`, `image`.
  - Relations: Owns `Account`, `Session`, `Skill`, `Project`, `Experience`, `Resume`, `Certificate`, `Award`, `Todo`.

- **`Account` (`accounts`)**
  - Handles OAuth provider linking (Google).

- **`Session` (`sessions`)** & **`VerificationToken` (`verification_tokens`)**
  - Session management and email verification logic.

### Portfolio & Resume Domain

- **`Skill` (`skills`)**
  - Represents a technical or soft skill (e.g., React, TypeScript).
  - Categorization via `category` (Frontend, Backend, etc.).

- **`Project` (`projects`)**
  - Details about portfolio projects.
  - Fields: `title`, `description`, `githubUrl`, `liveUrl`, `imageUrl`, `startDate`, `endDate`.

- **`Experience` (`experiences`)**
  - Professional work history.
  - Fields: `organization`, `role`, `description`, `achievement`.

- **`Certificate` (`certificates`)** & **`Award` (`awards`)**
  - Honors and certifications earned by the user.

- **`Resume` (`resumes`)**
  - Represents a distinct, exportable snapshot or version of a user's resume.
  - Fields: `versionName`, `targetJobTitle`, `targetCompany`, `visibility`, `status`.
  - Relations: Connects to subsets of Skills, Projects, Experiences, etc. (via associative tables like `ResumeSkill`, `ResumeProject`).

### Associative (Join) Tables
To allow dynamic assignment of skills to projects or specific items to specific resumes:
- `UserSkill`
- `ProjectSkill`
- `ExperienceSkill`
- `ResumeProject`
- `ResumeSkill`
- `ResumeExperience`
- `ResumeCertificate`
- `ResumeAward`

### Analytics & Tracking Domain

- **`ResumeDownloadLead` (`resume_download_leads`)**
  - Captures lead information when a visitor downloads the PDF resume.
  - Fields: `id`, `name`, `company`, `email`, `downloadedAt`.
  - Used heavily by the Admin Dashboard (`/admin/resume`) to track engagement and recruiter interest.

## 3. Migrations & Seed Data

### Workflow
1. **Schema Changes:** Edit `/prisma/schema.prisma`.
2. **Migration:** Run `bun run prisma:migrate:dev` to apply changes locally and generate `.sql` files.
3. **Generation:** Run `bunx prisma generate` to update the TypeScript client types.

### Seed Script
- Ensure that the database contains initial testing data or standard mock values by configuring `prisma/seed.ts` (if applicable) to avoid empty states during local development.

## 4. Security & Compliance

- Sensitive user data (like OAuth tokens) are securely hashed and managed strictly by NextAuth's Prisma Adapter.
- Read operations for public portfolio viewing do not expose internal IDs or unverified `email` addresses to the client.
- The `ResumeDownloadLead` data is protected; only users with the Admin email (hardcoded/validated in `page.tsx`) can view this table.
