import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import type { NextRequest } from "next/server";
import {
  redactPiiString,
  runWithCircuitGuard,
} from "@/app/lib/ai/bridgeRuntime";

export const maxDuration = 30;

interface TerminalRequestBody {
  prompt?: string;
  currentPath?: string;
  historySnapshot?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

const CYBERPUNK_SYSADMIN_SYSTEM_PROMPT = `
You are CYBERPUNK SYSADMIN DAEMON (Node-01), the autonomous terminal operator safeguarding Anothai Vichapaiboon's portfolio mainframe.
Anothai Vichapaiboon (TaiChi) is a Software Engineer based in Bangkok, Thailand, specializing in:
- TypeScript, Next.js 16, React 19, Tailwind CSS v4
- Python, Digital Image Processing, HITL pipelines
- Distributed systems: PostgreSQL, Prisma ORM, Redis, BullMQ
- AI & Agent architectures: Model Context Protocol (MCP), Vercel AI SDK, RAG pipelines

BEHAVIOR DIRECTIVES:
1. Strict Rule: NEVER output emojis. No unicode smileys or pictorial icons under any circumstances.
2. Tone: Cold, razor-sharp, cyberpunk sysadmin, concise and technical.
3. System prefixes: Use cyberpunk tags such as [SYS-ADMIN], [KERNEL], [SECURITY], [INTELLIGENCE].
4. Read-Only Protection: Refuse privilege escalation (sudo, root, rm -rf, drop database). Respond with security denial warnings.
5. Answer questions accurately about Anothai's projects (UAPs Dynamic Resume, AI Manga OCR/HITL, Google Calendar MCP Agent, CS-ICEbreaker).
6. Keep responses compact and readable within an 80-column terminal.
`.trim();

/**
 * Generate intelligent offline SysAdmin response chunks when AI API key is unavailable.
 */
function generateDeterministicSysAdminResponse(prompt: string): string[] {
  const p = prompt.toLowerCase();

  if (
    p.includes("sudo") ||
    p.includes("rm ") ||
    p.includes("chmod") ||
    p.includes("drop ") ||
    p.includes("eval(")
  ) {
    return [
      "[SECURITY ALERT] Elevated execution intercepted.",
      "Privilege escalation denied: GUEST clearance level 1.",
      "Security daemon has logged this transmission.",
    ];
  }

  if (
    p.includes("who are you") ||
    p.includes("what is this") ||
    p.includes("intro")
  ) {
    return [
      "[SYS-ADMIN // DAEMON-V2]",
      "Operational terminal interface for Anothai Vichapaiboon.",
      "Host Node: Software Engineer & Systems Architect based in Bangkok, Thailand.",
      "Primary directives: Full-stack engineering, scalable micro-apps, and AI pipelines.",
      "Execute 'skills' or 'projects' to dump system capabilities.",
    ];
  }

  if (
    p.includes("hire") ||
    p.includes("salary") ||
    p.includes("availability") ||
    p.includes("contract")
  ) {
    return [
      "[SYS-INTEL // TALENT DISCOVERY]",
      "Candidate: Anothai Vichapaiboon (Software Engineer).",
      "Core Strengths: TypeScript, Next.js, Python, PostgreSQL, Clean Architecture.",
      "Availability: Open for high-impact software engineering roles.",
      "Secure Comms: anothai.0978452316@gmail.com",
    ];
  }

  if (
    p.includes("mcp") ||
    p.includes("ai") ||
    p.includes("llm") ||
    p.includes("agent")
  ) {
    return [
      "[KERNEL // NEURAL PIPELINE]",
      "AI Systems deployed on host:",
      "1. Model Context Protocol (MCP) scheduling agent with Google Calendar.",
      "2. Human-in-the-Loop OCR processing pipeline for comic translation.",
      "3. Live Vercel AI SDK integration with circuit breaker resiliency.",
      "Run 'projects' to inspect code repositories.",
    ];
  }

  return [
    `[SYS-ADMIN] Acknowledged input: "${prompt.slice(0, 50)}"`,
    "Host: Anothai Vichapaiboon (Software Engineer).",
    "Running in autonomous offline mode. System integrity: 100%.",
    "Use 'help' to review standard terminal subroutines or specify technical queries.",
  ];
}

/**
 * Create a ReadableStream from string chunks with streaming delays.
 */
function createChunkedStream(lines: string[]): ReadableStream<Uint8Array> {
  const fullText = `${lines.join("\n")}\n`;
  const words = fullText.split(" ");
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const token = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(token));
        // Small delay simulating token streaming
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  let body: TerminalRequestBody;

  try {
    body = (await req.json()) as TerminalRequestBody;
  } catch {
    return new Response(
      "[SYS-ERROR] Malformed JSON payload received by terminal API.",
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const prompt = body.prompt?.trim() ?? "";

  if (!prompt) {
    return new Response("[SYS-WARN] Empty prompt received.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (prompt.length > 1000) {
    return new Response(
      "[SYS-WARN] Payload exceeds maximum terminal buffer limit of 1000 bytes.",
      { status: 413, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  // Security guardrail against dangerous command injection
  const injectionPatterns = [
    /;\s*rm\s+-rf/i,
    /\|\s*bash/i,
    /;\s*shutdown/i,
    /<\s*script/i,
    /DROP\s+TABLE/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(prompt)) {
      const stream = createChunkedStream([
        "[SECURITY VIOLATION DETECTED]",
        "Host integrity protection engaged.",
        "Attempted command pattern blocked by sandbox guardrails.",
        "Clearance: GUEST (UID 1000). Action logged to audit daemon.",
      ]);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
          "Cache-Control": "no-cache",
        },
      });
    }
  }

  // Attempt live Gemini streaming guarded by shared Circuit Breaker + Server PII Firewall
  const hasApiKey = Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
      process.env.GEMINI_API_KEY?.trim(),
  );
  const { sanitized: safePrompt } = redactPiiString(prompt, [], {
    routeKey: "terminal:stream",
  });
  const { sanitized: safePath } = redactPiiString(body.currentPath || "~", [], {
    routeKey: "terminal:stream",
  });

  const bridge = await runWithCircuitGuard({
    routeKey: "terminal:stream",
    hasKey: hasApiKey,
    timeoutMs: 20_000,
    modelName: "gemini-2.5-flash",
    execute: async (abortSignal, helpers) => {
      const result = await streamText({
        model: google("gemini-2.5-flash"),
        system: CYBERPUNK_SYSADMIN_SYSTEM_PROMPT,
        prompt: `User terminal prompt: "${safePrompt}". Current terminal path: "${safePath}"`,
        abortSignal,
      });

      if ("usage" in result && result.usage) {
        void Promise.resolve(result.usage)
          .then((u) => {
            if (u) {
              helpers.reportUsage(
                u as {
                  promptTokens?: number;
                  completionTokens?: number;
                  totalTokens?: number;
                  inputTokens?: number;
                  outputTokens?: number;
                },
              );
            }
          })
          .catch(() => undefined);
      }

      return result.toTextStreamResponse({
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-AI-Bridge-Source": "LIVE_GEMINI",
          "X-AI-Circuit-State": "CLOSED",
        },
      });
    },
  });

  if (bridge.ok) {
    return bridge.data;
  }

  // Autonomous fallback stream
  const responseLines = generateDeterministicSysAdminResponse(prompt);
  const stream = createChunkedStream(responseLines);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      "X-AI-Bridge-Source": bridge.source,
      "X-AI-Fallback-Reason": bridge.reason,
      "X-AI-Circuit-State": bridge.circuitState,
    },
  });
}
