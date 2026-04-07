# Incident Report: Google OAuth Sign-in Failure on Vercel

Date: 2026-04-06  
Repository: Personal-Profile-Prototype  
Environment: Production (Vercel)

## 1) Executive Summary
Google OAuth sign-in reached the callback successfully, but failed during the database write step in NextAuth callback logic. The app redirected to `/api/auth/error` with Prisma errors.

Primary issue was not OAuth configuration itself. The core issue was database/runtime alignment:
- Missing Prisma migration artifacts on deploy branch at first
- Runtime database URL and migration database flow needed clear separation (Pooler for runtime, Direct for migration)

After pushing migrations to remote and aligning DB connection strategy, sign-in succeeded.

## 2) User-Visible Symptoms
- Sign-in via Google opened provider flow normally
- After selecting account, app redirected to error page
- URL included Prisma callback/upsert failure details

Observed error variants:
- `Invalid prisma.user.upsert() invocation: The table public.User does not exist in the current database.`
- Earlier connectivity/TLS warnings with pg + ssl mode behavior

## 3) Impact
- OAuth login unusable in Production until fixed
- Any auth flow requiring `prisma.user.upsert()` was blocked

## 4) Root Cause Analysis
### 4.1 Immediate Cause
During NextAuth callback, code executed Prisma upsert against `User` table, but runtime DB path lacked a usable schema state for the deployed runtime path.

### 4.2 Contributing Causes
1. Prisma migration files were initially not present on remote deploy branch.
2. Branch/deploy drift: production deployed from `main`, while active local work occurred on other branches.
3. Connection strategy needed to be explicit:
   - Runtime serverless path should use Supabase Pooler URL
   - Migration path should use Supabase Direct URL
4. Environment variables are ignored in git (`.env*`), so local fixes do not automatically propagate to Vercel.

## 5) Evidence Collected
- Vercel logs showed OAuth sign-in endpoint returning 200 and callback redirects to error path.
- Prisma callback/upsert error indicated table mismatch (`public.User` missing).
- Remote tree check initially showed missing `prisma/migrations` on deploy branch.
- Local DB verification via Prisma CRUD script succeeded after TLS-compatible URL params.

## 6) Corrective Actions Performed
1. Added and pushed Prisma migration files to remote:
   - `prisma/migrations/20260405091319_add_auth_user_model/migration.sql`
   - `prisma/migrations/20260405092652_align_prisma_nextjs_structure/migration.sql`
   - `prisma/migrations/migration_lock.toml`
2. Ensured migration commit was present on both:
   - `main` (production deploy branch)
   - `upgrade/prisma-7`
3. Applied migration against Direct URL:
   - `prisma migrate deploy` (result: no pending migrations)
4. Standardized runtime URL strategy in production env reference:
   - Pooler URL with `pgbouncer=true`, `connection_limit=1`, `sslmode=require`, `uselibpqcompat=true`
5. Re-validated with Prisma CRUD smoke test.

## 7) Final Resolution
Google OAuth sign-in now succeeds after branch synchronization, migration publication, and DB/runtime connection alignment.

## 8) What Was NOT the Root Cause
- Node deprecation warning (`url.parse()` / DEP0169) was noisy but not the blocking cause.
- OAuth provider setup was not the primary blocker once callback reached Prisma write stage.

## 9) Preventive Actions
1. Enforce migration presence in CI:
   - Fail build if schema changed but no migration files are present.
2. Add deployment gate:
   - Verify Prisma migrations exist on deploy branch before release.
3. Add branch policy:
   - Deploy from one clearly declared production branch.
4. Document env ownership:
   - Local `.env*` for development only
   - Vercel dashboard env as runtime source of truth
5. Keep DB URL split policy explicit:
   - Runtime: Pooler
   - Migrations/seed/admin jobs: Direct

## 10) Runbook (Quick Future Checklist)
1. Confirm deploy branch and latest commit in Vercel.
2. Confirm `prisma/migrations/*` exists on remote deploy branch.
3. Run `prisma migrate deploy` against Direct URL.
4. Set Vercel `DATABASE_URL` to Pooler URL for runtime.
5. Redeploy without cache.
6. Validate `/api/auth/callback/google` logs for latest attempt.

## 11) Security Follow-up
Because secrets were exposed during troubleshooting, rotate immediately:
- Database password/connection string
- Google OAuth client secret
- NextAuth secret
- Any test/admin passwords

---
Report generated after incident closure for future operations and onboarding.
