import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

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
      include: { programme: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Simulate OCR processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dynamic simulator based on programme requirements
    const minRequirements = JSON.parse(application.programme.minGradeRequirement || '{}');
    const gradeProgression = ['E', 'D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A'];

    const reqMean = minRequirements.meanGrade || 'D';
    let kcseMeanGrade = 'C-';
    if (reqMean && reqMean.toLowerCase() !== 'open') {
      const idx = gradeProgression.indexOf(reqMean.toUpperCase());
      if (idx !== -1) {
        kcseMeanGrade = gradeProgression[Math.min(idx + 1, gradeProgression.length - 1)];
      }
    } else {
      kcseMeanGrade = 'D+';
    }

    const subjectGrades: Record<string, string> = {
      english: 'C+',
      kiswahili: 'C+',
      mathematics: 'C',
      science: 'C',
      biology: 'C',
    };

    if (minRequirements.subjects) {
      for (const [sub, minGrade] of Object.entries(minRequirements.subjects)) {
        const subName = sub.toLowerCase();
        const minGradeStr = (minGrade as string).toUpperCase();
        const idx = gradeProgression.indexOf(minGradeStr);
        if (idx !== -1) {
          subjectGrades[subName] = gradeProgression[Math.min(idx + 1, gradeProgression.length - 1)];
        } else {
          subjectGrades[subName] = 'C';
        }
      }
    }

    const kcseIndexNo = '40732101015';
    const kcseYear = 2024;

    return NextResponse.json({
      success: true,
      message: 'OCR Scan completed successfully.',
      kcseIndexNo,
      kcseYear,
      kcseMeanGrade,
      subjectGrades,
    });
  } catch (error: any) {
    console.error('OCR Route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during OCR document scan.' },
      { status: 500 }
    );
  }
}
