import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get('lineUserId');

  if (!lineUserId) {
    return NextResponse.json({ error: 'Missing lineUserId' }, { status: 400 });
  }

  // Set cookie to remember the lineUserId during the OAuth flow
  const cookieStore = await cookies();
  cookieStore.set('lineUserId_pending_link', lineUserId, { path: '/', maxAge: 60 * 60 });

  // Redirect to sign in and then to our callback
  return NextResponse.redirect(new URL('/api/auth/signin?callbackUrl=/api/auth/line-link/callback', request.url));
}
