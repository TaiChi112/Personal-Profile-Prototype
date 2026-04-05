import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Prisma 7 Configuration
 * 
 * This config file is the single source of truth for Prisma CLI settings.
 * Key points:
 * - Connection URL (DATABASE_URL) is in CLI datasource (for migrate, introspect, etc.)
 * - Connection URL is NOT in schema.prisma (moved to adapter pattern in client)
 * - Schema path is explicit for Prisma CLI discovery
 * - Migrations path is centralized
 * - Seed command is defined here and invoked via `prisma:seed` script
 * 
 * @see https://www.prisma.io/docs/orm/reference/prisma-schema-reference
 * @see https://www.prisma.io/docs/orm/overview/databases/using-adapters
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
});