import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPasswordHash,
  createSessionToken,
  SESSION_TTL_SECONDS,
  verifyPassword,
  verifySessionToken,
} from '../src/lib/auth.js';

test('password hashes verify without accepting plaintext or malformed hashes', () => {
  const hash = createPasswordHash('a-long-test-password');
  assert.match(hash, /^pbkdf2\$\d+\$/);
  assert.equal(verifyPassword('a-long-test-password', hash), true);
  assert.equal(verifyPassword('incorrect-password', hash), false);
  assert.equal(verifyPassword('a-long-test-password', 'a-long-test-password'), false);
  assert.equal(verifyPassword('password', 'pbkdf2$999999999$bad$bad'), false);
});

test('admin credentials fail closed when production configuration is absent or weak', async () => {
  const { getAdminConfig, AdminConfigurationError } = await import('../src/lib/auth.js');
  const previous = {
    username: process.env.ADMIN_USERNAME,
    hash: process.env.ADMIN_PASSWORD_HASH,
    secret: process.env.ADMIN_SECRET,
  };
  delete process.env.ADMIN_USERNAME;
  delete process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_SECRET;
  try {
    assert.throws(getAdminConfig, AdminConfigurationError);
    process.env.ADMIN_USERNAME = 'admin';
    process.env.ADMIN_PASSWORD_HASH = createPasswordHash('a-long-test-password');
    process.env.ADMIN_SECRET = 'short';
    assert.throws(getAdminConfig, AdminConfigurationError);
  } finally {
    if (previous.username === undefined) delete process.env.ADMIN_USERNAME;
    else process.env.ADMIN_USERNAME = previous.username;
    if (previous.hash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = previous.hash;
    if (previous.secret === undefined) delete process.env.ADMIN_SECRET;
    else process.env.ADMIN_SECRET = previous.secret;
  }
});

test('signed admin sessions reject tampering, wrong identities, and expired sessions', () => {
  const now = Date.now();
  const token = createSessionToken('admin@example.org', 'a-secret-that-is-at-least-32-characters-long', now);
  assert.equal(verifySessionToken(token, 'admin@example.org', 'a-secret-that-is-at-least-32-characters-long', now), true);
  assert.equal(verifySessionToken(token, 'other', 'a-secret-that-is-at-least-32-characters-long', now), false);
  assert.equal(verifySessionToken(token, 'admin@example.org', 'different-secret-that-is-also-long', now), false);
  assert.equal(verifySessionToken(`${token.slice(0, -1)}0`, 'admin@example.org', 'a-secret-that-is-at-least-32-characters-long', now), false);
  assert.equal(
    verifySessionToken(token, 'admin@example.org', 'a-secret-that-is-at-least-32-characters-long', now + (SESSION_TTL_SECONDS + 1) * 1000),
    false
  );
});
