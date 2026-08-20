import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const DEFAULT_PROGRAMMES = [
  {
    name: 'Diploma in Primary Teacher Education (DPTE)',
    code: 'DPTE',
    level: 'Diploma',
    duration: '3 Years',
    minGradeRequirement: JSON.stringify({
      meanGrade: 'C (Plain)',
      subjects: {
        english: 'C',
        kiswahili: 'C',
        mathematics: 'C',
      },
    }),
    intakeCapacity: 200,
    intakePeriod: 'September 2026',
    isActive: true,
    feesStructure: JSON.stringify([
      { semester: 'Year 1 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
      { semester: 'Year 1 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 },
      { semester: 'Year 2 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
      { semester: 'Year 2 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 },
      { semester: 'Year 3 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
      { semester: 'Year 3 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 },
    ]),
  },
  {
    name: 'Diploma in Early Childhood Teacher Education (DECTE)',
    code: 'DECTE',
    level: 'Diploma',
    duration: '3 Years',
    minGradeRequirement: JSON.stringify({
      meanGrade: 'C (Plain)',
      subjects: {},
    }),
    intakeCapacity: 150,
    intakePeriod: 'September 2026',
    isActive: true,
    feesStructure: JSON.stringify([
      { semester: 'Year 1 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
      { semester: 'Year 1 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 },
      { semester: 'Year 2 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
      { semester: 'Year 2 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 },
      { semester: 'Year 3 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
      { semester: 'Year 3 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 },
    ]),
  },
  {
    name: 'Certificate in Early Childhood Teacher Education (CECTE)',
    code: 'CECTE',
    level: 'Certificate',
    duration: '2 Years',
    minGradeRequirement: JSON.stringify({
      meanGrade: 'C- (Minus)',
      subjects: {},
    }),
    intakeCapacity: 100,
    intakePeriod: 'September 2026',
    isActive: true,
    feesStructure: JSON.stringify([
      { semester: 'Year 1 Term 1', tuition: 25000, boarding: 20000, activity: 3000, total: 48000 },
      { semester: 'Year 1 Term 2', tuition: 22000, boarding: 18000, activity: 2000, total: 42000 },
      { semester: 'Year 2 Term 1', tuition: 25000, boarding: 20000, activity: 3000, total: 48000 },
      { semester: 'Year 2 Term 2', tuition: 22000, boarding: 18000, activity: 2000, total: 42000 },
    ]),
  },
];

function safeJsonParse(val: any, fallback: any) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    let programmes = await prisma.programme.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    // Auto-seed default programmes if table is empty
    if (programmes.length === 0) {
      try {
        for (const prog of DEFAULT_PROGRAMMES) {
          await prisma.programme.create({
            data: prog,
          });
        }
        programmes = await prisma.programme.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        });
      } catch (seedErr) {
        console.warn('Could not auto-seed programmes in database, using memory fallback:', seedErr);
        // Return memory fallback if database write is restricted
        const memoryFormatted = DEFAULT_PROGRAMMES.map((p, idx) => ({
          id: `default-${idx + 1}`,
          ...p,
          minGradeRequirement: safeJsonParse(p.minGradeRequirement, { meanGrade: 'C', subjects: {} }),
          feesStructure: safeJsonParse(p.feesStructure, []),
        }));
        return NextResponse.json({ programmes: memoryFormatted });
      }
    }

    // Parse JSON strings to objects before returning
    const formatted = programmes.map((p) => ({
      ...p,
      minGradeRequirement: safeJsonParse(p.minGradeRequirement, { meanGrade: 'C', subjects: {} }),
      feesStructure: safeJsonParse(p.feesStructure, []),
    }));

    return NextResponse.json(
      { programmes: formatted },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Fetch programmes error:', error);
    // Even if DB fails, provide default accredited courses so portal is never blank
    const fallback = DEFAULT_PROGRAMMES.map((p, idx) => ({
      id: `default-${idx + 1}`,
      ...p,
      minGradeRequirement: safeJsonParse(p.minGradeRequirement, { meanGrade: 'C', subjects: {} }),
      feesStructure: safeJsonParse(p.feesStructure, []),
    }));
    return NextResponse.json({ programmes: fallback });
  }
}
