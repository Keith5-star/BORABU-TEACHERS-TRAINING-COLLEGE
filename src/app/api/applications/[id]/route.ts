/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { safeJsonParse } from '@/lib/security';

// GET: Fetch detailed application
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        programme: true,
        secondaryProgramme: true,
        documents: true,
        admissionLetter: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    // Auth check: Must be owner OR admissions staff
    const isOwner = application.userId === user.id;
    const isStaff = user.role === 'admissions_officer' || user.role === 'admin' || user.role === 'super_admin';

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const formatted = {
      ...application,
      personalDetails: safeJsonParse(application.personalDetails, {}),
      subjectGrades: safeJsonParse(application.subjectGrades, {}),
      eligibilityResult: application.eligibilityResult ? safeJsonParse(application.eligibilityResult, null) : null,
      programme: application.programme ? {
        ...application.programme,
        minGradeRequirement: safeJsonParse(application.programme.minGradeRequirement, { meanGrade: 'C', subjects: {} }),
        feesStructure: safeJsonParse(application.programme.feesStructure, []),
      } : null,
      secondaryProgramme: application.secondaryProgramme ? {
        ...application.secondaryProgramme,
        minGradeRequirement: safeJsonParse(application.secondaryProgramme.minGradeRequirement, { meanGrade: 'C', subjects: {} }),
        feesStructure: safeJsonParse(application.secondaryProgramme.feesStructure, []),
      } : null,
    };

    return NextResponse.json({ application: formatted });
  } catch (error: any) {
    console.error('Fetch application detail error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while fetching application details.' },
      { status: 500 }
    );
  }
}

// PATCH: Update draft application details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    // Check if application exists and belongs to the user
    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Only allow updating drafts
    if (application.status !== 'draft') {
      return NextResponse.json(
        { error: 'You can only edit applications in draft status.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { personalDetails, kcseIndexNo, kcseYear, kcseMeanGrade, subjectGrades, secondaryProgrammeId } = body;

    const updateData: any = {};
    if (personalDetails) updateData.personalDetails = typeof personalDetails === 'string' ? personalDetails : JSON.stringify(personalDetails);
    if (kcseIndexNo !== undefined) updateData.kcseIndexNo = kcseIndexNo;
    if (kcseYear !== undefined) updateData.kcseYear = Number(kcseYear);
    if (kcseMeanGrade !== undefined) updateData.kcseMeanGrade = kcseMeanGrade;
    if (subjectGrades) updateData.subjectGrades = typeof subjectGrades === 'string' ? subjectGrades : JSON.stringify(subjectGrades);
    if (secondaryProgrammeId !== undefined) updateData.secondaryProgrammeId = secondaryProgrammeId;

    const updated = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Application draft updated successfully.',
      application: {
        ...updated,
        personalDetails: safeJsonParse(updated.personalDetails, {}),
        subjectGrades: safeJsonParse(updated.subjectGrades, {}),
      },
    });
  } catch (error: any) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while updating application.' },
      { status: 500 }
    );
  }
}
