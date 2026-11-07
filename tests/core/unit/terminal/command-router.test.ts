import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  createCommandRouter,
  HybridCommandRouter,
} from "../../../../app/components/terminal/command-router";
import type {
  CommandContext,
  CommandHandler,
  TerminalHistoryItem,
  TerminalState,
  TerminalTheme,
} from "../../../../app/components/terminal/types";

function createMockContext(overrides?: Partial<TerminalState>): {
  context: CommandContext;
  getState: () => TerminalState;
  getHistory: () => TerminalHistoryItem[];
  getTheme: () => TerminalTheme | undefined;
} {
  const state: TerminalState = {
    isOpen: true,
    history: [],
    currentInput: "",
    historyIndex: -1,
    isStreaming: false,
    currentPath: "~",
    theme: "cyberpunk",
    ...overrides,
  };

  const context: CommandContext = {
    state,
    setHistory: (updater) => {
      if (typeof updater === "function") {
        state.history = updater(state.history);
      } else {
        state.history = updater;
      }
    },
    clearHistory: () => {
      state.history = [];
    },
    executeCommand: async () => undefined,
    setCurrentPath: (path) => {
      state.currentPath = path;
    },
    setTheme: (theme) => {
      state.theme = theme;
    },
  };

  return {
    context,
    getState: () => state,
    getHistory: () => state.history,
    getTheme: () => state.theme,
  };
}

describe("HybridCommandRouter - Static Command Routing", () => {
  let originalFetch: typeof globalThis.fetch;
  let fetchCallCount = 0;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchCallCount = 0;
    globalThis.fetch = (async () => {
      fetchCallCount++;
      throw new Error("Network call should not occur for static commands");
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("routes known static commands locally with zero network latency", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const staticCommands = [
      "help",
      "whoami",
      "skills",
      "projects",
      "resume",
      "contact",
      "date",
      "echo Hello Terminal",
      "pwd",
    ];

    for (const cmd of staticCommands) {
      const result = await router.route(cmd, context);
      expect(result).toBeDefined();
      expect(result.output.length).toBeGreaterThan(0);
      expect(result.isError).toBeFalsy();
    }

    // Ensure zero fetch calls were made for static commands
    expect(fetchCallCount).toBe(0);
  });

  test("routes clear command locally and returns clearScreen signal", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const result = await router.route("clear", context);
    expect(result.clearScreen).toBe(true);
    expect(result.output).toBe("");
    expect(fetchCallCount).toBe(0);
  });

  test("routes theme command and updates state without network calls", async () => {
    const router = new HybridCommandRouter();
    const { context, getTheme } = createMockContext({ theme: "cyberpunk" });

    const result = await router.route("theme matrix", context);
    expect(result.output).toContain("Switched display matrix to 'matrix'");
    expect(getTheme()).toBe("matrix");
    expect(fetchCallCount).toBe(0);
  });
});

describe("HybridCommandRouter - Security Guardrail Interception", () => {
  let originalFetch: typeof globalThis.fetch;
  let fetchCallCount = 0;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    fetchCallCount = 0;
    globalThis.fetch = (async () => {
      fetchCallCount++;
      return new Response("OK");
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("blocks script injection before network dispatch", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const maliciousInputs = [
      "<script>alert('pwned')</script>",
      "javascript:void(0)",
      "echo test <script src='hack.js'></script>",
    ];

    for (const input of maliciousInputs) {
      const result = await router.route(input, context);
      expect(result.isError).toBe(true);
      expect(result.output).toContain("[SECURITY AUDIT] Command rejected");
    }

    expect(fetchCallCount).toBe(0);
  });

  test("rejects inputs exceeding buffer limit without hitting API", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const oversized = `query ${"x".repeat(1100)}`;
    const result = await router.route(oversized, context);

    expect(result.isError).toBe(true);
    expect(result.output).toContain("[SECURITY AUDIT] Command rejected");
    expect(result.output).toContain("1000 character buffer limit");
    expect(fetchCallCount).toBe(0);
  });

  test("returns empty output on empty or whitespace strings without error", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const res1 = await router.route("", context);
    expect(res1.output).toBe("");

    const res2 = await router.route("     ", context);
    expect(res2.output).toBe("");
    expect(fetchCallCount).toBe(0);
  });
});

describe("HybridCommandRouter - Remote AI Dispatch & Streaming", () => {
  let originalFetch: typeof globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("dispatches unknown query to /api/terminal and streams chunks into history", async () => {
    let capturedUrl = "";
    let capturedBody = "";

    const chunks = [
      "[SYS-ADMIN] ",
      "Analyzing query... ",
      "Execution nominal.",
    ];
    const encoder = new TextEncoder();

    const mockStream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    originalFetch = globalThis.fetch;
    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      capturedUrl = url;
      capturedBody = init?.body as string;
      return new Response(mockStream, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context, getHistory } = createMockContext({
      currentPath: "~/projects",
      history: [
        { id: "1", type: "input", content: "whoami", timestamp: 100 },
        { id: "2", type: "output", content: "TaiChi", timestamp: 101 },
      ],
    });

    const result = await router.route("what is your background?", context);

    expect(capturedUrl).toBe("/api/terminal");
    const parsedBody = JSON.parse(capturedBody);
    expect(parsedBody.prompt).toBe("what is your background?");
    expect(parsedBody.currentPath).toBe("~/projects");
    expect(parsedBody.historySnapshot.length).toBe(2);

    expect(result.output).toBe(
      "[SYS-ADMIN] Analyzing query... Execution nominal.",
    );
    expect(result.isStreaming).toBe(false);

    // Verify streaming entry was added to context history and completed
    const history = getHistory();
    const streamItem = history.find((item) =>
      item.content.includes("Analyzing query"),
    );
    expect(streamItem).toBeDefined();
    expect(streamItem?.isStreaming).toBe(false);
  });

  test("handles non-streaming response body gracefully", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return new Response("Static AI response text", { status: 200 });
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const result = await router.route("explain architecture", context);
    expect(result.output).toBe("Static AI response text");
  });
});

describe("HybridCommandRouter - Offline Fallback Resiliency", () => {
  let originalFetch: typeof globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("falls back to offline Cyberpunk SysAdmin response when network throws", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("ECONNREFUSED: Uplink unavailable");
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const result = await router.route("tell me a story", context);

    expect(result).toBeDefined();
    expect(result.isError).toBe(false);
    expect(result.output).toContain("[SYS-ADMIN // LOCAL CORE]");
    expect(result.output).toContain("Anothai Vichapaiboon");
  });

  test("falls back to offline response when remote API returns HTTP 500 error", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return new Response("Internal Server Error", { status: 500 });
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const result = await router.route("system status check", context);
    expect(result.isError).toBe(false);
    expect(result.output).toContain("Autonomous mode active");
  });

  test("offline fallback handles security and privilege escalation queries safely", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("Offline");
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const exploitQueries = [
      "sudo rm -rf /",
      "root privilege escalation",
      "hack the host",
    ];

    for (const query of exploitQueries) {
      const result = await router.route(query, context);
      expect(result.isError).toBe(false);
      expect(result.output).toContain("[SECURITY ALERT]");
      expect(result.output).toContain("Clearance Level: GUEST");
    }
  });

  test("offline fallback handles hiring and contact queries", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("Offline");
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const hireResult = await router.route(
      "can I hire you for a project?",
      context,
    );
    expect(hireResult.output).toContain(
      "[SYS-ADMIN] Operational Status: Ready for engineering deployment.",
    );
    expect(hireResult.output).toContain("anothai.0978452316@gmail.com");
  });

  test("offline fallback handles AI and MCP queries", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("Offline");
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const aiResult = await router.route(
      "explain your mcp agent implementation",
      context,
    );
    expect(aiResult.output).toContain("[SYS-INTEL]");
    expect(aiResult.output).toContain("Model Context Protocol (MCP)");
  });

  test("offline fallback handles conversational greetings", async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      throw new Error("Offline");
    }) as unknown as typeof fetch;

    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const greetingResult = await router.route("hello there", context);
    expect(greetingResult.output).toContain(
      "[SYS-OPERATOR] Uplink established. Greetings, visitor.",
    );
  });
});

describe("HybridCommandRouter - Extension and Factory", () => {
  test("createCommandRouter returns a functional CommandRouter instance", () => {
    const router = createCommandRouter();
    expect(router).toBeDefined();
    expect(typeof router.route).toBe("function");
    expect(typeof router.register).toBe("function");
    expect(typeof router.unregister).toBe("function");
    expect(typeof router.getRegisteredCommands).toBe("function");
  });

  test("allows registering custom handlers and routes to them locally", async () => {
    const router = new HybridCommandRouter();
    const { context } = createMockContext();

    const pingHandler: CommandHandler = {
      name: "ping",
      description: "Ping pong test",
      execute: (args) => ({ output: `pong: ${args.join(" ")}` }),
    };

    router.register(pingHandler);
    const registered = router.getRegisteredCommands().map((c) => c.name);
    expect(registered).toContain("ping");

    const res = await router.route("ping localhost", context);
    expect(res.output).toBe("pong: localhost");

    router.unregister("ping");
    const updated = router.getRegisteredCommands().map((c) => c.name);
    expect(updated).not.toContain("ping");
  });
});
