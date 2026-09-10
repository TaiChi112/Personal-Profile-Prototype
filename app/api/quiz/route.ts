import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { question, isCorrect } = await req.json();

    if (!question || typeof isCorrect !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Attempt to get an existing session cookie or create one for anonymous tracking
    let sessionId = req.headers.get('cookie')?.split('sessionId=')[1]?.split(';')[0];
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Save to DB
    const score = await prisma.quizScore.create({
      data: {
        question,
        isCorrect,
        sessionId,
      },
    });

    const response = NextResponse.json({ success: true, id: score.id });
    
    // Set cookie if we generated a new session
    if (!req.headers.get('cookie')?.includes('sessionId=')) {
      response.cookies.set('sessionId', sessionId, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    }

    return response;
  } catch (error) {
    console.error('Quiz API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
