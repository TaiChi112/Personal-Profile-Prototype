import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function requireAuthenticatedSession() {
  const session = (await getServerSession(authOptions as any)) as {
    user?: {
      role?: string;
    };
  } | null;

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    };
  }

  return {
    session,
    error: null,
  };
}

export async function requireAdminSession() {
  const { session, error } = await requireAuthenticatedSession();

  if (error || !session) {
    return error;
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  return null;
}
