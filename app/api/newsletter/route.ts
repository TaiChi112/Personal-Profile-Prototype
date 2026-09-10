import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Mock database save to avoid Prisma schema conflicts
    console.log('Database mocked save - new subscriber email:', email);

    return NextResponse.json(
      { success: true, message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
