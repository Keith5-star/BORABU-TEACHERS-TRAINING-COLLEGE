/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser, hashPassword } from '@/lib/auth';

// GET: Retrieve user profile
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        mailingAddress: true,
        kinName: true,
        kinPhone: true,
        kinRelation: true,
        mfaEnabled: true,
      },
    });

    return NextResponse.json({ user: fullUser });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error while loading profile.' },
      { status: 500 }
    );
  }
}

// PATCH: Update user profile & credentials
export async function PATCH(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      mailingAddress,
      kinName,
      kinPhone,
      kinRelation,
      password,
      mfaEnabled,
    } = body;

    const updateData: any = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (mailingAddress !== undefined) updateData.mailingAddress = mailingAddress;
    if (kinName !== undefined) updateData.kinName = kinName;
    if (kinPhone !== undefined) updateData.kinPhone = kinPhone;
    if (kinRelation !== undefined) updateData.kinRelation = kinRelation;
    
    if (mfaEnabled !== undefined) {
      updateData.mfaEnabled = mfaEnabled;
      if (mfaEnabled) {
        // Generate mock secret if enabling
        updateData.mfaSecret = 'MOCK_MFA_SECRET_KEY_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      } else {
        updateData.mfaSecret = null;
      }
    }

    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }
      updateData.passwordHash = hashPassword(password);
    }

    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        mailingAddress: true,
        kinName: true,
        kinPhone: true,
        kinRelation: true,
        mfaEnabled: true,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: sessionUser.id,
        action: 'update_profile',
        entity: 'User',
        entityId: sessionUser.id,
      },
    });

    return NextResponse.json({
      message: 'Profile settings updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error while saving settings.' },
      { status: 500 }
    );
  }
}
