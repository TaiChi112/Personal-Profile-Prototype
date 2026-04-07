# Prisma 6 to Prisma 7 Migration Checklist

This checklist is specific to this repo. The project is currently stable on Prisma 6, so treat this as a separate migration task and not a refactor mixed into feature work.

## Phase 1: Baseline and backup

- [ ] Confirm the current Prisma 6 state builds cleanly.
- [ ] Back up the current `prisma/migrations` folder.
- [ ] Keep the existing DB backup or a clean local restore path.
- [ ] Freeze feature work while the migration is in progress.

## Phase 2: Upgrade Prisma packages

- [ ] Upgrade `prisma` and `@prisma/client` to Prisma 7-compatible versions.
- [ ] Add the PostgreSQL driver adapter package required by Prisma 7.
- [ ] Review the Prisma 7 upgrade guide before changing code.
- [ ] Regenerate lockfile and verify install works on Windows and CI.

## Phase 3: Update Prisma config

- [ ] Move the Prisma CLI config to the Prisma 7 style expected by the new version.
- [ ] Keep schema and migrations paths explicit in `prisma.config.ts`.
- [ ] Move datasource connection handling into config if the target Prisma 7 setup requires it.
- [ ] Keep the seed command defined in config.

## Phase 4: Update Prisma client initialization

- [ ] Replace the current `new PrismaClient()` pattern with the Prisma 7 adapter-based client initialization if required by the final target version.
- [ ] Keep the singleton pattern on the server.
- [ ] Verify there is still only one Prisma client instance during development hot reload.
- [ ] Ensure server utilities still import from the same central client module.

## Phase 5: Validate schema compatibility

- [ ] Re-run schema validation after the version bump.
- [ ] Review whether the `User` and `Post` models need any Prisma 7 syntax adjustments.
- [ ] Check relation names, indexes, defaults, and timestamps.
- [ ] Confirm migration SQL is still correct.

## Phase 6: Re-run database migration flow

- [ ] Run `prisma migrate dev` on a clean dev database.
- [ ] Confirm migrations apply without drift.
- [ ] Re-run `prisma generate` after the new schema is in place.
- [ ] Re-seed the database.

## Phase 7: Fix app integration points

- [ ] Re-test all Prisma-backed routes.
- [ ] Re-test NextAuth sign in, sign out, and session hydration.
- [ ] Re-test the protected admin routes.
- [ ] Re-test the role-based posts flow.
- [ ] Re-run the HTTP integration scripts.

## Phase 8: Update CI and deployment

- [ ] Ensure CI installs the new Prisma dependencies.
- [ ] Ensure CI runs migrations, seed, auth-db integration, and HTTP integration.
- [ ] Ensure the app starts with the correct runtime and database variables.
- [ ] If deployed to Vercel or similar, verify the production env variables and runtime are compatible with Prisma 7.

## Phase 9: Final verification

- [ ] Run `bun run check:locale-keys`.
- [ ] Run `bun run build`.
- [ ] Run `bun run integration:auth-db`.
- [ ] Run `bun run integration:http-crud`.
- [ ] Run `bun run integration:http-admin-users`.
- [ ] Verify the app works on a clean local restart.

## Recommended order for this repo

1. Upgrade Prisma packages.
2. Update `prisma.config.ts` and Prisma client initialization.
3. Adjust `schema.prisma` only if Prisma 7 requires it.
4. Re-run migrations and client generation.
5. Re-test auth, protected routes, and CRUD flows.
6. Update CI last.

## Rollback plan

- [ ] Keep the current Prisma 6 branch/state intact until Prisma 7 is proven stable.
- [ ] If the migration fails, revert package versions first.
- [ ] Restore the previous migration folder and re-run generation.
- [ ] Keep the Prisma 6 setup documented as the fallback path.
