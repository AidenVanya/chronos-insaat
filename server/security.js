// server/security.js — Enterprise security utilities (PBKDF2, HMAC Token, Rate Limiter, XSS Sanitizer, Headers)
import crypto from 'node:crypto';

const TOKEN_SECRET = process.env.CHRONOS_SECRET || crypto.createHash('sha256').update('chronos-insaat-enterprise-secret-key-2026').digest('hex');
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// ── 1. Password Hashing (PBKDF2-HMAC-SHA512, 100,000 iterations) ─────────
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, expectedHash) {
  if (!password || !salt || !expectedHash) return false;
  const { hash } = hashPassword(String(password), salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

// ── 2. Signed Session Tokens (HMAC-SHA256) + Revocation List ─────────────
const revokedTokens = new Set();

export function signToken(payload) {
  const data = {
    ...payload,
    jti: crypto.randomBytes(12).toString('hex'),
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const base64Payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(base64Payload).digest('base64url');
  return `${base64Payload}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  if (revokedTokens.has(token)) return null;
  const [base64Payload, signature] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(base64Payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function revokeToken(token) {
  if (token) revokedTokens.add(token);
}

// ── 3. Rate Limiting & Brute-Force Protection ────────────────────────────
const loginBuckets = new Map();
const apiBuckets = new Map();

export function checkLoginRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  const record = loginBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  if (record.count >= maxAttempts) {
    const waitSec = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec: waitSec };
  }
  return { allowed: true, remaining: maxAttempts - record.count };
}

export function recordFailedLogin(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const record = loginBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  loginBuckets.set(ip, record);
  return record.count;
}

export function resetLoginRateLimit(ip) {
  loginBuckets.delete(ip);
}

export function checkApiRateLimit(ip, maxPerMinute = 120) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const record = apiBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  apiBuckets.set(ip, record);
  return record.count <= maxPerMinute;
}

// ── 4. Deep Input Sanitizer (XSS & Prototype Pollution Prevention) ───────
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .trim();
}

export function sanitizeInput(input, depth = 0) {
  if (depth > 12 || input === null || input === undefined) return input;
  if (typeof input === 'string') return sanitizeString(input);
  if (typeof input === 'number' || typeof input === 'boolean') return input;
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item, depth + 1));
  }
  if (typeof input === 'object') {
    const clean = {};
    for (const [key, val] of Object.entries(input)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      clean[sanitizeString(key)] = sanitizeInput(val, depth + 1);
    }
    return clean;
  }
  return input;
}

// ── 5. Security Headers Middleware ───────────────────────────────────────
export function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}
