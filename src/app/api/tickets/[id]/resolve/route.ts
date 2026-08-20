import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    // Authorization: User must be either the owner or an admin/officer
    if (user.role === 'applicant' && ticket.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: 'resolved',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Support ticket marked as resolved.',
      ticket: updatedTicket,
    });
  } catch (error: any) {
    console.error('Resolve ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error while resolving ticket.' },
      { status: 500 }
    );
  }
}
