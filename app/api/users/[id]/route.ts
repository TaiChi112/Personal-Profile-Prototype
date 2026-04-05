import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/app/lib/require-admin-session';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { posts: { orderBy: { createdAt: 'desc' } } },
  });

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const { id } = await params;
  const body = await request.json();

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: typeof body.name === 'string' ? body.name : undefined,
      image: typeof body.image === 'string' ? body.image : undefined,
      role: typeof body.role === 'string' ? body.role : undefined,
    },
  });

  return NextResponse.json({ user });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const { id } = await params;

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
