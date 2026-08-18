import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return new Response('Unauthorized.', { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { programme: true },
    });

    if (!application) {
      return new Response('Application not found.', { status: 404 });
    }

    // Check authorization: must belong to user, or be admin/officer
    if (user.role === 'applicant' && application.userId !== user.id) {
      return new Response('Forbidden.', { status: 403 });
    }

    if (application.paymentStatus !== 'paid' || !application.paymentReceiptUrl) {
      return new Response('No verified payment receipt exists for this application.', { status: 400 });
    }

    // The paymentReceiptUrl is stored as e.g. /receipts/REC-XXXXXX.pdf
    const receiptPath = path.join(process.cwd(), 'public', application.paymentReceiptUrl);
    if (!fs.existsSync(receiptPath)) {
      return new Response('Receipt file could not be found on the server.', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(receiptPath);
    const fileName = path.basename(application.paymentReceiptUrl);

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Download receipt error:', error);
    return new Response('Internal server error during receipt download.', { status: 500 });
  }
}
