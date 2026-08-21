/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { validateApplicationDocuments } from '@/lib/aiDocumentValidator';

export async function POST(
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
        programme: true,
        user: true,
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    // Must be application owner or admin/officer
    if (user.role === 'applicant' && application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    if (!application.documents || application.documents.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No documents have been uploaded for this application yet. Please upload files before validating.',
      }, { status: 400 });
    }

    // Run AI Document Legibility and Clarity Validation
    const report = await validateApplicationDocuments({
      id: application.id,
      user: { fullName: application.user.fullName },
      programme: { name: application.programme.name },
      documents: application.documents,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('Validate documents route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during document AI validation.' },
      { status: 500 }
    );
  }
}
