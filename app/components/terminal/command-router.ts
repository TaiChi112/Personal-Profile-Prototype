import {
  CommandParser,
  parseCommandLine,
  sanitizeInput,
} from "./command-parser";
import type {
  AITerminalRequest,
  CommandContext,
  CommandHandler,
  CommandResult,
  CommandRouter,
} from "./types";

/**
 * Generate a local Cyberpunk SysAdmin response when network/API uplink is unreachable.
 */
function getOfflineCyberpunkResponse(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (
    lower.includes("hack") ||
    lower.includes("sudo") ||
    lower.includes("root") ||
    lower.includes("rm -rf")
  ) {
    return [
      "[SECURITY ALERT] Level 5 breach attempt intercepted.",
      "Clearance Level: GUEST (Read-Only). Elevated privileges required.",
      "Incident reported to audit daemon.",
    ].join("\n");
  }

  if (
    lower.includes("hire") ||
    lower.includes("job") ||
    lower.includes("work") ||
    lower.includes("contact")
  ) {
    return [
      "[SYS-ADMIN] Operational Status: Ready for engineering deployment.",
      "Target Candidate: Anothai Vichapaiboon (Software Engineer).",
      "Direct Channel:    anothai.0978452316@gmail.com",
      "GitHub Node:       https://github.com/TaiChi112",
    ].join("\n");
  }

  if (
    lower.includes("ai") ||
    lower.includes("mcp") ||
    lower.includes("agent") ||
    lower.includes("rag")
  ) {
    return [
      "[SYS-INTEL] Host architecture includes Model Context Protocol (MCP),",
      "Vercel AI SDK integration, and Human-in-the-Loop OCR processing.",
      "Explore related projects via 'projects' command.",
    ].join("\n");
  }

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return [
      "[SYS-OPERATOR] Uplink established. Greetings, visitor.",
      "Welcome to Anothai Vichapaiboon's interactive system mainframe.",
      "Type 'help' to inspect available system subroutines.",
    ].join("\n");
  }

  return [
    `[SYS-ADMIN // LOCAL CORE] Query recorded: "${prompt}"`,
    "Autonomous mode active. Host system: Anothai Vichapaiboon (Software Engineer).",
    "Specialization: TypeScript, React 19, Next.js 16, Distributed Systems & AI Pipelines.",
    "Execute 'help' to review available terminal subroutines or 'projects' to view codebases.",
  ].join("\n");
}

/**
 * Hybrid Command Router implementation.
 * Dispatches static UNIX-like commands locally with zero latency,
 * and streams freeform AI conversational queries to /api/terminal.
 */
export class HybridCommandRouter implements CommandRouter {
  private parser: CommandParser;

  constructor(parser: CommandParser = new CommandParser()) {
    this.parser = parser;
  }

  public register(handler: CommandHandler): void {
    this.parser.register(handler);
  }

  public unregister(name: string): void {
    this.parser.unregister(name);
  }

  public getRegisteredCommands(): CommandHandler[] {
    return this.parser.getRegisteredCommands();
  }

  public async route(
    rawInput: string,
    context: CommandContext,
  ): Promise<CommandResult> {
    const validation = sanitizeInput(rawInput);
    if (!validation.isValid) {
      return {
        output: `[SECURITY AUDIT] Command rejected: ${validation.rejectionReason}`,
        isError: true,
      };
    }

    const cleaned = validation.sanitized;
    if (!cleaned) {
      return { output: "" };
    }

    const command = parseCommandLine(cleaned);

    // 1. Static Command Local Execution (Zero-Latency)
    if (this.parser.hasCommand(command.name)) {
      const result = await this.parser.execute(command, context);
      if (result) {
        return result;
      }
    }

    // 2. Natural Language / AI Query Dispatch to /api/terminal
    const streamItemId = `ai-stream-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const payload: AITerminalRequest = {
      prompt: cleaned,
      currentPath: context.state.currentPath || "~",
      historySnapshot: context.state.history.slice(-6).map((item) => ({
        role: item.type === "input" ? "user" : "assistant",
        content: item.content,
      })),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API returned HTTP status ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        const text = await response.text();
        return {
          output: text || getOfflineCyberpunkResponse(cleaned),
        };
      }

      // Initialize streaming entry in history
      let accumulated = "";
      const decoder = new TextDecoder();

      context.setHistory((prev) => [
        ...prev,
        {
          id: streamItemId,
          type: "output",
          content: "",
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        context.setHistory((prev) =>
          prev.map((item) =>
            item.id === streamItemId
              ? { ...item, content: accumulated, isStreaming: true }
              : item,
          ),
        );
      }

      // Mark streaming complete
      context.setHistory((prev) =>
        prev.map((item) =>
          item.id === streamItemId
            ? { ...item, content: accumulated, isStreaming: false }
            : item,
        ),
      );

      return {
        output: accumulated,
        isStreaming: false,
      };
    } catch {
      // 3. Resilient Fallback: Offline Cyberpunk SysAdmin Response
      const fallbackOutput = getOfflineCyberpunkResponse(cleaned);
      return {
        output: fallbackOutput,
        isError: false,
      };
    }
  }
}

/**
 * Factory helper to construct a new hybrid command router.
 */
export function createCommandRouter(): CommandRouter {
  return new HybridCommandRouter();
}
