import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Fetch detailed application
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
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
      personalDetails: JSON.parse(application.personalDetails || '{}'),
      subjectGrades: JSON.parse(application.subjectGrades || '{}'),
      eligibilityResult: application.eligibilityResult ? JSON.parse(application.eligibilityResult) : null,
      programme: {
        ...application.programme,
        minGradeRequirement: JSON.parse(application.programme.minGradeRequirement),
        feesStructure: JSON.parse(application.programme.feesStructure),
      },
      secondaryProgramme: application.secondaryProgramme ? {
        ...application.secondaryProgramme,
        minGradeRequirement: JSON.parse(application.secondaryProgramme.minGradeRequirement),
        feesStructure: JSON.parse(application.secondaryProgramme.feesStructure),
      } : null,
    };

    return NextResponse.json({ application: formatted });
  } catch (error: any) {
    console.error('Fetch application detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching application details.' },
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
    const user = await getSessionUser();
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
    if (personalDetails) updateData.personalDetails = JSON.stringify(personalDetails);
    if (kcseIndexNo !== undefined) updateData.kcseIndexNo = kcseIndexNo;
    if (kcseYear !== undefined) updateData.kcseYear = Number(kcseYear);
    if (kcseMeanGrade !== undefined) updateData.kcseMeanGrade = kcseMeanGrade;
    if (subjectGrades) updateData.subjectGrades = JSON.stringify(subjectGrades);
    if (secondaryProgrammeId !== undefined) updateData.secondaryProgrammeId = secondaryProgrammeId;

    const updated = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Application draft updated successfully.',
      application: {
        ...updated,
        personalDetails: JSON.parse(updated.personalDetails || '{}'),
        subjectGrades: JSON.parse(updated.subjectGrades || '{}'),
      },
    });
  } catch (error: any) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating application.' },
      { status: 500 }
    );
  }
}
