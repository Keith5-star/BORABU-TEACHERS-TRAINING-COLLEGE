/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateAdmissionLetterPdf } from '@/lib/pdf';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serial: string[] }> }
) {
  try {
    const { serial } = await params;
    const serialNumber = serial.join('/');
    const serialSafe = serialNumber.replace(/\//g, '_');

    // Find in database
    const letter = await prisma.admissionLetter.findFirst({
      where: {
        OR: [
          { serialNumber },
          { serialNumber: serialSafe },
        ],
      },
      include: {
        application: {
          include: {
            user: true,
            programme: true,
          },
        },
      },
    });

    if (!letter) {
      return new Response('Admission letter not found in registry database.', { status: 404 });
    }

    const lettersDir = path.join(process.cwd(), 'public', 'letters');
    const filePath = path.join(lettersDir, `${serialSafe}.pdf`);

    // Auto-generate if missing
    if (!fs.existsSync(filePath)) {
      const personal = JSON.parse(letter.application.personalDetails || '{}');
      const subjectGrades = JSON.parse(letter.application.subjectGrades || '{}');
      const feesStructure = JSON.parse(letter.application.programme.feesStructure || '[]');

      await generateAdmissionLetterPdf(letter.serialNumber, {
        applicantName: letter.application.user.fullName,
        email: letter.application.user.email,
        phone: letter.application.user.phone,
        kcseIndexNo: letter.application.kcseIndexNo,
        kcseMeanGrade: letter.application.kcseMeanGrade,
        programmeName: letter.application.programme.name,
        programmeCode: letter.application.programme.code,
        reportingDate: letter.reportingDate,
        feesSummary: feesStructure.map((fee: any) => ({
          semester: fee.semester,
          total: fee.total || fee.tuition + fee.boarding + fee.activity,
        })),
      });
    }

    if (!fs.existsSync(filePath)) {
      return new Response('Failed to generate admission letter file on-the-fly.', { status: 500 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${serialSafe}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Download letter error:', error);
    return new Response('Internal server error during document download.', { status: 500 });
  }
}
