import fs from 'fs';
import path from 'path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

/**
 * Resolves the appropriate SQLite database URL and ensures target directories exist.
 * On serverless environments like Vercel or AWS Lambda, the root filesystem is read-only
 * except for /tmp. This handler copies any bundled database to /tmp/dev.db so that
 * write operations (registrations, applications, audit logs) succeed seamlessly.
 */
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  const rawUrl = envUrl || 'file:./prisma/dev.db';
  const isServerless =
    process.env.VERCEL === '1' ||
    process.env.VERCEL === 'true' ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.VERCEL_ENV;

  let relativeOrAbsPath = rawUrl.startsWith('file:')
    ? rawUrl.replace(/^file:/, '')
    : rawUrl;

  const sourcePath = path.isAbsolute(relativeOrAbsPath)
    ? relativeOrAbsPath
    : path.join(process.cwd(), relativeOrAbsPath);

  if (isServerless) {
    const tmpDir = '/tmp';
    const targetPath = path.join(tmpDir, 'dev.db');

    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // If the bundled database file exists and /tmp/dev.db doesn't, copy it over
      if (fs.existsSync(sourcePath) && !fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    } catch (err) {
      console.warn('Notice: Serverless /tmp database initialization warning:', err);
    }

    return `file:${targetPath}`;
  }

  // Standard runtime / Container / Local dev: Ensure directory exists
  try {
    const parentDir = path.dirname(sourcePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
  } catch (err) {
    console.warn('Notice: Local database directory creation warning:', err);
  }

  return `file:${sourcePath}`;
}

const resolvedDbUrl = getDatabaseUrl();

if (process.env.NODE_ENV === 'production') {
  const adapter = new PrismaBetterSqlite3({ url: resolvedDbUrl });
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    const adapter = new PrismaBetterSqlite3({ url: resolvedDbUrl });
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export { prisma };
export * from '../generated/prisma/client';
