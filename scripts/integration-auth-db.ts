import { prisma } from '../lib/prisma';
import { authOptions } from '../app/lib/auth';

async function main() {
  const ts = Date.now();
  const email = `integration-${ts}@example.com`;

  const signInResult = await authOptions.callbacks?.signIn?.({
    user: {
      id: `integration-user-${ts}`,
      email,
      name: 'Integration User',
      image: null,
    },
    account: {
      provider: 'google',
      providerAccountId: `google-integration-${ts}`,
      type: 'oauth',
      access_token: null,
      expires_at: null,
      id_token: null,
      refresh_token: null,
      scope: null,
      session_state: null,
      token_type: null,
    },
    credentials: undefined,
    email: undefined,
    profile: undefined,
  } as any);

  if (!signInResult) {
    throw new Error('signIn callback rejected integration user');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, email: true },
  });

  if (!dbUser) {
    throw new Error('user not persisted by signIn callback');
  }

  const token = await authOptions.callbacks?.jwt?.({
    token: { email },
    user: { email } as any,
    account: null,
    profile: undefined,
    trigger: undefined,
    isNewUser: false,
    session: undefined,
  } as any);

  if (!token?.userId) {
    throw new Error('jwt callback did not set userId');
  }

  const session = await authOptions.callbacks?.session?.({
    session: { user: { email } },
    token,
    user: undefined,
    newSession: undefined,
    trigger: undefined,
  } as any);

  const sessionUserId =
    session?.user && 'id' in session.user
      ? (session.user as { id?: string }).id
      : undefined;

  if (!sessionUserId) {
    throw new Error('session callback did not expose session.user.id');
  }

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
    throw new Error('failed to read back post with linked author');
  }

  const updatedPost = await prisma.post.update({
    where: { id: createdPost.id },
    data: { published: true },
  });

  if (!updatedPost.published) {
    throw new Error('post update failed in integration flow');
  }

  await prisma.post.delete({ where: { id: createdPost.id } });
  await prisma.user.delete({ where: { id: dbUser.id } });

  console.log('[integration] auth callbacks + db CRUD flow passed');
}

main()
  .catch((error) => {
    console.error('[integration] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
