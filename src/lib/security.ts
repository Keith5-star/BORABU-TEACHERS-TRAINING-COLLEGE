import { NextRequest, NextResponse } from 'next/server';

/**
 * In-Memory Sliding Window Rate Limiter
 * Tracks requests per IP address to mitigate brute-force and DDoS attempts.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records periodically to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 3 * 60 * 1000);
}

export interface RateLimitTier {
  limit: number;
  windowMs: number;
  keyPrefix: string;
}

export const RATE_LIMIT_TIERS = {
  AUTH: { limit: 15, windowMs: 15 * 60 * 1000, keyPrefix: 'rl:auth' }, // 15 reqs per 15 mins
  PAYMENT: { limit: 20, windowMs: 60 * 1000, keyPrefix: 'rl:pay' }, // 20 reqs per minute
  SUBMIT: { limit: 25, windowMs: 60 * 1000, keyPrefix: 'rl:sub' }, // 25 reqs per minute
  VERIFY: { limit: 40, windowMs: 60 * 1000, keyPrefix: 'rl:ver' }, // 40 reqs per minute
  GENERAL: { limit: 150, windowMs: 60 * 1000, keyPrefix: 'rl:gen' }, // 150 reqs per minute
};

export function checkRateLimit(
  req: Request | NextRequest,
  options: {
    limit?: number;
    windowMs?: number;
    keyPrefix?: string;
  } = {}
): { allowed: boolean; remaining: number; resetInSec: number; limit: number; errorResponse?: NextResponse } {
  const limit = options.limit || RATE_LIMIT_TIERS.GENERAL.limit;
  const windowMs = options.windowMs || RATE_LIMIT_TIERS.GENERAL.windowMs;
  const prefix = options.keyPrefix || RATE_LIMIT_TIERS.GENERAL.keyPrefix;

  // Extract client IP safely
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInSec: Math.ceil(windowMs / 1000),
      limit,
    };
  }

  if (record.count >= limit) {
    const resetInSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSec,
      limit,
      errorResponse: NextResponse.json(
        {
          error: 'Too many requests. Please slow down and try again later.',
          retryAfter: resetInSec,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetInSec.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(record.resetAt / 1000).toString(),
          },
        }
      ),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
    limit,
  };
}

/**
 * XSS & HTML Injection Sanitization
 * Strips script tags, iframes, dangerous URI schemes, and control characters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/\0/g, '') // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove <script>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // remove <iframe>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // remove <object>
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // remove <embed>
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // remove <style>
    .replace(/javascript:/gi, '') // remove javascript: URI scheme
    .replace(/vbscript:/gi, '') // remove vbscript: URI scheme
    .replace(/data:text\/html/gi, '') // remove inline data HTML
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
    .replace(/onmouseover\s*=/gi, '')
    .replace(/onfocus\s*=/gi, '')
    .replace(/onblur\s*=/gi, '')
    .trim();
}

/**
 * Sanitizes all string values in an object recursively.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[sanitizeString(key)] = sanitizeObject(value);
    }
    return cleaned as T;
  }
  return obj;
}

/**
 * Email validation & sanitization conforming to RFC 5322 standard regex
 */
export function sanitizeEmail(email: unknown): { valid: boolean; email: string } {
  if (typeof email !== 'string') return { valid: false, email: '' };

  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (sanitized.length > 254 || !emailRegex.test(sanitized)) {
    return { valid: false, email: sanitized };
  }

  return { valid: true, email: sanitized };
}

/**
 * Kenyan & International Phone Number Sanitizer
 */
export function sanitizePhone(phone: unknown): string {
  if (typeof phone !== 'string') return '';
  const digits = phone.replace(/[^0-9+]/g, '').trim();
  if (digits.startsWith('07') || digits.startsWith('01')) {
    return '+254' + digits.substring(1);
  }
  if (digits.startsWith('254')) {
    return '+' + digits;
  }
  return digits;
}

/**
 * KCSE Index Number Sanitizer
 */
export function sanitizeIndexNo(indexNo: unknown): string {
  if (typeof indexNo !== 'string') return '';
  return indexNo.replace(/[^0-9]/g, '').slice(0, 15);
}

/**
 * Password Strength Validation
 * Enforces minimum 8 characters, with letters and numbers.
 */
export function validatePasswordStrength(password: unknown): { valid: boolean; message?: string } {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password must be a string.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters.' };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);

  if (!hasLetter || !hasDigit) {
    return { valid: false, message: 'Password must contain at least one letter and one number.' };
  }

  return { valid: true };
}

/**
 * CSRF / Origin Validation for State-Changing Requests (POST, PUT, PATCH, DELETE)
 * Verifies Origin and Referer headers against the host and trusted origins.
 */
export function validateCsrfRequest(req: Request | NextRequest): { valid: boolean; reason?: string } {
  const method = req.method.toUpperCase();
  const stateChangingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  // Safe methods (GET, HEAD, OPTIONS) do not require CSRF origin validation
  if (!stateChangingMethods.includes(method)) {
    return { valid: true };
  }

  // Extract Host & X-Forwarded-Host
  const forwardedHost = req.headers.get('x-forwarded-host');
  const rawHost = req.headers.get('host');
  const hostList = [forwardedHost, rawHost].filter(Boolean).map((h) => h!.replace(/:(80|443)$/, '').toLowerCase());

  // Extract Origin
  const origin = req.headers.get('origin');
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host.replace(/:(80|443)$/, '').toLowerCase();

      // Check if origin matches any host or recognized development / preview domain
      const isHostMatch = hostList.some((h) => h === originHost || originHost.includes(h) || h.includes(originHost));
      const isTrustedDomain =
        originHost.endsWith('.run.app') ||
        originHost.includes('localhost') ||
        originHost.includes('127.0.0.1') ||
        originHost.endsWith('.google.com') ||
        originHost.endsWith('.ai.studio');

      if (isHostMatch || isTrustedDomain) {
        return { valid: true };
      }
      return { valid: false, reason: `Origin '${originHost}' is not recognized.` };
    } catch {
      return { valid: false, reason: 'Malformed Origin header provided.' };
    }
  }

  // Extract Referer (fallback check)
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererHost = refererUrl.host.replace(/:(80|443)$/, '').toLowerCase();

      const isHostMatch = hostList.some((h) => h === refererHost || refererHost.includes(h) || h.includes(refererHost));
      const isTrustedDomain =
        refererHost.endsWith('.run.app') ||
        refererHost.includes('localhost') ||
        refererHost.includes('127.0.0.1') ||
        refererHost.endsWith('.google.com') ||
        refererHost.endsWith('.ai.studio');

      if (isHostMatch || isTrustedDomain) {
        return { valid: true };
      }
      return { valid: false, reason: `Referer '${refererHost}' is not recognized.` };
    } catch {
      return { valid: false, reason: 'Malformed Referer header provided.' };
    }
  }

  return { valid: true };
}

export function validateCsrfOrigin(req: Request): boolean {
  return validateCsrfRequest(req).valid;
}
