import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                fullName: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    // Authorization: User must be either the ticket owner or admin/officer
    if (user.role === 'applicant' && ticket.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error('Fetch ticket detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching support ticket.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { message: rawMessage } = body;
    const message = sanitizeString(rawMessage);

    if (!message) {
      return NextResponse.json({ error: 'Message content cannot be empty.' }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }

    // Authorization
    if (user.role === 'applicant' && ticket.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // If ticket is resolved, re-open it if the applicant replies
    const updatedStatus = ticket.status === 'resolved' && user.role === 'applicant' ? 'open' : ticket.status;

    const [ticketMessage] = await prisma.$transaction([
      prisma.ticketMessage.create({
        data: {
          ticketId: id,
          senderId: user.id,
          message: message.trim(),
        },
        include: {
          sender: {
            select: {
              fullName: true,
              role: true,
            },
          },
        },
      }),
      prisma.ticket.update({
        where: { id },
        data: { 
          status: updatedStatus,
          updatedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json(
      {
        message: 'Reply message posted successfully.',
        ticketMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add ticket reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error while replying to support ticket.' },
      { status: 500 }
    );
  }
}
