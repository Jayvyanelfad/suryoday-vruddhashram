import { cookies } from 'next/headers';
import {
  AdminConfigurationError,
  getAdminConfig,
  verifySessionToken,
} from '../../../../lib/auth.js';

const noStore = { 'Cache-Control': 'no-store' };

export async function GET() {
  let config;
  try {
    config = getAdminConfig();
  } catch (error) {
    if (!(error instanceof AdminConfigurationError)) throw error;
    console.error(error.message);
    return Response.json({ authenticated: false, error: 'Admin authentication is not configured.' }, { status: 503, headers: noStore });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('sv_session')?.value;
  if (!verifySessionToken(token, config.username, config.secret)) {
    return Response.json({ authenticated: false }, { status: 401, headers: noStore });
  }

  return Response.json({ authenticated: true }, { headers: noStore });
}
