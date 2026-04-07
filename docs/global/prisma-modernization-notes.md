# Prisma Modernization Notes for This Repo

This note summarizes the current official Prisma guidance and what should be improved in this project so the Prisma setup stays aligned with newer recommendations.

## What the official docs emphasize

- `prisma.config.ts` is now the main CLI configuration entry point.
- The config file should define schema location and migration path, and it can also define seed commands and datasource settings.
- Prisma Client should be created once on the server side to avoid extra connection pools during development hot reload.
- For newer Prisma versions, generated client output and driver adapters matter more, especially when moving toward Prisma 7.
- Environment variables should be loaded explicitly in the Prisma config file when needed.

## What this repo already does well

- It already has a dedicated `prisma.config.ts` file.
- It uses a server-side singleton Prisma client in [lib/prisma.ts](../../lib/prisma.ts).
- It keeps Prisma usage out of the browser and uses Prisma only from server routes and server utilities.
- It already has migration, seed, CRUD example, and integration scripts.

## What should be improved next

### 1. Decide the Prisma version strategy explicitly

The current repo is in a mixed state: it works with Prisma 6.16.x style client usage, while the latest docs are moving toward Prisma 7-style configuration and generated client flows.

Recommended decision:

- Stay on Prisma 6.16.x for now if the goal is stability.
- Or upgrade to Prisma 7 in a dedicated migration step if the goal is to follow the newest architecture.

### 2. Make `prisma.config.ts` the single source of Prisma CLI config

The repo should keep the CLI config centralized in [prisma.config.ts](../../prisma.config.ts).

Recommended additions:

- Add `migrations.seed` so seed command is defined by Prisma config, not only package scripts.
- Keep schema and migration paths there.
- If moving toward the newest Prisma config style, keep datasource config aligned with the version being used.

### 3. Keep Prisma Client creation server-only and singleton-based

The current singleton pattern is the correct direction.

Recommended rules:

- Keep Prisma client initialization only in server code.
- Do not import Prisma Client into client components.
- Keep a single development-time instance to avoid too many database connections.

### 4. If upgrading to Prisma 7, plan for driver adapters

The official client docs now highlight driver adapters for Prisma 7.

If this repo upgrades:

- Add the required adapter package for PostgreSQL.
- Create PrismaClient with the adapter instead of relying on the older constructor shape.
- Update CI and local scripts to match the new runtime expectations.

### 5. Keep schema changes and generated client in sync

Whenever `schema.prisma` changes, regenerate the client and re-run migrations.

Recommended workflow:

- Edit [prisma/schema.prisma](../../prisma/schema.prisma).
- Run `prisma migrate dev` for schema changes.
- Run `prisma generate` after any schema updates.
- Re-check integration scripts after client regeneration.

## Repository-specific recommendations

- Keep the current working server-side singleton client.
- Keep the current migration and seed scripts, but move seed configuration into `prisma.config.ts` when convenient.
- If a Prisma 7 migration is planned, do it separately from feature work so auth and CRUD changes stay stable.
- Re-run the HTTP integration scripts after every Prisma version or schema change.

## Practical conclusion

For this project, the safest path is:

1. Keep the current Prisma 6 setup stable.
2. Normalize Prisma config further in `prisma.config.ts`.
3. Treat Prisma 7 as a separate upgrade project.

That avoids mixing feature changes with a breaking Prisma architecture shift.
