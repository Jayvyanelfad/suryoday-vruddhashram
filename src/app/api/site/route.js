import { cookies } from 'next/headers';
import {
  AdminConfigurationError,
  getAdminConfig,
  hasSameOrigin,
  verifySessionToken,
} from '../../../lib/auth.js';
import { readSiteContent, writeSiteContent } from '../../../lib/site-store.js';

const MAX_PAYLOAD_BYTES = 256 * 1024;

async function isAuthenticated() {
  let config;
  try {
    config = getAdminConfig();
  } catch (error) {
    if (!(error instanceof AdminConfigurationError)) throw error;
    console.error(error.message);
    return null;
  }

  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get('sv_session')?.value, config.username, config.secret);
}

export async function GET() {
  try {
    const content = await readSiteContent();
    return Response.json(content, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to read site content:', error);
    return Response.json({ error: 'Unable to read site content.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const authenticated = await isAuthenticated();
  if (authenticated === null) {
    return Response.json({ error: 'Admin authentication is not configured.' }, { status: 503 });
  }
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return Response.json({ error: 'Site content is too large.' }, { status: 413 });
  }

  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_PAYLOAD_BYTES) {
      return Response.json({ error: 'Site content is too large.' }, { status: 413 });
    }

    const payload = JSON.parse(rawBody);
    const content = await writeSiteContent(payload);
    return Response.json(content, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return Response.json({ error: error.message || 'Invalid site content.' }, { status: 400 });
    }
    console.error('Unable to save site content:', error);
    return Response.json({ error: 'Unable to save site content.' }, { status: 500 });
  }
}
