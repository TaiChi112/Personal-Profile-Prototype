---
name: Prisma 6 → 7 Migration
about: Migrate the project from Prisma 6 to Prisma 7 following the validated upgrade path
title: "Prisma: Upgrade from v6 to v7"
labels: ["enhancement", "database", "prisma"]
assignees: []
---

## Overview

Upgrade this project from Prisma 6 (6.16.2) to Prisma 7 following the migration path in [docs/global/prisma-v6-to-v7-migration-checklist.md](../../docs/global/prisma-v6-to-v7-migration-checklist.md). This is a breaking change that spans packages, config, client initialization, and database adapter expectations. **Do not mix feature work with this migration.**

### Pre-migration status
- Branch: `main` (Prisma 6 stable)
- Packages: `prisma@6.16.2`, `@prisma/client@6.16.2`
- State: All tests passing, build succeeds, seed works, integrations validated

### Target state
- Packages: Prisma 7+ with PostgreSQL adapter
- Config: Prisma 7 style in `prisma.config.ts`
- Client: Adapter-based initialization in `lib/prisma.ts`
- Schema: Connection URL removed from datasource
- Tests: All integrations re-validated on new version

---

## Phase 1: Baseline and Backup

- [ ] Confirm `bun run build` succeeds on current state
- [ ] Backup current `prisma/migrations` folder
- [ ] Ensure local database has clean restore path
- [ ] Freeze feature work; migration is isolated

**Commit:** `chore: backup Prisma 6 stable baseline before v7 migration`

---

## Phase 2: Upgrade Prisma Packages

- [ ] Review [Prisma 7 official upgrade guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-to-prisma-5)
- [ ] Upgrade `prisma` and `@prisma/client` to Prisma 7 (e.g., `7.0.0` or latest)
- [ ] Add PostgreSQL driver adapter: `@prisma/adapter-pg` (or equivalent for Prisma 7)
- [ ] Run `bun install` and verify lockfile updates
- [ ] Verify install succeeds on Windows and WSL

**Commit:** `chore: upgrade prisma, @prisma/client, and add @prisma/adapter-pg`

---

## Phase 3: Update Prisma Config

- [ ] Review current `prisma.config.ts` (already centralized)
- [ ] Adjust config format if Prisma 7 CLI expectations changed
- [ ] Keep schema and migrations paths explicit
- [ ] Keep seed command defined
- [ ] Run `prisma --version` to confirm CLI recognizes new version

**Commit:** `chore: update prisma.config.ts for Prisma 7`

---

## Phase 4: Update Client Initialization & Schema

- [ ] Update `lib/prisma.ts` to use Prisma 7 adapter-based pattern
- [ ] Keep singleton and dev hot-reload protection
- [ ] Import adapter: `import { PrismaPg } from "@prisma/adapter-pg"` (or as per docs)
- [ ] Initialize client with adapter instance
- [ ] Remove `url = env("DATABASE_URL")` from `prisma/schema.prisma` datasource

**Commit:** `feat: migrate PrismaClient to Prisma 7 adapter-based initialization`

---

## Phase 5: Validate Schema & Re-generate

- [ ] Run `prisma validate` to ensure schema is Prisma 7 compatible
- [ ] Run `prisma generate` to re-generate types
- [ ] Review User/Post models; adjust if Prisma 7 syntax differs
- [ ] Commit any schema adjustments

**Commit:** `chore: regenerate Prisma client types for v7`

---

## Phase 6: Database Migration & Seed

- [ ] Create clean local database or restore backup
- [ ] Run `bun run prisma:migrate:dev` (or equivalent)
- [ ] Confirm migrations apply without drift
- [ ] Run `bun run prisma:seed`
- [ ] Verify seed output: `[seed] completed, users=X, posts=Y`

**Commit:** `chore: apply prisma migrations and re-seed for v7`

---

## Phase 7: Application Integration

- [ ] Start dev server: `bun run dev`
- [ ] Test OAuth sign-in manually (if using Google OAuth)
- [ ] Test NextAuth session flow with test credentials
- [ ] Verify database queries in routes work

**Commit:** `test: validate app routes and auth flow with Prisma 7`

---

## Phase 8: Integration Test Suite

- [ ] Run `bun run integration:auth-db` → should pass
- [ ] Run `bun run integration:http-crud` → should pass
- [ ] Run `bun run integration:http-admin-users` → should pass
- [ ] Fix any query or session-related issues in integration scripts
- [ ] All three should report success before proceeding

**Commit:** `test: all Prisma 7 integration tests passing`

---

## Phase 9: Build & CI

- [ ] Run `bun run typecheck` → should pass strict mode
- [ ] Run `bun run build` → should compile all routes
- [ ] Update `.github/workflows/ci.yml` if needed (new package versions, runtime changes)
- [ ] Push upgrade branch and verify CI runs successfully
- [ ] All CI checks (build, typecheck, seed, integrations) should pass

**Commit:** `chore: update ci.yml for Prisma 7 runtime`

**Commit:** `chore: prisma 7 upgrade complete and tested`

---

## Rollback Plan

If migration fails at any phase:

1. Reset to `main` or the nearest stable commit
2. Revert package versions to Prisma 6
3. Restore backed-up migrations folder
4. Run `bun install` to restore lockfile
5. Re-run `bun run prisma:migrate:dev` and `bun run prisma:seed`
6. Confirm all tests pass on Prisma 6 again

---

## Testing Checklist

- [ ] `bun run typecheck` passes
- [ ] `bun run build` succeeds (0 errors)
- [ ] `bun run prisma:seed` completes with expected user/post count
- [ ] `bun run integration:auth-db` passes
- [ ] `bun run integration:http-crud` passes
- [ ] `bun run integration:http-admin-users` passes
- [ ] Dev server starts and OAuth/credentials login works
- [ ] CI pipeline passes all checks

---

## Reference Materials

- [Current migration checklist](../../docs/global/prisma-v6-to-v7-migration-checklist.md)
- [File-by-file comparison](../../docs/global/prisma-stable-vs-target.md)
- [Prisma 7 official upgrade guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-to-prisma-5)
- [Prisma adapter documentation](https://www.prisma.io/docs/orm/overview/databases/using-adapters)

---

**Note:** This issue serves as both documentation and tracking. Each phase should be a separate commit with clear messages. Once all phases complete and tests pass, merge the upgrade branch into `main` with a final commit summarizing the upgrade.
