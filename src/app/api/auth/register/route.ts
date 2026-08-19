/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { checkRateLimit, sanitizeEmail, sanitizeString, validatePasswordStrength } from '@/lib/security';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 5 registration attempts per minute per IP
    const rateLimit = checkRateLimit(req, {
      limit: 5,
      windowMs: 60 * 1000,
      keyPrefix: 'auth-register',
    });
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const body = await req.json();
    const { fullName: rawName, email: rawEmail, phone: rawPhone, password } = body;

    // 2. Input Sanitization & Validation
    const fullName = sanitizeString(rawName);
    const phone = sanitizeString(rawPhone);
    const { valid: emailValid, email } = sanitizeEmail(rawEmail);

    if (!fullName || !emailValid || !phone || !password) {
      return NextResponse.json(
        { error: 'Valid fullName, valid email address, phone, and password are required.' },
        { status: 400 }
      );
    }

    // 3. Password Strength Enforcement
    const pwdCheck = validatePasswordStrength(password);
    if (!pwdCheck.valid) {
      return NextResponse.json(
        { error: pwdCheck.message || 'Password does not meet strength requirements.' },
        { status: 400 }
      );
    }

    // 4. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    // 5. Create applicant user securely
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash: hashPassword(password),
        role: 'applicant', // default role always enforced
        isVerified: false,
      },
    });

    // 6. Sign secure token
    const token = signToken({ userId: newUser.id, role: newUser.role });

    // 7. Set secure HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // 8. Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: newUser.id,
          action: 'register',
          entity: 'User',
          entityId: newUser.id,
        },
      });
    } catch (auditErr) {
      console.warn('Audit log creation error:', auditErr);
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Registration could not be completed. Please check your details and try again.' },
      { status: 500 }
    );
  }
}
