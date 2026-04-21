import { prisma } from '../lib/prisma';

async function main() {
  const ts = Date.now();
  const email = `crud-example-${ts}@example.com`;

  const createdUser = await prisma.user.create({
    data: {
      email,
      name: 'CRUD Example User',
      role: 'viewer',
      provider: 'script',
      providerAccountId: `script-${ts}`,
    },
  });
  console.log('[crud] created user:', createdUser.id, createdUser.email);

  const createdPost = await prisma.post.create({
    data: {
      title: 'CRUD Example Post',
      content: 'created by prisma-crud-example.ts',
      published: false,
      authorId: createdUser.id,
    },
  });
  console.log('[crud] created post:', createdPost.id);

  const readUser = await prisma.user.findUnique({
    where: { id: createdUser.id },
    include: { posts: true },
  });
  console.log('[crud] read user with posts:', readUser?.posts.length ?? 0);

  const updatedPost = await prisma.post.update({
    where: { id: createdPost.id },
    data: {
      title: 'CRUD Example Post (Updated)',
      published: true,
    },
  });
  console.log('[crud] updated post published:', updatedPost.published);

  await prisma.post.delete({ where: { id: createdPost.id } });
  console.log('[crud] deleted post');

  await prisma.user.delete({ where: { id: createdUser.id } });
  console.log('[crud] deleted user');

  console.log('[crud] done');
}

main()
  .catch((error) => {
    console.error('[crud] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
