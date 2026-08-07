---
name: Prisma Database Workflow Guidelines
description: Enforces safe and standardized workflows for database migrations and schema changes using Prisma ORM.
---

# Prisma Database Workflow Guidelines

This project uses PostgreSQL (via Neon/Supabase) and Prisma 7 for database management. You MUST adhere to these strict rules when dealing with database schemas or migrations.

## 1. Schema Changes
- Only edit `prisma/schema.prisma`.
- Do **not** use `bunx prisma db push` in production or on the main branch. 
- Use the approved workflow for applying schema changes:
  1. Modify `schema.prisma`.
  2. Run `bun run prisma:migrate:dev` to generate and apply the migration locally.
  3. Verify the generated `.sql` file inside `prisma/migrations/`.

## 2. Migration Integrity
- **NEVER** delete, rename, or manually edit applied migration `.sql` files.
- If a migration fails or is incorrect, you must generate a new migration to roll forward (fix the error), rather than modifying history.
- Do not execute production migrations without explicit user approval.

## 3. Database Connections
- The project connects to pooled PostgreSQL databases (like Neon). 
- Ensure that environment variables (e.g., `DATABASE_URL`) are loaded correctly through `.env` or CI/CD secrets.
- When generating scripts, remember to handle database disconnects properly in `finally` blocks to prevent connection leaks.
