import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { generatePaymentReceiptPdf } from '@/lib/pdf';
import { dispatchNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID parameter is required.' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { programme: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // If it is already marked as paid, return immediately
    if (application.paymentStatus === 'paid') {
      return NextResponse.json({
        success: true,
        status: 'paid',
        reference: application.paymentReference,
        receiptUrl: application.paymentReceiptUrl,
      });
    }

    const checkoutRequestId = application.paymentReference;
    if (!checkoutRequestId) {
      return NextResponse.json({ error: 'No active M-Pesa checkout session found for this application.' }, { status: 400 });
    }

    // 1. Simulated Sandbox Mode Fallback
    if (checkoutRequestId.startsWith('ws_CO_MOCK_')) {
      console.log(`[M-Pesa API Status Check] Simulating successful verification for mock code: ${checkoutRequestId}`);

      const mockMpesaCode = 'MOCK_' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const receiptNumber = 'REC-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Generate receipt PDF
      const receiptUrl = await generatePaymentReceiptPdf(receiptNumber, {
        applicantName: user.fullName,
        email: user.email,
        phone: user.phone || '0700000000',
        programmeName: application.programme.name,
        paymentMethod: 'mpesa',
        paymentReference: mockMpesaCode,
        amount: 1000.0,
        date: new Date(),
      });

      // Save success details
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paymentStatus: 'paid',
          paymentAmount: 1000.0,
          paymentReference: mockMpesaCode,
          paymentVerifiedAt: new Date(),
          paymentReceiptUrl: receiptUrl,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'mpesa_stk_payment_success',
          entity: 'Application',
          entityId: applicationId,
        },
      });

      // Send dispatch notification
      await dispatchNotification({
        userId: user.id,
        channel: 'both',
        subject: 'Payment Verified (Simulated STK Push)',
        message: `Dear ${user.fullName}, Your payment of KES 1,000 for your application of ${application.programme.name} has been processed and verified. Transaction Code: ${mockMpesaCode}.`,
      });

      return NextResponse.json({
        success: true,
        status: 'paid',
        reference: mockMpesaCode,
        receiptUrl,
      });
    }

    // 2. Real Safaricom Daraja Query
    const mpesaEnv = process.env.MPESA_ENV || 'sandbox';
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';

    const baseUrl = mpesaEnv === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json({ error: 'M-Pesa API configurations are missing on the server.' }, { status: 500 });
    }

    // Get Access Token
    const tokenUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await fetch(tokenUrl, {
      method: 'GET',
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: 'OAuth authentication with Safaricom failed.' }, { status: 502 });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Build Password & Timestamp
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const queryUrl = `${baseUrl}/mpesa/stkpushquery/v1/query`;
    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    console.log('[Daraja API] Querying transaction status:', queryUrl, payload);

    const queryRes = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const queryData = await queryRes.json();

    if (!queryRes.ok) {
      console.error('Daraja STK status query failure:', queryData);
      return NextResponse.json({
        success: false,
        pending: true,
        message: queryData.errorMessage || 'Safaricom query request failed.',
      });
    }

    const resultCode = queryData.ResultCode; // "0" indicates success
    const resultDesc = queryData.ResultDesc;

    if (resultCode === '0') {
      // Payment Successful!
      const safaricomReference = 'MPESA_' + checkoutRequestId.slice(-8).toUpperCase();
      const receiptNumber = 'REC-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Generate receipt
      const receiptUrl = await generatePaymentReceiptPdf(receiptNumber, {
        applicantName: user.fullName,
        email: user.email,
        phone: user.phone || '0700000000',
        programmeName: application.programme.name,
        paymentMethod: 'mpesa',
        paymentReference: safaricomReference,
        amount: 1000.0,
        date: new Date(),
      });

      // Update database
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paymentStatus: 'paid',
          paymentAmount: 1000.0,
          paymentReference: safaricomReference,
          paymentVerifiedAt: new Date(),
          paymentReceiptUrl: receiptUrl,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'mpesa_stk_payment_success',
          entity: 'Application',
          entityId: applicationId,
        },
      });

      // Dispatches
      await dispatchNotification({
        userId: user.id,
        channel: 'both',
        subject: 'M-Pesa Express Verified - Borabu TTC',
        message: `Dear ${user.fullName}, Your M-Pesa payment of KES 1,000 for your application of ${application.programme.name} has been processed successfully. Code: ${safaricomReference}.`,
      });

      return NextResponse.json({
        success: true,
        status: 'paid',
        reference: safaricomReference,
        receiptUrl,
      });
    } else {
      // Payment Canceled or Failed
      return NextResponse.json({
        success: false,
        failed: true,
        message: resultDesc || 'Transaction was canceled or failed.',
      });
    }
  } catch (error: any) {
    console.error('STK status check API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while verifying payment status.' },
      { status: 500 }
    );
  }
}
