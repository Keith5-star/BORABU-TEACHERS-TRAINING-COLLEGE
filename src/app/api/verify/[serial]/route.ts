import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serial: string }> }
) {
  try {
    const { serial } = await params;
    
    // Normalize underscores back to slashes if needed
    const normalizedSerial = serial.replace(/_/g, '/');

    const letter = await prisma.admissionLetter.findFirst({
      where: {
        OR: [
          { serialNumber: normalizedSerial },
          { serialNumber: serial },
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
