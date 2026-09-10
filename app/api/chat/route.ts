

import { NextRequest } from 'next/server';
import { AIService } from '@/app/services/AIService';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  return AIService.generateChatResponse(messages);
}
