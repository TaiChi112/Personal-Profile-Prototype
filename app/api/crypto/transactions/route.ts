import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'user_1';

    const transactions = await prisma.cryptoTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching crypto transactions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'user_1';

    const body = await request.json();
    const { type, amount, currency, price } = body;

    if (!type || amount === undefined || !currency || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await prisma.cryptoTransaction.create({
      data: {
        userId,
        type,
        amount: Number(amount),
        currency,
        price: Number(price),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating crypto transaction:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
