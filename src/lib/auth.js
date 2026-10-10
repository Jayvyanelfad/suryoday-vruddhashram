import crypto from 'node:crypto';

const PASSWORD_HASH_ITERATIONS = 210_000;
const MIN_ACCEPTED_ITERATIONS = 100_000;
const MAX_ACCEPTED_ITERATIONS = 1_000_000;
export const SESSION_TTL_SECONDS = 60 * 60 * 12;

export class AdminConfigurationError extends Error {}

export function getAdminConfig() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !ADMIN_SECRET || ADMIN_SECRET.length < 32) {
    throw new AdminConfigurationError(
      'Set ADMIN_USERNAME, ADMIN_PASSWORD_HASH, and an ADMIN_SECRET of at least 32 characters.'
    );
  }

  return { username: ADMIN_USERNAME, passwordHash: ADMIN_PASSWORD_HASH, secret: ADMIN_SECRET };
}

export function createPasswordHash(password) {
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('Admin passwords must contain at least 12 characters.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(password, salt, PASSWORD_HASH_ITERATIONS, 64, 'sha512').toString('hex');
  return `pbkdf2$${PASSWORD_HASH_ITERATIONS}$${salt}$${derived}`;
}

export function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;

  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expected = parts[3];
  if (
    !Number.isInteger(iterations) ||
    iterations < MIN_ACCEPTED_ITERATIONS ||
    iterations > MAX_ACCEPTED_ITERATIONS ||
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{128}$/.test(expected)
  ) {
    return false;
  }

  const actual = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), actual);
}

export function createSessionToken(username, secret, now = Date.now()) {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const nonce = crypto.randomBytes(16).toString('hex');
  const encodedUsername = Buffer.from(username).toString('base64url');
  const payload = `v1.${encodedUsername}.${expiresAt}.${nonce}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token, username, secret, now = Date.now()) {
  if (typeof token !== 'string' || typeof username !== 'string' || typeof secret !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 5 || parts[0] !== 'v1' || parts[1] !== Buffer.from(username).toString('base64url')) return false;
  const expiresAt = Number(parts[2]);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;
  if (!/^[a-f0-9]{32}$/.test(parts[3]) || !/^[a-f0-9]{64}$/.test(parts[4])) return false;

  const payload = parts.slice(0, 4).join('.');
  const expected = crypto.createHmac('sha256', secret).update(payload).digest();
  const actual = Buffer.from(parts[4], 'hex');
  return crypto.timingSafeEqual(expected, actual);
}

export function hasSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    const requestUrl = new URL(request.url);
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || requestUrl.host;
    const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || requestUrl.protocol.slice(0, -1);
    return new URL(origin).origin === new URL(`${protocol}://${host}`).origin;
  } catch {
    return false;
  }
}
