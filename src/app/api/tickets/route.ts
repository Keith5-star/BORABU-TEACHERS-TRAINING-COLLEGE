import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// GET: Fetch tickets
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let tickets;
    if (user.role === 'applicant') {
      tickets = await prisma.ticket.findMany({
        where: { userId: user.id },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      // Admin/Officer
      tickets = await prisma.ticket.findMany({
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching support tickets.' },
      { status: 500 }
    );
  }
}

// POST: Create ticket
export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, category, message } = body;

    if (!subject || !category || !message) {
      return NextResponse.json(
        { error: 'Subject, category, and message are required.' },
        { status: 400 }
      );
    }

    // Create Ticket and initial TicketMessage inside a transaction
    const ticket = await prisma.$transaction(async (tx) => {
      const newTicket = await tx.ticket.create({
        data: {
          userId: user.id,
          subject,
          category,
          status: 'open',
        },
      });

      await tx.ticketMessage.create({
        data: {
          ticketId: newTicket.id,
          senderId: user.id,
          message,
        },
      });

      return newTicket;
    });

    return NextResponse.json({
      message: 'Support ticket created successfully.',
      ticketId: ticket.id,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating ticket.' },
      { status: 500 }
    );
  }
}
