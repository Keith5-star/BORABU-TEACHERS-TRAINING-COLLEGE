/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

function formatMpesaPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { applicationId, phone } = body;

    if (!applicationId || !phone) {
      return NextResponse.json(
        { error: 'Application ID and Phone number are required.' },
        { status: 400 }
      );
    }

    const formattedPhone = formatMpesaPhone(phone);
    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { error: 'Invalid M-Pesa phone number format. Use e.g. 0712345678 or 254712345678.' },
        { status: 400 }
      );
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

    // Safaricom Daraja API configurations
    const mpesaEnv = process.env.MPESA_ENV || 'sandbox';
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://example.com/api/payments/callback';

    const baseUrl = mpesaEnv === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';

    // If credentials are missing in dev/sandbox, log a warning and return simulation parameters
    if (!consumerKey || !consumerSecret) {
      console.warn('[M-Pesa API Warning] Missing MPESA_CONSUMER_KEY/SECRET. Running in Simulated Sandbox mode.');
      
      const mockCheckoutId = 'ws_CO_MOCK_' + Math.random().toString(36).substring(2, 12).toUpperCase();

      // Save mock request details to DB to allow manual status query simulations
      await prisma.application.update({
        where: { id: applicationId },
        data: {
          paymentMethod: 'mpesa',
          paymentReference: mockCheckoutId, // store CheckoutRequestID here temporarily
          paymentStatus: 'pending',
        },
      });

      return NextResponse.json({
        success: true,
        simulated: true,
        message: 'Simulated STK Push triggered successfully. Click Verify to confirm mock payment.',
        checkoutRequestId: mockCheckoutId,
      });
    }

    // 1. Fetch OAuth Access Token from Safaricom
    const tokenUrl = `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`;
    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const tokenRes = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Failed to get Daraja OAuth token:', errorText);
      return NextResponse.json({ error: 'OAuth authentication failed with Safaricom Daraja.' }, { status: 502 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Trigger STK Push (M-Pesa Express API)
    const stkUrl = `${baseUrl}/mpesa/stkpush/v1/processrequest`;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHmmss
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1000,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: application.programme.code,
      TransactionDesc: `TTC Portal App Fee - ${user.fullName}`,
    };

    console.log('[Daraja API] Initiating STK request:', stkUrl, payload);

    const stkRes = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const stkData = await stkRes.json();

    if (!stkRes.ok) {
      console.error('Daraja STK push failure:', stkData);
      return NextResponse.json({ 
        error: stkData.errorMessage || 'Daraja STK Push trigger failed.',
        details: stkData 
      }, { status: stkRes.status });
    }

    // Save Safaricom Reference (CheckoutRequestID) for validation querying
    const checkoutRequestId = stkData.CheckoutRequestID;
    
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        paymentMethod: 'mpesa',
        paymentReference: checkoutRequestId, // save CheckoutRequestID temporarily to query status
        paymentStatus: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'M-Pesa Express STK push dispatched successfully. Please check your phone.',
      checkoutRequestId,
    });
  } catch (error: any) {
    console.error('STK push API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while initiating payment push.' },
      { status: 500 }
    );
  }
}
