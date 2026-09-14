import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get('lineUserId');

  if (!lineUserId) {
    return NextResponse.json({ error: 'No LINE User ID provided in URL. Link failed.' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    // If not logged in, redirect them back to sign in, preserving the callback URL
    const callbackUrl = encodeURIComponent(`/api/auth/line-link/callback?lineUserId=${lineUserId}`);
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lineUserId },
    });
    
    // Return a success page
    return new NextResponse(`
      <html>
        <head>
          <title>Account Linked</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #ecfdf5; color: #065f46; text-align: center; margin: 0; padding: 20px;">
          <div>
            <h1 style="font-size: 4rem; margin-bottom: 10px; margin-top: 0;">🎉</h1>
            <h2>Account Linked Successfully!</h2>
            <p>Your LINE account has been connected to your OS Profile.</p>
            <p style="margin-top: 20px; font-weight: bold; padding: 10px; background: #d1fae5; border-radius: 8px;">
              You can now close this window and say Hello to the bot in LINE!
            </p>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('Failed to link LINE account:', error);
    return NextResponse.json({ error: 'Failed to link account to Database.' }, { status: 500 });
  }
}
