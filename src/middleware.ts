import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateCsrfRequest, checkRateLimit, RATE_LIMIT_TIERS } from '@/lib/security';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all API routes
  if (pathname.startsWith('/api/')) {
    // 1. Determine Rate Limit Tier based on route path
    let tier = RATE_LIMIT_TIERS.GENERAL;
    if (pathname.startsWith('/api/auth/')) {
      tier = RATE_LIMIT_TIERS.AUTH;
    } else if (pathname.startsWith('/api/payments/')) {
      tier = RATE_LIMIT_TIERS.PAYMENT;
    } else if (pathname.includes('/submit') || pathname.includes('/decision')) {
      tier = RATE_LIMIT_TIERS.SUBMIT;
    } else if (pathname.startsWith('/api/verify/')) {
      tier = RATE_LIMIT_TIERS.VERIFY;
    }

    // 2. Check Rate Limit
    const rlCheck = checkRateLimit(request, tier);
    if (!rlCheck.allowed && rlCheck.errorResponse) {
      return rlCheck.errorResponse;
    }

    // 3. Enforce CSRF protection for all state-changing methods
    const method = request.method.toUpperCase();
    const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

    if (stateChangingMethods.includes(method)) {
      const csrfCheck = validateCsrfRequest(request);
      if (!csrfCheck.valid) {
        return NextResponse.json(
          {
            error: 'CSRF validation failed. Request origin is not permitted.',
            reason: csrfCheck.reason,
          },
          { status: 403 }
        );
      }
    }

    // 4. Pass through with Rate Limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rlCheck.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rlCheck.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rlCheck.resetInSec.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
