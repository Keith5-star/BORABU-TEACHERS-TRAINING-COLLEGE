import { prisma } from './db';

/**
 * Mock SMS dispatch using Africa's Talking API specs
 */
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  console.log(`\n--- [Africa's Talking SMS Dispatch] ---`);
  console.log(`To:      ${phone}`);
  console.log(`Message: ${message}`);
  console.log(`Status:  Queued -> Sent successfully via AT Gateway`);
  console.log(`-----------------------------------------\n`);
  return true;
}

/**
 * Mock Email dispatch using SendGrid API specs
 */
export async function sendEmail(email: string, subject: string, message: string): Promise<boolean> {
  console.log(`\n--- [SendGrid Transactional Email Dispatch] ---`);
  console.log(`To:      ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message: ${message}`);
  console.log(`Status:  Delivered via SendGrid SMTP`);
  console.log(`-----------------------------------------------\n`);
  return true;
}

interface DispatchNotificationArgs {
  userId: string;
  channel: 'email' | 'sms' | 'both';
  subject?: string;
  message: string;
}

/**
 * Dispatch notifications and log them to the database
 */
export async function dispatchNotification({
  userId,
  channel,
  subject,
  message,
}: DispatchNotificationArgs) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.warn(`Cannot send notification. User ID ${userId} not found.`);
      return;
    }

    const channels: ('email' | 'sms')[] = [];
    if (channel === 'both') {
      channels.push('email', 'sms');
    } else {
      channels.push(channel);
    }

    for (const activeChannel of channels) {
      let status = 'failed';
      if (activeChannel === 'email') {
        const success = await sendEmail(user.email, subject || 'Borabu TTC Portal Update', message);
        status = success ? 'sent' : 'failed';
      } else if (activeChannel === 'sms') {
        const success = await sendSMS(user.phone, message);
        status = success ? 'sent' : 'failed';
      }

      await prisma.notification.create({
        data: {
          userId,
          channel: activeChannel,
          subject: activeChannel === 'email' ? (subject || 'Portal Notification') : null,
          message,
          status,
          sentAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('Failed to dispatch notification:', error);
  }
}
