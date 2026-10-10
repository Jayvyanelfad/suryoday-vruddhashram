import { cookies } from 'next/headers';
import { hasSameOrigin } from '../../../../lib/auth.js';

export async function POST(request) {
  if (!hasSameOrigin(request)) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.delete('sv_session');
  return Response.json({ ok: true });
}
