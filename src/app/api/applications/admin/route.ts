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

export async function GET(req: Request) {
  try {
    const user = await getSessionUser(req);
    if (!user || (user.role !== 'admissions_officer' && user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const programmeId = searchParams.get('programmeId');
    const search = searchParams.get('search');
    
    // Server-side pagination parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    if (programmeId && programmeId !== 'All') {
      whereClause.programmeId = programmeId;
    }

    if (search) {
      whereClause.OR = [
        { user: { fullName: { contains: search } } },
        { kcseIndexNo: { contains: search } },
        { user: { email: { contains: search } } },
      ];
    }

    // Get total matching count for pagination metadata
    const total = await prisma.application.count({
      where: whereClause,
    });

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        programme: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        documents: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
    });

    const formatted = applications.map((app) => ({
      ...app,
      personalDetails: safeJsonParse(app.personalDetails, {}),
      subjectGrades: safeJsonParse(app.subjectGrades, {}),
      eligibilityResult: app.eligibilityResult ? safeJsonParse(app.eligibilityResult, null) : null,
    }));

    return NextResponse.json({ 
      applications: formatted,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    console.error('Admin fetch applications error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while fetching admin queue.' },
      { status: 500 }
    );
  }
}

