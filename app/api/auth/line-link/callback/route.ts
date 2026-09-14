import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/api/auth/signin?callbackUrl=/api/auth/line-link/callback', request.url));
  }

  const cookieStore = await cookies();
  const lineUserId = cookieStore.get('lineUserId_pending_link')?.value;

  if (!lineUserId) {
    return NextResponse.json({ error: 'No LINE User ID found in cookies. Link failed.' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { lineUserId },
    });
    
    // Clear the cookie
    cookieStore.delete('lineUserId_pending_link');
    
    // Return a success page
    return new NextResponse(`
      <html>
        <head><title>Success</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #ecfdf5; color: #065f46; text-align: center;">
          <div>
            <h1 style="font-size: 3rem; margin-bottom: 0;">🎉</h1>
            <h2>Account Linked Successfully!</h2>
            <p>Your LINE account has been connected to your OS Profile.</p>
            <p>You can close this window and go back to LINE.</p>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('Failed to link LINE account:', error);
    return NextResponse.json({ error: 'Failed to link account to Database.' }, { status: 500 });
  }
}
