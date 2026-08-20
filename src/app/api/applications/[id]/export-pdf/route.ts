import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { generateApplicationSummaryPdf } from '@/lib/pdf';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return new Response('Unauthorized.', { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        programme: true,
        secondaryProgramme: true,
        documents: true,
      },
    });

    if (!application) {
      return new Response('Application record not found.', { status: 404 });
    }

    // Ensure applicant owns application or is admin/officer
    const isOwner = application.userId === user.id;
    const isStaff = ['admissions_officer', 'admin', 'super_admin'].includes(user.role);

    if (!isOwner && !isStaff) {
      return new Response('Forbidden.', { status: 403 });
    }

    const personal = JSON.parse(application.personalDetails || '{}');
    const subjectGrades = JSON.parse(application.subjectGrades || '{}');

    const pdfRelativeUrl = await generateApplicationSummaryPdf(application.id, {
      applicantName: application.user.fullName,
      email: application.user.email,
      phone: application.user.phone,
      dob: personal.dob || 'Not provided',
      gender: personal.gender || 'Not specified',
      idNumber: personal.idNumber || 'N/A',
      county: personal.county || 'Nyamira / Kenya',
      guardianContact: personal.guardianContact || application.user.phone,
      kcseIndexNo: application.kcseIndexNo || 'N/A',
      kcseYear: application.kcseYear || 2024,
      kcseMeanGrade: application.kcseMeanGrade || 'N/A',
      subjectGrades: subjectGrades || {},
      programmeName: application.programme.name,
      programmeCode: application.programme.code,
      secondaryProgrammeName: application.secondaryProgramme?.name || undefined,
      paymentReference: application.paymentReference || 'PENDING',
      paymentStatus: application.paymentStatus || 'unpaid',
      submittedAt: application.submittedAt || application.createdAt,
    });

    const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
    const serialSafe = `summary_${application.id.slice(0, 8)}`;
    const filePath = path.join(receiptsDir, `${serialSafe}.pdf`);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Borabu_Application_${application.id.slice(0, 8)}.pdf"`,
        },
      });
    }

    return new Response('PDF generation failed', { status: 500 });
  } catch (error: any) {
    console.error('Export application PDF error:', error);
    return new Response('Internal Server Error generating PDF.', { status: 500 });
  }
}
