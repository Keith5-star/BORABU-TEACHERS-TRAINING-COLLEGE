/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { generateAdmissionLetterPdf } from '@/lib/pdf';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'admissions_officer' && user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { decision, notes } = body;

    if (!decision || !['approve', 'reject'].includes(decision)) {
      return NextResponse.json(
        { error: 'Valid decision ("approve" or "reject") is required.' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        programme: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Decisions can only be made on submitted applications.' },
        { status: 400 }
      );
    }

    if (decision === 'reject') {
      // Transition to rejected
      const updated = await prisma.application.update({
        where: { id },
        data: {
          status: 'rejected',
          reviewedById: user.id,
          reviewedAt: new Date(),
          reviewNotes: notes || 'Application rejected by admissions panel.',
        },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'reject_application',
          entity: 'Application',
          entityId: application.id,
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: application.userId,
          channel: 'email',
          subject: 'Application Status Update - Borabu TTC',
          message: `Dear ${application.user.fullName}, We regret to inform you that your application for ${
            application.programme.name
          } was not successful. Panel notes: ${notes || 'Academic review requirements not met.'}`,
          status: 'sent',
        },
      });

      return NextResponse.json({
        message: 'Application rejected successfully.',
        status: 'rejected',
      });
    }

    // Approve workflow: generate serial & PDF
    const currentYear = new Date().getFullYear();
    const courseCode = application.programme.code;

    // Count letters for this course to generate increment
    const count = await prisma.admissionLetter.count({
      where: {
        serialNumber: {
          contains: `BORABU/${currentYear}/${courseCode}/`,
        },
      },
    });

    const serialNumber = `BORABU/${currentYear}/${courseCode}/${String(count + 1).padStart(5, '0')}`;
    const reportingDate = '2026-09-07'; // Standardized reporting date for this intake

    // Fee breakdown from Programme
    const fees = JSON.parse(application.programme.feesStructure || '[]');

    // Generate PDF
    const pdfUrl = await generateAdmissionLetterPdf(serialNumber, {
      applicantName: application.user.fullName,
      email: application.user.email,
      phone: application.user.phone,
      kcseIndexNo: application.kcseIndexNo,
      kcseMeanGrade: application.kcseMeanGrade,
      programmeName: application.programme.name,
      programmeCode: application.programme.code,
      reportingDate,
      feesSummary: fees.slice(0, 2), // first two semesters
    });

    // Create admission letter and update application state in a transaction
    await prisma.$transaction(async (tx) => {
      // Create admission letter
      await tx.admissionLetter.create({
        data: {
          applicationId: application.id,
          serialNumber,
          pdfUrl,
          reportingDate,
          generatedById: user.id,
        },
      });

      // Update application
      await tx.application.update({
        where: { id },
        data: {
          status: 'letter_issued',
          reviewedById: user.id,
          reviewedAt: new Date(),
          reviewNotes: notes || 'Approved after successful credentials verification.',
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'approve_application',
          entity: 'Application',
          entityId: application.id,
        },
      });

      // Notification
      await tx.notification.create({
        data: {
          userId: application.userId,
          channel: 'email',
          subject: 'Admission Offer - Borabu TTC',
          message: `Dear ${application.user.fullName}, Congratulations! Your application for ${
            application.programme.name
          } has been approved. Your admission letter (Serial: ${serialNumber}) has been generated. You can download the PDF from your portal dashboard.`,
          status: 'sent',
        },
      });
    });

    return NextResponse.json({
      message: 'Application approved and admission letter issued successfully.',
      status: 'letter_issued',
      serialNumber,
    });
  } catch (error: any) {
    console.error('Approve application decision error:', error);
    return NextResponse.json(
      { error: 'Internal server error during decision processing.' },
      { status: 500 }
    );
  }
}
