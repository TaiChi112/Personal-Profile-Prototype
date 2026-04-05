import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession, requireAuthenticatedSession } from '@/app/lib/require-admin-session';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAuthenticatedSession();
  if (error) {
    return error;
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'post not found' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const { id } = await params;
  const body = await request.json();

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: typeof body.title === 'string' ? body.title : undefined,
      content: typeof body.content === 'string' ? body.content : undefined,
      published: typeof body.published === 'boolean' ? body.published : undefined,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const { id } = await params;

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
