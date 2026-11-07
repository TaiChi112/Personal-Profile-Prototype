import { describe, expect, it } from "bun:test";
import {
  CommandParser,
  parseCommandLine,
  sanitizeInput,
  staticCommandHandlers,
} from "../../components/terminal/command-parser";
import { HybridCommandRouter } from "../../components/terminal/command-router";
import type {
  CommandContext,
  TerminalState,
} from "../../components/terminal/types";

function createMockContext(
  initialState?: Partial<TerminalState>,
): CommandContext {
  const state: TerminalState = {
    isOpen: true,
    history: [],
    currentInput: "",
    historyIndex: -1,
    isStreaming: false,
    currentPath: "~",
    theme: "cyberpunk",
    ...initialState,
  };

  return {
    state,
    setHistory: () => {},
    clearHistory: () => {},
    executeCommand: async () => ({ output: "" }),
    setCurrentPath: (path: string) => {
      state.currentPath = path;
    },
    setTheme: (theme) => {
      state.theme = theme;
    },
  };
}

describe("Terminal Input Sanitization & Parser", () => {
  it("should sanitize valid input safely", () => {
    const res = sanitizeInput("help");
    expect(res.isValid).toBe(true);
    expect(res.sanitized).toBe("help");
  });

  it("should reject payloads exceeding 1000 characters", () => {
    const longString = "a".repeat(1005);
    const res = sanitizeInput(longString);
    expect(res.isValid).toBe(false);
    expect(res.rejectionReason).toContain("1000");
  });

  it("should reject malicious script injection", () => {
    const res = sanitizeInput("<script>alert('pwned')</script>");
    expect(res.isValid).toBe(false);
    expect(res.rejectionReason).toContain("Malicious payload");
  });

  it("should reject null bytes", () => {
    const res = sanitizeInput("whoami\0malicious");
    expect(res.isValid).toBe(false);
    expect(res.rejectionReason).toContain("Null byte");
  });

  it("should strip control characters", () => {
    const res = sanitizeInput("echo\x07 hello");
    expect(res.isValid).toBe(true);
    expect(res.sanitized).toBe("echo hello");
  });

  it("should parse command and split arguments respecting quotes", () => {
    const parsed = parseCommandLine(
      "echo \"systems architecture\" 'high performance' single",
    );
    expect(parsed.name).toBe("echo");
    expect(parsed.args).toEqual([
      "systems architecture",
      "high performance",
      "single",
    ]);
  });
});

describe("Terminal Static Commands", () => {
  const parser = new CommandParser(staticCommandHandlers);

  it("should execute help command", async () => {
    const ctx = createMockContext();
    const result = await parser.execute(
      { raw: "help", name: "help", args: [] },
      ctx,
    );
    expect(result).not.toBeNull();
    expect(result?.output).toContain("TERMINAL SUBSYSTEM HELP");
    expect(result?.output).toContain("whoami");
    expect(result?.output).toContain("projects");
  });

  it("should execute whoami command", async () => {
    const ctx = createMockContext();
    const result = await parser.execute(
      { raw: "whoami", name: "whoami", args: [] },
      ctx,
    );
    expect(result?.output).toContain("Anothai Vichapaiboon");
    expect(result?.output).toContain("Software Engineer");
  });

  it("should execute skills command", async () => {
    const ctx = createMockContext();
    const result = await parser.execute(
      { raw: "skills", name: "skills", args: [] },
      ctx,
    );
    expect(result?.output).toContain("TypeScript");
    expect(result?.output).toContain("Next.js 16");
    expect(result?.output).toContain("PostgreSQL");
  });

  it("should execute projects command and support alias ls", async () => {
    const ctx = createMockContext();
    const res1 = await parser.execute(
      { raw: "projects", name: "projects", args: [] },
      ctx,
    );
    const res2 = await parser.execute({ raw: "ls", name: "ls", args: [] }, ctx);
    expect(res1?.output).toContain("Universal Academic Portfolio System");
    expect(res2?.output).toContain("AI-Powered Manga OCR");
  });

  it("should execute resume command and support alias cv", async () => {
    const ctx = createMockContext();
    const res = await parser.execute({ raw: "cv", name: "cv", args: [] }, ctx);
    expect(res?.output).toContain("CURRICULUM VITAE");
    expect(res?.output).toContain("Ramkhamhaeng University");
  });

  it("should execute contact command", async () => {
    const ctx = createMockContext();
    const res = await parser.execute(
      { raw: "contact", name: "contact", args: [] },
      ctx,
    );
    expect(res?.output).toContain("anothai.0978452316@gmail.com");
    expect(res?.output).toContain("github.com/TaiChi112");
  });

  it("should execute clear command", async () => {
    const ctx = createMockContext();
    const res = await parser.execute(
      { raw: "clear", name: "clear", args: [] },
      ctx,
    );
    expect(res?.clearScreen).toBe(true);
  });

  it("should execute date command", async () => {
    const ctx = createMockContext();
    const res = await parser.execute(
      { raw: "date", name: "date", args: [] },
      ctx,
    );
    expect(res?.output).toContain("[SYS-TIME] UTC:");
  });

  it("should execute echo command", async () => {
    const ctx = createMockContext();
    const res = await parser.execute(
      { raw: "echo hello world", name: "echo", args: ["hello", "world"] },
      ctx,
    );
    expect(res?.output).toBe("hello world");
  });

  it("should switch theme when valid theme argument is passed", async () => {
    const ctx = createMockContext({ theme: "cyberpunk" });
    const res = await parser.execute(
      { raw: "theme matrix", name: "theme", args: ["matrix"] },
      ctx,
    );
    expect(res?.output).toContain("Switched display matrix to 'matrix'");
    expect(ctx.state.theme).toBe("matrix");
  });

  it("should reject invalid theme name", async () => {
    const ctx = createMockContext();
    const res = await parser.execute(
      { raw: "theme invalid", name: "theme", args: ["invalid"] },
      ctx,
    );
    expect(res?.isError).toBe(true);
    expect(res?.output).toContain("Invalid theme");
  });

  it("should print command history", async () => {
    const ctx = createMockContext({
      history: [
        {
          id: "1",
          type: "input",
          content: "help",
          timestamp: 1000,
        },
        {
          id: "2",
          type: "input",
          content: "skills",
          timestamp: 2000,
        },
      ],
    });
    const res = await parser.execute(
      { raw: "history", name: "history", args: [] },
      ctx,
    );
    expect(res?.output).toContain("help");
    expect(res?.output).toContain("skills");
  });
});

describe("Hybrid Command Router", () => {
  it("should route static commands with zero latency", async () => {
    const router = new HybridCommandRouter();
    const ctx = createMockContext();
    const res = await router.route("whoami", ctx);
    expect(res.output).toContain("Anothai Vichapaiboon");
  });

  it("should fallback gracefully on unknown conversational query when offline", async () => {
    const router = new HybridCommandRouter();
    const ctx = createMockContext();
    // Simulate query when offline / no server
    const res = await router.route("tell me about the architecture", ctx);
    expect(res.output).toBeDefined();
    expect(res.output.length).toBeGreaterThan(0);
    expect(res.isError).toBeFalsy();
  });
});
