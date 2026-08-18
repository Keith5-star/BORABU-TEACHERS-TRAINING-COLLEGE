import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';
import { checkRateLimit, sanitizeEmail } from '@/lib/security';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 6 login attempts per minute per IP
    const rateLimit = checkRateLimit(req, {
      limit: 6,
      windowMs: 60 * 1000,
      keyPrefix: 'auth-login',
    });
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const body = await req.json();
    const { email: rawEmail, password } = body;

    // 2. Input Validation
    const { valid: emailValid, email } = sanitizeEmail(rawEmail);

    if (!emailValid || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Valid email and password are required.' },
        { status: 400 }
      );
    }

    // 3. Look up user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 4. Verify password
    const isMatch = comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // 5. Generate secure JWT token
    const token = signToken({ userId: user.id, role: user.role });

    // 6. Set secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // 7. Security Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'login',
          entity: 'User',
          entityId: user.id,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging non-fatal error:', auditErr);
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
