import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: "You are an AI assistant specialized in Computer Science, Finance, Business, and Wellness. Communicate using Thai Core Hybrid English (Thai grammar with English technical terms). Never use emojis. Keep answers structured, professional, and concise.",
    messages,
  });

  return result.toDataStreamResponse();
}
