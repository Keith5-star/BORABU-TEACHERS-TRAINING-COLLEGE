/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { sendEmail, sendSMS } from '@/lib/notifications';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required.' }, { status: 400 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json({ error: 'Notification record not found.' }, { status: 404 });
    }

    // Check authorization: must belong to user
    if (notification.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    let success = false;
    if (notification.channel === 'email') {
      success = await sendEmail(user.email, notification.subject || 'Borabu TTC Portal Update', notification.message);
    } else if (notification.channel === 'sms') {
      success = await sendSMS(user.phone, notification.message);
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: success ? 'sent' : 'failed',
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification successfully resent.',
      notification: updated,
    });
  } catch (error: any) {
    console.error('Resend notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error while resending notification.' },
      { status: 500 }
    );
  }
}
