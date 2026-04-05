# Prisma 6 Baseline State (Frozen)

This document freezes the Prisma 6 stable state before the `upgrade/prisma-7` branch migration.

## Locked Versions

```
prisma: 6.16.2
@prisma/client: 6.16.2
typescript: 5.9.3
next-auth: 4.24.13
```

## Configuration State

### prisma/schema.prisma
- Datasource includes: `url = env("DATABASE_URL")`
- Provider: `postgresql`
- Models: User, Post with relations and auth fields

### prisma.config.ts
- Centralized Prisma CLI config
- Seed command: `bun prisma/seed.ts`
- Uses `dotenv/config` for env loading

### lib/prisma.ts
- Singleton PrismaClient pattern
- Dev hot-reload protection with `global.prisma`
- Constructor: `new PrismaClient()`

## Verified Working State

✅ Build: `bun run build` succeeds  
✅ Typecheck: `bun run typecheck` passes strict mode  
✅ Seed: `bun run prisma:seed` completes with users=3, posts=2  
✅ Integration Auth+DB: `bun run integration:auth-db` passes  
✅ Integration HTTP CRUD: `bun run integration:http-crud` passes  
✅ Integration Admin Users: `bun run integration:http-admin-users` passes  
✅ App: Dev server starts without errors  

## Prisma 6 Migrations

Current migrations are in `prisma/migrations/`:
- Initial User and Post models with relations
- All migrations applied successfully to development database

## Expected Changes in Prisma 7

- Client initialization will use adapter pattern
- Schema datasource will not include `url` field
- Config may require adjustments for new CLI style
- Thread pool and performance may improve

## Rollback Point

To rollback to this state:
```bash
git reset --hard upgrade/prisma-7~[N]  # Where N is number of commits
bun install
bun run prisma:seed
```
