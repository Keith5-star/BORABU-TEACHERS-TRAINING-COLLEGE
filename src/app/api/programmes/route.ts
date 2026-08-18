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

    return NextResponse.json({ programmes: formatted });
  } catch (error: any) {
    console.error('Fetch programmes error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching programmes.' },
      { status: 500 }
    );
  }
}
