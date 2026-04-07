# Prisma 6 Stable vs Prisma 7 Target for This Repo

This file compares the current stable setup in this repo with the target shape if the project is upgraded to the latest Prisma line.

## Short conclusion

- Keep Prisma 6 stable until the upgrade window is planned.
- Treat Prisma 7 as a separate migration because it changes config, client initialization, and database adapter expectations.
- Do not mix feature work with the Prisma version jump.

## File-by-file comparison

| File | Prisma 6 stable now | Prisma 7 target | Action |
|---|---|---|---|
| [package.json](../../package.json) | Uses `prisma` and `@prisma/client` 6.16.2, plus scripts for generate, seed, migrate, and integration | Should move both Prisma packages together to Prisma 7 compatible versions; may need adapter packages | Upgrade versions together and re-check scripts |
| [prisma.config.ts](../../prisma.config.ts) | Holds schema path and migrations seed command; uses `dotenv/config` for CLI env loading | Should become the Prisma 7 config source of truth with explicit datasource configuration if required by the final target setup | Keep config centralized; revise for Prisma 7 config semantics when upgrading |
| [prisma/schema.prisma](../../prisma/schema.prisma) | Includes `datasource db { provider = "postgresql" url = env("DATABASE_URL") }`, which Prisma 6 CLI still expects | Prisma 7 docs indicate connection URL should move away from schema into config/client-adapter setup | Remove `url` only after the Prisma 7 client/config path is fully in place |
| [lib/prisma.ts](../../lib/prisma.ts) | Singleton `new PrismaClient()` pattern, server-only | Prisma 7 may require adapter-based client initialization for PostgreSQL | Replace the constructor with the adapter-based client when upgrading |
| [app/lib/prisma.ts](../../app/lib/prisma.ts) | Compatibility re-export to root Prisma client | Likely keep as a wrapper or remove if client module structure changes | Adjust only if the client entry point changes |
| [app/lib/auth.ts](../../app/lib/auth.ts) | NextAuth sign-in callback persists users; jwt/session callbacks map DB user into session | Should keep the auth flow but verify Prisma queries still work after the client upgrade | Re-test auth callbacks after upgrade |
| [app/api/users/route.ts](../../app/api/users/route.ts) | Admin-protected CRUD route using server-side session checks | Should keep working if Prisma client API stays compatible | Re-run integration tests after upgrade |
| [app/api/users/[id]/route.ts](../../app/api/users/[id]/route.ts) | Admin-protected CRUD route for single user operations | Same as above | Re-run integration tests after upgrade |
| [app/api/posts/route.ts](../../app/api/posts/route.ts) | Authenticated read, admin write | Same as above | Re-run integration tests after upgrade |
| [app/api/posts/[id]/route.ts](../../app/api/posts/[id]/route.ts) | Authenticated read, admin write/delete | Same as above | Re-run integration tests after upgrade |
| [prisma/seed.ts](../../prisma/seed.ts) | Bun-based seed script used by Prisma config and package scripts | Should keep working, but must be validated after migration | Re-run seed after upgrade |
| [scripts/integration-auth-db.ts](../../scripts/integration-auth-db.ts) | Verifies auth callbacks and Prisma CRUD flow | Should keep validating Prisma-backed auth and DB behavior | Re-run after upgrade |
| [scripts/integration-http-crud.ts](../../scripts/integration-http-crud.ts) | Verifies HTTP policy for posts and authenticated/unauthenticated access | Should still pass if routes and auth keep working | Re-run after upgrade |
| [scripts/integration-http-admin-users.ts](../../scripts/integration-http-admin-users.ts) | Verifies signed admin cookie flow and admin CRUD on users | Must be re-run with a real Prisma 7 runtime | Re-run after upgrade |
| [.github/workflows/ci.yml](../../.github/workflows/ci.yml) | Runs generate, migrate deploy, seed, auth-db integration, build, and HTTP integration | May need package and runtime updates for Prisma 7 plus any adapter-related setup | Update CI only after local upgrade is green |

## What changes are already aligned with the official direction

- Prisma CLI config lives in [prisma.config.ts](../../prisma.config.ts).
- Prisma Client is only created on the server in [lib/prisma.ts](../../lib/prisma.ts).
- The project already has seed, integration, and CI steps.
- The app avoids client-side Prisma usage.

## What still blocks a real Prisma 7 migration

- The current package versions are still Prisma 6.16.2.
- The current `schema.prisma` still uses `url = env("DATABASE_URL")`, which Prisma 7 style no longer wants there.
- Prisma 7 will likely require PostgreSQL adapter-based client initialization.
- The migration should be validated with a clean database and a fresh install.

## Recommended upgrade plan

1. Lock the current Prisma 6 branch as the stable baseline.
2. Create a dedicated upgrade branch.
3. Upgrade Prisma packages and adapter packages together.
4. Update config and client initialization for Prisma 7.
5. Remove the schema datasource URL only after the new path is confirmed.
6. Re-run migrations, seed, auth integration, and HTTP integration.
7. Update CI last.

## Result for this repo today

The repository is currently stable on Prisma 6 and all tests/build steps pass. The Prisma 7 target is documented and ready as a separate migration path.
