import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function createPoolConfig(datasourceUrl: string) {
  const parsedUrl = new URL(datasourceUrl);
  const sslmode = parsedUrl.searchParams.get('sslmode');
  const isLocalHost = parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1';
  let ssl: false | { rejectUnauthorized: boolean } | undefined;

  if (sslmode === 'disable') {
    ssl = false;
  } else if (sslmode === 'require' || !isLocalHost) {
    ssl = { rejectUnauthorized: false };
  } else {
    ssl = undefined;
  }

  return {
    host: parsedUrl.hostname,
    port: Number(parsedUrl.port || '5432'),
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ''),
    ssl,
  };
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? createPrismaClient();

function createPrismaClient() {
  const datasourceUrl = process.env.DATABASE_URL;
  if (!datasourceUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({
    ...createPoolConfig(datasourceUrl),
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma };
export default prisma;