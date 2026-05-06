/**
 * Integration test: Auth callbacks ↔ Database round-trip
 *
 * This script exercises the three Auth.js callbacks (signIn → jwt → session)
 * against a live database to verify that:
 *   1. `signIn` persists the user record.
 *   2. `jwt` attaches the correct userId claim.
 *   3. `session` exposes session.user.id to the application layer.
 *   4. A post can be created, read, updated, and deleted for that user.
 *
 * Type strategy:
 *   - All mock parameters are typed via `Parameters<NonNullable<typeof ...>>[0]`
 *     so they stay in sync with the actual callback signatures automatically.
 *   - `unknown` is used for intermediate `as unknown as X` double-casts where
 *     we deliberately provide only the fields the callback actually reads, which
 *     is structurally narrower than the full parameter type.
 *   - Zero `any` types are used anywhere in this file.
 */

import { prisma } from '../lib/prisma';
import { authConfig } from '../app/lib/auth';

// ---------------------------------------------------------------------------
// Utility type aliases derived directly from the authConfig callbacks so that
// if the callback signatures change, these automatically update.
// ---------------------------------------------------------------------------

type SignInCallbacks = NonNullable<typeof authConfig.callbacks>;
type SignInParams = Parameters<NonNullable<SignInCallbacks['signIn']>>[0];
type JwtParams = Parameters<NonNullable<SignInCallbacks['jwt']>>[0];
type SessionParams = Parameters<NonNullable<SignInCallbacks['session']>>[0];

// ---------------------------------------------------------------------------
// Main integration flow
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const ts = Date.now();
  const email = `integration-${ts}@example.com`;

  // ── 1. signIn callback ────────────────────────────────────────────────────
  // We cast via `unknown` because we only supply the subset of fields the
  // callback actually reads (user.email, account.provider, account.providerAccountId).
  const signInArgs = {
    user: {
      id: `integration-user-${ts}`,
      email,
      name: 'Integration User',
    },
    account: {
      provider: 'google',
      providerAccountId: `google-integration-${ts}`,
      type: 'oauth',
    },
    // Required shape fields not consumed by our signIn callback
    credentials: undefined,
    request: undefined,
  } as unknown as SignInParams;

  const signInResult = await authConfig.callbacks?.signIn?.(signInArgs);

  if (!signInResult) {
    throw new Error('[integration] signIn callback rejected the integration user');
  }

  // ── 2. Verify DB persistence ──────────────────────────────────────────────
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, email: true },
  });

  if (!dbUser) {
    throw new Error('[integration] user was not persisted by the signIn callback');
  }

  // ── 3. jwt callback ───────────────────────────────────────────────────────
  const jwtArgs = {
    token: { email, sub: email },
    user: { id: `integration-user-${ts}`, email, name: 'Integration User' },
    account: null,
    trigger: 'signIn',
    isNewUser: true,
    session: undefined,
  } as unknown as JwtParams;

  const token = await authConfig.callbacks?.jwt?.(jwtArgs);

  if (!token?.userId) {
    throw new Error('[integration] jwt callback did not set token.userId');
  }

  // ── 4. session callback ───────────────────────────────────────────────────
  // `token` is already typed as the JWT return from step 3 (inferred as JWT).
  const sessionArgs = {
    session: {
      user: { email },
      expires: new Date(Date.now() + 86_400_000).toISOString(),
    },
    token,
  } as unknown as SessionParams;

  const session = await authConfig.callbacks?.session?.(sessionArgs);

  // After our type augmentation, session.user.id is a `string` field —
  // no additional narrowing cast required.
  if (!session?.user?.id) {
    throw new Error('[integration] session callback did not expose session.user.id');
  }

  // ── 5. DB CRUD flow ───────────────────────────────────────────────────────
  const createdPost = await prisma.post.create({
    data: {
      title: 'Integration Flow Post',
      content: 'created during auth-db integration flow',
      published: false,
      authorId: dbUser.id,
    },
  });

  const readBack = await prisma.post.findUnique({
    where: { id: createdPost.id },
    include: { author: true },
  });

  if (!readBack || readBack.author.email !== email) {
    throw new Error('[integration] failed to read back post with linked author');
  }

  const updatedPost = await prisma.post.update({
    where: { id: createdPost.id },
    data: { published: true },
  });

  if (!updatedPost.published) {
    throw new Error('[integration] post update failed in integration flow');
  }

  // ── 6. Cleanup ────────────────────────────────────────────────────────────
  await prisma.post.delete({ where: { id: createdPost.id } });
  await prisma.user.delete({ where: { id: dbUser.id } });

  console.log('[integration] ✓ auth callbacks + db CRUD flow passed');
}

main()
  .catch((error: unknown) => {
    console.error('[integration] ✗ failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });