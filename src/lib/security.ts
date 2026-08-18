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

// Clean up stale IP records every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(
  req: Request | NextRequest,
  options: {
    limit?: number; // max requests per window
    windowMs?: number; // window size in milliseconds
    keyPrefix?: string;
  } = {}
): { allowed: boolean; remaining: number; resetInSec: number; errorResponse?: NextResponse } {
  const limit = options.limit || 30;
  const windowMs = options.windowMs || 60 * 1000;
  const prefix = options.keyPrefix || 'global';

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
    };
  }

  if (record.count >= limit) {
    const resetInSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSec,
      errorResponse: NextResponse.json(
        {
          error: 'Too many requests. Please slow down and try again.',
          retryAfter: resetInSec,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetInSec.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
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
  };
}

/**
 * XSS & HTML Injection Sanitization
 * Strips script tags, iframe, dangerous URI schemes, and control characters.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/\0/g, '') // remove null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove <script>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // remove <iframe>
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // remove <object>
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // remove <embed>
    .replace(/javascript:/gi, '') // remove javascript: URI scheme
    .replace(/data:text\/html/gi, '') // remove inline data HTML
    .replace(/onload\s*=/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onclick\s*=/gi, '')
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
 * CSRF / Origin Validation for Mutating Requests
 */
export function validateCsrfOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (!origin || !host) {
    // Non-browser or same-origin GET/direct requests
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}
