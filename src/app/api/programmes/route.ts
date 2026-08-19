/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const programmes = await prisma.programme.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Parse JSON strings to objects before returning
    const formatted = programmes.map((p) => ({
      ...p,
      minGradeRequirement: JSON.parse(p.minGradeRequirement),
      feesStructure: JSON.parse(p.feesStructure),
    }));

    return NextResponse.json(
      { programmes: formatted },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Fetch programmes error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching programmes.' },
      { status: 500 }
    );
  }
}
