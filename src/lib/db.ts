import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool as PgPool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL || '';

  // 1. Neon Serverless PostgreSQL (e.g. Vercel Neon integration)
  if (databaseUrl.includes('neon.tech')) {
    const adapter = new PrismaNeon({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
  }

  // 2. Standard PostgreSQL (e.g. Cloud SQL, Supabase, AWS RDS, Docker)
  if (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')) {
    const pool = new PgPool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }

  // 3. Fallback for local build/dev environments
  const fallbackUrl = 'postgresql://postgres:postgres@localhost:5432/borabu';
  const pool = new PgPool({ connectionString: fallbackUrl });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
export * from '../generated/prisma/client';
