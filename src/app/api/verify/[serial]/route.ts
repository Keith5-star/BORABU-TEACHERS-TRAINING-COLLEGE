/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit, sanitizeString } from '@/lib/security';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    // 1. Rate Limiting: Max 20 verification checks per minute per IP
    const rateLimit = checkRateLimit(req, {
      limit: 20,
      windowMs: 60 * 1000,
      keyPrefix: 'verify-serial',
    });
    if (!rateLimit.allowed && rateLimit.errorResponse) {
      return rateLimit.errorResponse;
    }

    const { serial } = await params;
    const cleanSerial = sanitizeString(serial);

    if (!cleanSerial || cleanSerial.length > 50) {
      return NextResponse.json(
        { verified: false, error: 'Invalid verification serial format.' },
        { status: 400 }
      );
    }
    
    // Normalize underscores back to slashes if needed
    const normalizedSerial = cleanSerial.replace(/_/g, '/');

    const letter = await prisma.admissionLetter.findFirst({
      where: {
        OR: [
          { serialNumber: normalizedSerial },
          { serialNumber: cleanSerial },
        ]
      },
      include: {
        application: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
            programme: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!letter) {
      return NextResponse.json(
        { verified: false, error: 'No matching admission letter was found in our database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      verified: true,
      serialNumber: letter.serialNumber,
      applicantName: letter.application.user.fullName,
      programmeName: letter.application.programme.name,
      programmeCode: letter.application.programme.code,
      issuedAt: letter.issuedAt,
      reportingDate: letter.reportingDate,
    });
  } catch (error: any) {
    console.error('Verify serial error:', error);
    return NextResponse.json(
      { verified: false, error: 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
