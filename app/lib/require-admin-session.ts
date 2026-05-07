/**
 * Auth.js v5 session guard utilities.
 *
 * These helpers are designed for use inside Next.js Route Handlers and
 * Server Actions. They call `auth()` (the v5 replacement for `getServerSession`)
 * and return typed discriminated results that allow callers to safely narrow
 * to the authenticated session without additional null-checks.
 */
import type { Session } from 'next-auth';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// ---------------------------------------------------------------------------
// Discriminated union return types — no `any`, fully type-safe
// ---------------------------------------------------------------------------

type AuthenticatedResult = {
  session: Session & { user: NonNullable<Session['user']> };
  error: null;
};

type UnauthenticatedResult = {
  session: null;
  error: NextResponse;
};

type SessionGuardResult = AuthenticatedResult | UnauthenticatedResult;

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

/**
 * Asserts that a valid session exists.
 *
 * @returns `{ session, error: null }` when authenticated,
 *          or `{ session: null, error: 401 NextResponse }` otherwise.
 */
export async function requireAuthenticatedSession(): Promise<SessionGuardResult> {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }),
    };
  }

  return {
    session: session as Session & { user: NonNullable<Session['user']> },
    error: null,
  };
}

/**
 * Asserts that a valid admin session exists.
 *
 * @returns `null` when the caller is an authenticated admin.
 * @returns A `NextResponse` with status 401 or 403 otherwise.
 */
export async function requireAdminSession(): Promise<NextResponse | null> {
  const { session, error } = await requireAuthenticatedSession();

  if (error !== null || !session) return error;

  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  return null;
}