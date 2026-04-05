import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/app/lib/require-admin-session';

export async function GET() {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      posts: {
        select: { id: true, title: true, published: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const authError = await requireAdminSession();
  if (authError) {
    return authError;
  }

  const body = await request.json();

  if (!body?.email || typeof body.email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const provider = typeof body.provider === 'string' ? body.provider : 'manual';
  const providerAccountId = typeof body.providerAccountId === 'string'
    ? body.providerAccountId
    : `manual-${Date.now()}`;

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: typeof body.name === 'string' ? body.name : null,
      image: typeof body.image === 'string' ? body.image : null,
      role: typeof body.role === 'string' ? body.role : 'viewer',
      provider,
      providerAccountId,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
