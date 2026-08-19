/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Fetch applicant's own applications
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { userId: user.id },
      include: {
        programme: true,
        documents: true,
        admissionLetter: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = applications.map((app) => ({
      ...app,
      personalDetails: JSON.parse(app.personalDetails || '{}'),
      subjectGrades: JSON.parse(app.subjectGrades || '{}'),
      eligibilityResult: app.eligibilityResult ? JSON.parse(app.eligibilityResult) : null,
      programme: {
        ...app.programme,
        minGradeRequirement: JSON.parse(app.programme.minGradeRequirement),
        feesStructure: JSON.parse(app.programme.feesStructure),
      },
    }));

    return NextResponse.json({ applications: formatted });
  } catch (error: any) {
    console.error('Fetch applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching applications.' },
      { status: 500 }
    );
  }
}

// POST: Create a new draft application
export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { programmeId } = body;

    if (!programmeId) {
      return NextResponse.json({ error: 'Programme ID is required.' }, { status: 400 });
    }

    // Verify programme exists
    const programme = await prisma.programme.findUnique({
      where: { id: programmeId },
    });

    if (!programme) {
      return NextResponse.json({ error: 'Selected programme does not exist.' }, { status: 404 });
    }

    // Check if there's already an active application for this user and programme (prevent duplicates)
    const existing = await prisma.application.findFirst({
      where: {
        userId: user.id,
        programmeId: programmeId,
        status: { notIn: ['rejected'] },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You already have an active application for this programme.', applicationId: existing.id },
        { status: 409 }
      );
    }

    // Create draft
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        programmeId: programmeId,
        status: 'draft',
        personalDetails: JSON.stringify({}),
        kcseIndexNo: '',
        kcseYear: 0,
        kcseMeanGrade: '',
        subjectGrades: JSON.stringify({}),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'create_application',
        entity: 'Application',
        entityId: application.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Draft application created successfully.',
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating application.' },
      { status: 500 }
    );
  }
}
