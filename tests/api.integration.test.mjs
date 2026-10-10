import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createPasswordHash } from '../src/lib/auth.js';

const nextCli = path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
const storageDirectory = await mkdtemp(path.join(os.tmpdir(), 'suryoday-api-test-'));
const storagePath = path.join(storageDirectory, 'site-content.json');
const username = 'integration-admin';
const password = 'integration-test-password';
const secret = 'integration-secret-that-is-at-least-32-characters';
let server;
let serverOutput = '';
let baseUrl;

async function getAvailablePort() {
  const socket = net.createServer();
  await new Promise((resolve, reject) => {
    socket.once('error', reject);
    socket.listen(0, '127.0.0.1', resolve);
  });
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  return port;
}

async function startServer() {
  const port = await getAvailablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverOutput = '';
  server = spawn(process.execPath, [nextCli, 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ADMIN_USERNAME: username,
      ADMIN_PASSWORD_HASH: createPasswordHash(password),
      ADMIN_SECRET: secret,
      SITE_CONTENT_PATH: storagePath,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on('data', (chunk) => { serverOutput += chunk.toString(); });

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next server exited early:\n${serverOutput}`);
    try {
      const response = await fetch(`${baseUrl}/api/site`, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw new Error(`Timed out waiting for Next server:\n${serverOutput}`);
}

async function stopServer() {
  if (!server || server.exitCode !== null) return;
  const processExited = new Promise((resolve) => server.once('exit', resolve));
  server.kill();
  await Promise.race([processExited, new Promise((resolve) => setTimeout(resolve, 5000))]);
  server = null;
}

before(startServer);
after(async () => {
  await stopServer();
  await rm(storageDirectory, { recursive: true, force: true });
});

test('admin API enforces access and publishes durable content to anonymous visitors', async () => {
  const origin = baseUrl;
  const original = await fetch(`${baseUrl}/api/site`).then((response) => response.json());

  const unauthorizedWrite = await fetch(`${baseUrl}/api/site`, {
    method: 'PUT',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify(original),
  });
  assert.equal(unauthorizedWrite.status, 401);

  const crossOriginLogin = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(crossOriginLogin.status, 403);

  const invalidLogin = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'wrong-password' }),
  });
  assert.equal(invalidLogin.status, 401);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const failedAttempt = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
        'X-Forwarded-For': '203.0.113.77',
      },
      body: JSON.stringify({ username, password: 'incorrect-password' }),
    });
    assert.equal(failedAttempt.status, 401);
  }
  const rateLimitedLogin = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      'X-Forwarded-For': '203.0.113.77',
    },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(rateLimitedLogin.status, 429);

  const login = await fetch(`${baseUrl}/api/admin/login`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=strict/i);
  assert.match(setCookie, /Secure/i);
  assert.match(setCookie, /Max-Age=43200/i);
  const cookie = setCookie.match(/sv_session=([^;]+)/)?.[1];
  assert.ok(cookie);

  const session = await fetch(`${baseUrl}/api/admin/session`, { headers: { Cookie: `sv_session=${cookie}` } });
  assert.equal(session.status, 200);
  assert.deepEqual(await session.json(), { authenticated: true });
  const anonymousSession = await fetch(`${baseUrl}/api/admin/session`);
  assert.equal(anonymousSession.status, 401);

  const published = structuredClone(original);
  published.brand.name = 'Published across sessions';
  published.contact.email = 'updated@example.org';
  const update = await fetch(`${baseUrl}/api/site`, {
    method: 'PUT',
    headers: { Origin: origin, Cookie: `sv_session=${cookie}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(published),
  });
  assert.equal(update.status, 200);

  const visitorRead = await fetch(`${baseUrl}/api/site`);
  const visibleContent = await visitorRead.json();
  assert.equal(visibleContent.brand.name, 'Published across sessions');
  assert.equal(visibleContent.contact.email, 'updated@example.org');
  assert.equal(visitorRead.headers.get('cache-control'), 'no-store');

  const crossOriginUpdate = await fetch(`${baseUrl}/api/site`, {
    method: 'PUT',
    headers: { Origin: 'https://attacker.example', Cookie: `sv_session=${cookie}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(published),
  });
  assert.equal(crossOriginUpdate.status, 403);

  const invalidUpdate = structuredClone(visibleContent);
  invalidUpdate.contact.email = 'invalid';
  const rejectedUpdate = await fetch(`${baseUrl}/api/site`, {
    method: 'PUT',
    headers: { Origin: origin, Cookie: `sv_session=${cookie}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidUpdate),
  });
  assert.equal(rejectedUpdate.status, 400);

  const logout = await fetch(`${baseUrl}/api/admin/logout`, {
    method: 'POST',
    headers: { Origin: origin, Cookie: `sv_session=${cookie}` },
  });
  assert.equal(logout.status, 200);
  assert.match(logout.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/i);
  const expiredSession = await fetch(`${baseUrl}/api/admin/session`);
  assert.equal(expiredSession.status, 401);

  const home = await fetch(baseUrl);
  assert.equal(home.status, 200);
  const homeHtml = await home.text();
  assert.match(homeHtml, /Suryoday Vruddhashram/);
  assert.match(homeHtml, /id="contact"/);
  assert.match(homeHtml, /Volunteer/);

  await stopServer();
  await startServer();
  const afterRestart = await fetch(`${baseUrl}/api/site`).then((response) => response.json());
  assert.equal(afterRestart.brand.name, 'Published across sessions');
  assert.equal(afterRestart.contact.email, 'updated@example.org');
});
