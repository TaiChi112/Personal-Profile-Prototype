import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';
import { source } from '@/app/lib/source';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const query = lastMessage?.content?.toLowerCase() || '';

  const pages = query ? source.getPages().filter(page => {
    const title = page.data.title?.toLowerCase() || '';
    const desc = page.data.description?.toLowerCase() || '';
    
    return title.includes(query) || query.includes(title) || 
           (desc && (desc.includes(query) || query.includes(desc)));
  }).slice(0, 3) : [];

  let systemPrompt = "You are an AI assistant specialized in Computer Science, Finance, Business, and Wellness. Communicate using Thai Core Hybrid English (Thai grammar with English technical terms). Never use emojis. Keep answers structured, professional, and concise. You have access to actionable tools to fetch GitHub user profiles, log messages, and check crypto prices. Use these tools when relevant to the user's request.";

  if (pages.length > 0) {
    systemPrompt += "\n\nContext information:\n";
    pages.forEach(page => {
      systemPrompt += `\nTitle: ${page.data.title || 'N/A'}\nDescription: ${page.data.description || 'N/A'}\nURL: ${page.url}\n`;
    });
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
    tools: {
      getGithubUser: tool({
        description: 'Get public profile data of a GitHub user',
        parameters: z.object({
          username: z.string().describe('The GitHub username'),
        }),
        // @ts-expect-error
        execute: async ({ username }: { username: string }) => {
          const res = await fetch(`https://api.github.com/users/${username}`);
          return await res.json();
        },
      }),
      leaveMessage: tool({
        description: 'Leave a message for the website owner',
        parameters: z.object({
          message: z.string().describe('The message to leave'),
        }),
        // @ts-expect-error
        execute: async ({ message }: { message: string }) => {
          console.log(`New message: ${message}`);
          return { success: true };
        },
      }),
      getCryptoPrice: tool({
        description: 'Get the current price of a cryptocurrency in USD',
        parameters: z.object({
          coin: z.string().describe('The cryptocurrency coin ID (e.g., "bitcoin", "ethereum")'),
        }),
        // @ts-expect-error
        execute: async ({ coin }: { coin: string }) => {
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
          return await res.json();
        },
      }),
    } as any,
  });

  return result.toUIMessageStreamResponse();
}
