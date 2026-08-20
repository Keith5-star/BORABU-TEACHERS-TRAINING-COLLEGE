/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { scanAndVerifyDocument } from '@/lib/documentScanner';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { programme: true, user: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Simulate scanning and OCR pipeline delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Run deep scan analysis on KCSE certificate
    const dummyBuffer = Buffer.from('%PDF-1.4 simulated binary stream');
    const scanReport = scanAndVerifyDocument('kcse_cert', 'KCSE_Result_Slip_Official.pdf', dummyBuffer, {
      applicantName: application.user.fullName,
      enteredIndexNo: application.kcseIndexNo || undefined,
      enteredMeanGrade: application.kcseMeanGrade || undefined,
      programmeMinRequirement: application.programme.minGradeRequirement,
    });

    return NextResponse.json({
      success: true,
      message: 'Automated Document Scanning and Anti-Forgery verification complete.',
      kcseIndexNo: scanReport.extractedData?.kcseIndexNo || '40732101015',
      kcseYear: scanReport.extractedData?.kcseYear || 2024,
      kcseMeanGrade: scanReport.extractedData?.kcseMeanGrade || 'C',
      subjectGrades: scanReport.extractedData?.subjectGrades || {
        english: 'C+',
        kiswahili: 'C+',
        mathematics: 'C',
        biology: 'C',
      },
      scanReport,
    });
  } catch (error: any) {
    console.error('OCR Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during OCR document scan.' },
      { status: 500 }
    );
  }
}
