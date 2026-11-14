import { google } from "@ai-sdk/google";
import { streamText, tool, type ModelMessage } from "ai";
import { z } from "zod";
import {
  getRouteCircuitBreaker,
  hasGoogleGeminiKey,
  redactPiiPayload,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";
import { source } from "@/app/lib/source";

export class AIService {
  static async generateChatResponse(
    messages: ModelMessage[],
  ): Promise<Response> {
    const breaker = getRouteCircuitBreaker("chat:assistant");

    if (!hasGoogleGeminiKey() || !breaker.canAttempt()) {
      const reason = !hasGoogleGeminiKey() ? "MISSING_API_KEY" : "CIRCUIT_OPEN";
      return AIService.getFallbackResponse(reason, breaker.getState());
    }

    const { sanitized: sanitizedMessages } = redactPiiPayload(messages);
    const lastMessage = sanitizedMessages[sanitizedMessages.length - 1];
    const query =
      typeof lastMessage?.content === "string"
        ? lastMessage.content.toLowerCase()
        : "";

    const pages = query
      ? source
          .getPages()
          .filter((page) => {
            const title = page.data.title?.toLowerCase() || "";
            const desc = page.data.description?.toLowerCase() || "";
            return (
              title.includes(query) ||
              query.includes(title) ||
              Boolean(desc && (desc.includes(query) || query.includes(desc)))
            );
          })
          .slice(0, 3)
      : [];

    let systemPrompt =
      "You are an AI assistant specialized in Computer Science, Finance, Business, and Wellness. Communicate using Thai Core Hybrid English (Thai grammar with English technical terms). Never use emojis. Keep answers structured, professional, and concise. You have access to actionable tools to fetch GitHub user profiles, log messages, and check crypto prices. Use these tools when relevant to the user's request.";

    if (pages.length > 0) {
      systemPrompt += "\n\nContext information:\n";
      for (const page of pages) {
        systemPrompt += `\nTitle: ${page.data.title || "N/A"}\nDescription: ${page.data.description || "N/A"}\nURL: ${page.url}\n`;
      }
    }

    const guard = await runWithCircuitGuard({
      routeKey: "chat:assistant",
      hasKey: hasGoogleGeminiKey(),
      timeoutMs: 25_000,
      execute: async (abortSignal) => {
        const result = await streamText({
          model: google("gemini-2.5-flash"),
          system: systemPrompt,
          messages: sanitizedMessages,
          abortSignal,
          tools: {
            getGithubUser: tool({
              description: "Get public profile data of a GitHub user",
              inputSchema: z.object({
                username: z.string().describe("The GitHub username"),
              }),
              execute: async ({ username }) => {
                const res = await fetch(
                  `https://api.github.com/users/${encodeURIComponent(username)}`,
                );
                return (await res.json()) as Record<string, unknown>;
              },
            }),
            leaveMessage: tool({
              description: "Leave a message for the website owner",
              inputSchema: z.object({
                message: z.string().describe("The message to leave"),
              }),
              execute: async ({ message }) => {
                console.log(`New message: ${message}`);
                return { success: true };
              },
            }),
            getCryptoPrice: tool({
              description: "Get the current price of a cryptocurrency in USD",
              inputSchema: z.object({
                coin: z
                  .string()
                  .describe(
                    'The cryptocurrency coin ID (e.g., "bitcoin", "ethereum")',
                  ),
              }),
              execute: async ({ coin }) => {
                const res = await fetch(
                  `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=usd`,
                );
                return (await res.json()) as Record<string, unknown>;
              },
            }),
          },
        });

        return result.toUIMessageStreamResponse({
          headers: {
            "X-AI-Bridge-Source": "LIVE_GEMINI",
            "X-AI-Circuit-State": "CLOSED",
          },
        });
      },
    });

    if (!guard.ok) {
      return AIService.getFallbackResponse(guard.reason, guard.circuitState);
    }

    return guard.data;
  }

  static getFallbackResponse(
    reason = "FALLBACK_TRIGGERED",
    circuitState: "CLOSED" | "OPEN" = "CLOSED",
  ): Response {
    const fallbackMessage =
      "The AI is currently resting. Please try again later.";

    // Create a fallback ReadableStream in Vercel AI SDK text-stream protocol format
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        // Text chunks in Vercel AI SDK protocol start with '0:'
        controller.enqueue(
          encoder.encode(`0:${JSON.stringify(fallbackMessage)}\n`),
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
        "X-AI-Bridge-Source": "FALLBACK_TRIGGERED",
        "X-AI-Fallback-Reason": reason,
        "X-AI-Circuit-State": circuitState,
      },
    });
  }
}

export default AIService;
