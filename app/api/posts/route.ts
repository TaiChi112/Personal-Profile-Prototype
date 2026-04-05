import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, requireAuthenticatedSession } from '@/app/lib/require-admin-session';

export async function GET() {
  const { error } = await requireAuthenticatedSession();
  if (error) {
    return error;
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const body = await request.json();

  if (!body?.title || typeof body.title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  if (!body?.authorId || typeof body.authorId !== 'string') {
    return NextResponse.json({ error: 'authorId is required' }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: typeof body.content === 'string' ? body.content : null,
      published: Boolean(body.published),
      authorId: body.authorId,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
