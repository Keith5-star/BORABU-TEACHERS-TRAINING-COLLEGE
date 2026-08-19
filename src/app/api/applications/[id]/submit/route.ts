/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { checkEligibility } from '@/lib/eligibility';
import { generateApplicationSummaryPdf } from '@/lib/pdf';
import { safeJsonParse } from '@/lib/security';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { id } = await params;
    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Fetch application details with programme rules
    const application = await prisma.application.findUnique({
      where: { id },
      include: { 
        programme: true,
        secondaryProgramme: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    if (application.status !== 'draft') {
      return NextResponse.json(
        { error: 'Application has already been submitted.' },
        { status: 400 }
      );
    }

    // Validate that payment is complete
    if (application.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Application processing fee (KES 1,000) must be paid and verified before final submission.' },
        { status: 400 }
      );
    }

    // Validate that personal details and grades are complete
    if (!application.kcseMeanGrade || !application.kcseIndexNo || !application.subjectGrades) {
      return NextResponse.json(
        { error: 'Academic results and index number must be complete before submitting.' },
        { status: 400 }
      );
    }

    const personal = safeJsonParse<any>(application.personalDetails, {});
    if (!personal.dob || !personal.gender || !personal.idNumber || !personal.county) {
      return NextResponse.json(
        { error: 'Personal details must be complete before submitting.' },
        { status: 400 }
      );
    }

    const parsedGrades = safeJsonParse<Record<string, string>>(application.subjectGrades, {});

    // Run Eligibility Engine
    const eligibility = checkEligibility(
      application.programme.minGradeRequirement,
      application.kcseMeanGrade,
      parsedGrades
    );

    // Determine target status
    const targetStatus = eligibility.eligible ? 'submitted' : 'eligibility_failed';
    const submittedTime = new Date();

    // Generate application summary PDF safely
    let summaryPdfUrl = '';
    try {
      summaryPdfUrl = await generateApplicationSummaryPdf(id, {
        applicantName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: personal.dob,
        gender: personal.gender,
        idNumber: personal.idNumber,
        county: personal.county,
        guardianContact: personal.guardianContact || 'N/A',
        kcseIndexNo: application.kcseIndexNo,
        kcseYear: application.kcseYear,
        kcseMeanGrade: application.kcseMeanGrade,
        subjectGrades: parsedGrades,
        programmeName: application.programme.name,
        programmeCode: application.programme.code,
        secondaryProgrammeName: application.secondaryProgramme?.name,
        paymentReference: application.paymentReference || 'N/A',
        paymentStatus: application.paymentStatus,
        submittedAt: submittedTime,
      });
    } catch (pdfErr) {
      console.warn('Summary PDF generation warning:', pdfErr);
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: targetStatus,
        eligibilityResult: JSON.stringify(eligibility),
        submittedAt: submittedTime,
        summaryReceiptUrl: summaryPdfUrl || undefined,
      },
    });

    // Create Audit Log with IP address
    try {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'submit_application',
          entity: 'Application',
          entityId: application.id,
          ipAddress: ipAddress,
        },
      });
    } catch (auditErr) {
      console.warn('Audit log creation non-fatal error:', auditErr);
    }

    // Create Notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          channel: 'email',
          subject: `Application Submission - ${application.programme.code}`,
          message: `Your application for ${application.programme.name} has been received. Status: ${
            eligibility.eligible ? 'Submitted (Provisional Pass)' : 'Not Eligible (Requirements Not Met)'
          }. ${eligibility.message}`,
          status: 'sent',
        },
      });
    } catch (notifErr) {
      console.warn('Notification creation non-fatal error:', notifErr);
    }

    return NextResponse.json({
      message: 'Application submitted successfully.',
      status: targetStatus,
      eligibilityResult: eligibility,
      summaryReceiptUrl: summaryPdfUrl,
    });
  } catch (error: any) {
    console.error('Submit application error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while submitting application.' },
      { status: 500 }
    );
  }
}

