import { cookies } from 'next/headers';
import {
  AdminConfigurationError,
  createSessionToken,
  getAdminConfig,
  hasSameOrigin,
  SESSION_TTL_SECONDS,
  verifyPassword,
} from '../../../../lib/auth.js';

const attemptsByAddress = new Map();
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_LOGIN_PAYLOAD_BYTES = 8 * 1024;

function getAttemptRecord(address, now) {
  const existing = attemptsByAddress.get(address);
  if (!existing || existing.expiresAt <= now) {
    if (attemptsByAddress.size >= 10_000) {
      for (const [key, record] of attemptsByAddress) {
        if (record.expiresAt <= now) attemptsByAddress.delete(key);
      }
      if (attemptsByAddress.size >= 10_000) {
        attemptsByAddress.delete(attemptsByAddress.keys().next().value);
      }
    }
    const record = { count: 0, expiresAt: now + ATTEMPT_WINDOW_MS };
    attemptsByAddress.set(address, record);
    return record;
  }
  return existing;
}

export async function POST(request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let config;
  try {
    config = getAdminConfig();
  } catch (error) {
    if (!(error instanceof AdminConfigurationError)) throw error;
    console.error(error.message);
    return Response.json({ error: 'Admin authentication is not configured.' }, { status: 503 });
  }

  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const attempts = getAttemptRecord(address, now);
  if (attempts.count >= MAX_ATTEMPTS) {
    return Response.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429 });
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Expected a JSON request.' }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_LOGIN_PAYLOAD_BYTES) {
    return Response.json({ error: 'Sign-in request is too large.' }, { status: 413 });
  }

  let body;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_LOGIN_PAYLOAD_BYTES) {
      return Response.json({ error: 'Sign-in request is too large.' }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: 'Invalid JSON request.' }, { status: 400 });
  }
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  const validPassword = verifyPassword(password, config.passwordHash);
  if (username !== config.username || !validPassword) {
    attempts.count += 1;
    return Response.json(
      { error: 'Incorrect username or password.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  attemptsByAddress.delete(address);
  const cookieStore = await cookies();
  cookieStore.set('sv_session', createSessionToken(username, config.secret), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
