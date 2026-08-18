import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'admissions_officer' && user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { minGradeRequirement, intakeCapacity, intakePeriod, isActive, feesStructure, name } = body;

    const programme = await prisma.programme.findUnique({
      where: { id },
    });

    if (!programme) {
      return NextResponse.json({ error: 'Programme not found.' }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (intakePeriod !== undefined) updateData.intakePeriod = intakePeriod;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (intakeCapacity !== undefined) updateData.intakeCapacity = Number(intakeCapacity);
    if (minGradeRequirement !== undefined) {
      updateData.minGradeRequirement = typeof minGradeRequirement === 'string'
        ? minGradeRequirement
        : JSON.stringify(minGradeRequirement);
    }
    if (feesStructure !== undefined) {
      updateData.feesStructure = typeof feesStructure === 'string'
        ? feesStructure
        : JSON.stringify(feesStructure);
    }

    const updated = await prisma.programme.update({
      where: { id },
      data: updateData,
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'update_programme_rules',
        entity: 'Programme',
        entityId: id,
      },
    });

    return NextResponse.json({
      message: 'Programme updated successfully.',
      programme: {
        ...updated,
        minGradeRequirement: JSON.parse(updated.minGradeRequirement),
        feesStructure: JSON.parse(updated.feesStructure),
      },
    });
  } catch (error: any) {
    console.error('Update programme rules error:', error);
    return NextResponse.json(
      { error: 'Internal server error while updating programme requirements.' },
      { status: 500 }
    );
  }
}
