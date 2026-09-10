export const prismaPoolConfig = {
  // Mocked PgBouncer transaction mode connection string (typically port 6432)
  // The pgbouncer=true query parameter is required by Prisma
  databaseUrl: 'postgresql://mock_user:mock_password@localhost:6432/mock_db?pgbouncer=true',
  
  // Mocked direct connection string (typically port 5432) 
  // Used for Prisma migrations where a direct connection is needed
  directUrl: 'postgresql://mock_user:mock_password@localhost:5432/mock_db',

  // Additional pool settings
  connectionLimit: 10,
  poolTimeout: 5,
};

export const getPrismaPoolUrl = (): string => {
  const url = process.env.DATABASE_URL || prismaPoolConfig.databaseUrl;
  
  // Check if url already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}connection_limit=${prismaPoolConfig.connectionLimit}&pool_timeout=${prismaPoolConfig.poolTimeout}`;
};

export default prismaPoolConfig;
