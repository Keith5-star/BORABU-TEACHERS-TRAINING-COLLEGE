import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'admissions_officer' && user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const auditLogs = await prisma.auditLog.findMany({
      include: {
        actor: {
          select: { fullName: true, role: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ auditLogs, notifications });
  } catch (error: any) {
    console.error('Fetch system logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching system logs.' },
      { status: 500 }
    );
  }
}
