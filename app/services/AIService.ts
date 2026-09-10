import { google } from '@ai-sdk/google';
import { streamText, tool, Message } from 'ai';
import { z } from 'zod';
import { source } from '@/app/lib/source';

export class AIService {
  private static failureCount = 0;
  private static lastFailureTime = 0;
  private static readonly FAILURE_THRESHOLD = 3;
  private static readonly COOLDOWN_PERIOD = 60000; // 1 minute

  private static isCircuitOpen(): boolean {
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.COOLDOWN_PERIOD) {
        // Half-open state: allow a request to try again
        this.failureCount = 0; 
        return false;
      }
      return true; // Circuit remains open
    }
    return false; // Circuit is closed, normal operation
  }

  private static recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    console.warn(`[AIService] API failure recorded. Count: ${this.failureCount}`);
  }

  private static recordSuccess() {
    if (this.failureCount > 0) {
      console.log(`[AIService] API successful. Resetting failure count.`);
    }
    this.failureCount = 0;
  }

  static async generateChatResponse(messages: Message[]) {
    if (this.isCircuitOpen()) {
      console.warn(`[AIService] Circuit is OPEN. Returning fallback response.`);
      return this.getFallbackResponse();
    }

    try {
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

      // Implement an AbortController for custom timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort(new Error('AI API timeout'));
      }, 25000); // 25 second timeout

      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: systemPrompt,
        messages,
        abortSignal: abortController.signal,
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
        onFinish: () => {
          clearTimeout(timeoutId);
          this.recordSuccess();
        },
      });

      return result.toUIMessageStreamResponse();

    } catch (error) {
      console.error("[AIService] Error generating chat response:", error);
      this.recordFailure();
      return this.getFallbackResponse();
    }
  }

  static getFallbackResponse() {
    const fallbackMessage = "The AI is currently resting. Please try again later.";
    
    // Create a fallback ReadableStream in Vercel AI SDK text-stream protocol format
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // Text chunks in Vercel AI SDK protocol start with '0:'
        controller.enqueue(encoder.encode(`0:${JSON.stringify(fallbackMessage)}\n`));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-vercel-ai-data-stream': 'v1'
      }
    });
  }
}

export default AIService;
