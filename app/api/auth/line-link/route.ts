import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get('lineUserId');

  if (!lineUserId) {
    return NextResponse.json({ error: 'Missing lineUserId' }, { status: 400 });
  }

  // Pass lineUserId directly in the callbackUrl as a query parameter
  // This avoids issues with in-app browsers (like LINE) losing cookies during the Google OAuth redirect chain.
  const callbackUrl = encodeURIComponent(`/api/auth/line-link/callback?lineUserId=${lineUserId}`);

  // Redirect to sign in and then to our callback with the ID
  return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, request.url));
}
