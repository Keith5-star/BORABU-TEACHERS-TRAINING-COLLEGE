import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'borabu-ttc-production-secure-fallback-key-2026';

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(12); // Strengthen salt rounds to 12
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  if (!password || !hash) return false;
  return bcrypt.compareSync(password, hash);
}

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    if (!token || typeof token !== 'string') return null;
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}

export async function getSessionUser(req?: Request) {
  try {
    let token: string | undefined;

    // 1. Check Authorization: Bearer <token> header if request is provided
    if (req) {
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    // 2. Fall back to reading auth-token from cookies
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get('auth-token')?.value;
      } catch {
        // cookies() may throw in some contexts if outside request context
      }
    }

    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Requires a user session with specific allowed roles (RBAC Guard)
 */
export async function requireAuth(allowedRoles?: string[], req?: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return { authorized: false, status: 401, error: 'Authentication required. Please sign in.' };
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { authorized: false, status: 403, error: 'Forbidden: Insufficient privileges.' };
  }

  return { authorized: true, user };
}
