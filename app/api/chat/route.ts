import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { source } from '@/app/lib/source';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const query = lastMessage?.content?.toLowerCase() || '';

  const pages = query ? source.getPages().filter(page => {
    const title = page.data.title.toLowerCase();
    const desc = page.data.description?.toLowerCase() || '';
    
    return title.includes(query) || query.includes(title) || 
           (desc && (desc.includes(query) || query.includes(desc)));
  }).slice(0, 3) : [];

  let systemPrompt = "You are an AI assistant specialized in Computer Science, Finance, Business, and Wellness. Communicate using Thai Core Hybrid English (Thai grammar with English technical terms). Never use emojis. Keep answers structured, professional, and concise.";

  if (pages.length > 0) {
    systemPrompt += "\n\nContext information:\n";
    pages.forEach(page => {
      systemPrompt += `\nTitle: ${page.data.title}\nDescription: ${page.data.description || 'N/A'}\nURL: ${page.url}\n`;
    });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
