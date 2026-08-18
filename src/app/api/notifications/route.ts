import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { sentAt: 'desc' },
    });

    return NextResponse.json({ notifications });
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching notifications.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Set notification status to "read"
    await prisma.notification.updateMany({
      where: { 
        userId: user.id,
        status: { not: 'read' }
      },
      data: {
        status: 'read',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to update notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error updating notifications.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // Delete notifications for user
    await prisma.notification.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to clear notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error clearing notifications.' },
      { status: 500 }
    );
  }
}
