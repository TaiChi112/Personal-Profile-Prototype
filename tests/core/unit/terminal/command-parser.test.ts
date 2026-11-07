import { describe, expect, test } from "bun:test";
import {
  CommandParser,
  parseCommandLine,
  sanitizeInput,
} from "../../../../app/components/terminal/command-parser";
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

describe("CommandParser - Static Commands", () => {
  const parser = new CommandParser();

  test("should register all expected default static commands", () => {
    const commands = parser.getRegisteredCommands();
    const commandNames = commands.map((c) => c.name);

    expect(commandNames).toContain("help");
    expect(commandNames).toContain("whoami");
    expect(commandNames).toContain("skills");
    expect(commandNames).toContain("projects");
    expect(commandNames).toContain("resume");
    expect(commandNames).toContain("contact");
    expect(commandNames).toContain("clear");
    expect(commandNames).toContain("date");
    expect(commandNames).toContain("echo");
    expect(commandNames).toContain("theme");
    expect(commandNames).toContain("history");
    expect(commandNames).toContain("pwd");
    expect(commandNames).toContain("exit");
  });

  test("help command returns usage directory and honors aliases", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("help");
    const result = await parser.execute(cmd, context);
    expect(result).not.toBeNull();
    expect(result?.output).toContain("TERMINAL SUBSYSTEM HELP");
    expect(result?.output).toContain("whoami");
    expect(result?.output).toContain("skills");

    const aliasQuestion = parseCommandLine("?");
    const aliasResult = await parser.execute(aliasQuestion, context);
    expect(aliasResult?.output).toContain("TERMINAL SUBSYSTEM HELP");

    const aliasMan = parseCommandLine("man");
    const manResult = await parser.execute(aliasMan, context);
    expect(manResult?.output).toContain("TERMINAL SUBSYSTEM HELP");
  });

  test("whoami command returns developer profile and honors aliases", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("whoami");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("Anothai Vichapaiboon (TaiChi)");
    expect(result?.output).toContain("Software Engineer");

    for (const alias of ["id", "bio", "about"]) {
      const aliasCmd = parseCommandLine(alias);
      const aliasRes = await parser.execute(aliasCmd, context);
      expect(aliasRes?.output).toContain("Anothai Vichapaiboon (TaiChi)");
    }
  });

  test("skills command outputs core technical competencies and honors aliases", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("skills");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("TypeScript");
    expect(result?.output).toContain("Next.js 16");
    expect(result?.output).toContain("React 19");
    expect(result?.output).toContain("Model Context Protocol (MCP)");

    for (const alias of ["stack", "tech"]) {
      const aliasRes = await parser.execute(parseCommandLine(alias), context);
      expect(aliasRes?.output).toContain("CORE TECHNICAL ARSENAL");
    }
  });

  test("projects command lists featured software projects and honors aliases", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("projects");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("Universal Academic Portfolio System");
    expect(result?.output).toContain("Google Calendar AI Agent");
    expect(result?.output).toContain("AI-Powered Manga OCR");

    for (const alias of ["ls", "portfolio"]) {
      const aliasRes = await parser.execute(parseCommandLine(alias), context);
      expect(aliasRes?.output).toContain("FEATURED PROJECTS");
    }
  });

  test("resume command displays curriculum vitae and honors cv alias", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("resume");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("CURRICULUM VITAE");
    expect(result?.output).toContain("Anothai Vichapaiboon");
    expect(result?.output).toContain("Ramkhamhaeng University");

    const cvRes = await parser.execute(parseCommandLine("cv"), context);
    expect(cvRes?.output).toContain("CURRICULUM VITAE");
  });

  test("contact command returns contact channels and honors aliases", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("contact");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("anothai.0978452316@gmail.com");
    expect(result?.output).toContain("https://github.com/TaiChi112");

    for (const alias of ["email", "reach"]) {
      const aliasRes = await parser.execute(parseCommandLine(alias), context);
      expect(aliasRes?.output).toContain("anothai.0978452316@gmail.com");
    }
  });

  test("clear command signals clearScreen flag and cls alias works", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("clear");
    const result = await parser.execute(cmd, context);
    expect(result?.clearScreen).toBe(true);
    expect(result?.output).toBe("");

    const clsRes = await parser.execute(parseCommandLine("cls"), context);
    expect(clsRes?.clearScreen).toBe(true);
  });

  test("date command outputs current timestamp and time alias works", async () => {
    const { context } = createMockContext();

    const cmd = parseCommandLine("date");
    const result = await parser.execute(cmd, context);
    expect(result?.output).toContain("[SYS-TIME] UTC:");
    expect(result?.output).toContain("[SYS-TIME] UNIX:");

    const timeRes = await parser.execute(parseCommandLine("time"), context);
    expect(timeRes?.output).toContain("[SYS-TIME]");
  });

  test("echo command correctly echoes arguments", async () => {
    const { context } = createMockContext();

    const emptyEcho = await parser.execute(parseCommandLine("echo"), context);
    expect(emptyEcho?.output).toBe("");

    const simpleEcho = await parser.execute(
      parseCommandLine("echo hello world"),
      context,
    );
    expect(simpleEcho?.output).toBe("hello world");

    const quotedEcho = await parser.execute(
      parseCommandLine('echo "systems architecture" v2'),
      context,
    );
    expect(quotedEcho?.output).toBe("systems architecture v2");
  });

  test("theme command displays options and switches theme", async () => {
    const { context, getTheme } = createMockContext({ theme: "cyberpunk" });

    // Without arguments: prints current and valid themes
    const infoRes = await parser.execute(parseCommandLine("theme"), context);
    expect(infoRes?.output).toContain("Current theme: 'cyberpunk'");
    expect(infoRes?.output).toContain("matrix");

    // Valid theme switch: matrix
    const matrixRes = await parser.execute(
      parseCommandLine("theme matrix"),
      context,
    );
    expect(matrixRes?.output).toContain("Switched display matrix to 'matrix'");
    expect(getTheme()).toBe("matrix");

    // Valid theme switch: retro-amber
    await parser.execute(parseCommandLine("theme retro-amber"), context);
    expect(getTheme()).toBe("retro-amber");

    // Valid theme switch: classic-dark
    await parser.execute(parseCommandLine("theme classic-dark"), context);
    expect(getTheme()).toBe("classic-dark");

    // Invalid theme switch
    const invalidRes = await parser.execute(
      parseCommandLine("theme neon-pink"),
      context,
    );
    expect(invalidRes?.isError).toBe(true);
    expect(invalidRes?.output).toContain("Invalid theme 'neon-pink'");
    expect(getTheme()).toBe("classic-dark"); // Theme remains unchanged
  });

  test("history command lists previously executed input commands", async () => {
    const { context } = createMockContext({
      history: [
        { id: "1", type: "input", content: "whoami", timestamp: 1000 },
        { id: "2", type: "output", content: "TaiChi", timestamp: 1001 },
        { id: "3", type: "input", content: "skills", timestamp: 1002 },
      ],
    });

    const res = await parser.execute(parseCommandLine("history"), context);
    expect(res?.output).toContain("--- COMMAND HISTORY ---");
    expect(res?.output).toContain("whoami");
    expect(res?.output).toContain("skills");
    expect(res?.output).not.toContain("TaiChi"); // Output lines are not included
  });

  test("history command handles empty history buffer", async () => {
    const { context } = createMockContext({ history: [] });
    const res = await parser.execute(parseCommandLine("history"), context);
    expect(res?.output).toBe("No commands recorded in history.");
  });

  test("pwd and exit commands return expected outputs", async () => {
    const { context } = createMockContext({ currentPath: "/root/projects" });

    const pwdRes = await parser.execute(parseCommandLine("pwd"), context);
    expect(pwdRes?.output).toBe("/root/projects");

    const exitRes = await parser.execute(parseCommandLine("exit"), context);
    expect(exitRes?.output).toContain("[TERMINAL SESSION TERMINATED]");

    const quitRes = await parser.execute(parseCommandLine("quit"), context);
    expect(quitRes?.output).toContain("[TERMINAL SESSION TERMINATED]");
  });
});

describe("CommandParser - Command Line Tokenization", () => {
  test("handles empty and whitespace-only inputs", () => {
    expect(parseCommandLine("")).toEqual({ raw: "", name: "", args: [] });
    expect(parseCommandLine("   ")).toEqual({ raw: "   ", name: "", args: [] });
    expect(parseCommandLine("\t\n  ")).toEqual({
      raw: "\t\n  ",
      name: "",
      args: [],
    });
  });

  test("handles multiple spaces and irregular whitespace", () => {
    const cmd = parseCommandLine("   echo    first     second    ");
    expect(cmd.name).toBe("echo");
    expect(cmd.args).toEqual(["first", "second"]);
  });

  test("parses command names with case-insensitivity", () => {
    expect(parseCommandLine("HELP").name).toBe("help");
    expect(parseCommandLine("WhoAmI").name).toBe("whoami");
    expect(parseCommandLine("SkILls").name).toBe("skills");
    expect(parseCommandLine("ECHO hello").name).toBe("echo");
  });

  test("preserves quoted arguments with spaces", () => {
    const doubleQuoted = parseCommandLine(
      'echo "distributed systems" "pattern lab"',
    );
    expect(doubleQuoted.args).toEqual(["distributed systems", "pattern lab"]);

    const singleQuoted = parseCommandLine("echo 'hello world' 'tai chi'");
    expect(singleQuoted.args).toEqual(["hello world", "tai chi"]);
  });

  test("parses unknown flags and options without breaking", () => {
    const cmd = parseCommandLine("skills --all -v --format=json");
    expect(cmd.name).toBe("skills");
    expect(cmd.args).toEqual(["--all", "-v", "--format=json"]);
  });
});

describe("CommandParser - Security & Injection Auditing", () => {
  test("sanitizeInput rejects malicious script tags", () => {
    const res1 = sanitizeInput("<script>alert(1)</script>");
    expect(res1.isValid).toBe(false);
    expect(res1.rejectionReason).toContain("Malicious payload signature");

    const res2 = sanitizeInput(
      "<SCRIPT SRC='http://evil.com/xss.js'></SCRIPT>",
    );
    expect(res2.isValid).toBe(false);

    const res3 = sanitizeInput("help <script>document.cookie</script>");
    expect(res3.isValid).toBe(false);
  });

  test("sanitizeInput rejects javascript pseudo-protocol and html data URIs", () => {
    const jsRes = sanitizeInput("javascript:alert(document.domain)");
    expect(jsRes.isValid).toBe(false);

    const dataRes = sanitizeInput(
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    );
    expect(dataRes.isValid).toBe(false);
  });

  test("sanitizeInput rejects null byte injections", () => {
    const nullRes = sanitizeInput("echo hello\0world");
    expect(nullRes.isValid).toBe(false);
    expect(nullRes.rejectionReason).toMatch(/null byte/i);
  });

  test("sanitizeInput rejects inputs exceeding 1000 character buffer limit", () => {
    const largeInput = `echo ${"A".repeat(1050)}`;
    const res = sanitizeInput(largeInput);
    expect(res.isValid).toBe(false);
    expect(res.rejectionReason).toContain("buffer limit");
  });

  test("sanitizeInput strips non-printable control characters safely", () => {
    const tainted = "echo normal\x07text\x1btest";
    const res = sanitizeInput(tainted);
    expect(res.isValid).toBe(true);
    expect(res.sanitized).toBe("echo normaltexttest");
  });

  test("prototype pollution safety: Object prototype properties do not exist as commands", async () => {
    const parser = new CommandParser();
    const { context } = createMockContext();

    const prototypeKeys = [
      "__proto__",
      "constructor",
      "toString",
      "valueOf",
      "hasOwnProperty",
    ];
    for (const key of prototypeKeys) {
      expect(parser.hasCommand(key)).toBe(false);
      const res = await parser.execute(
        { raw: key, name: key, args: [] },
        context,
      );
      expect(res).toBeNull();
    }
  });

  test("destructive shell commands like 'rm -rf /' are not executed", async () => {
    const parser = new CommandParser();
    const { context } = createMockContext();

    const cmd = parseCommandLine("rm -rf /");
    expect(cmd.name).toBe("rm");
    expect(cmd.args).toEqual(["-rf", "/"]);

    // Must not be recognized as static command
    expect(parser.hasCommand("rm")).toBe(false);
    const result = await parser.execute(cmd, context);
    expect(result).toBeNull();
  });
});

describe("CommandParser - Dynamic Registration & Extension", () => {
  test("allows registering and unregistering custom commands", async () => {
    const parser = new CommandParser([]);
    const { context } = createMockContext();

    const customCommand: CommandHandler = {
      name: "custom",
      description: "Custom test command",
      aliases: ["c"],
      execute: (args) => ({ output: `executed custom with ${args.join(",")}` }),
    };

    parser.register(customCommand);
    expect(parser.hasCommand("custom")).toBe(true);
    expect(parser.hasCommand("c")).toBe(true);

    const res = await parser.execute(parseCommandLine("custom 1 2"), context);
    expect(res?.output).toBe("executed custom with 1,2");

    parser.unregister("custom");
    expect(parser.hasCommand("custom")).toBe(false);
    expect(parser.hasCommand("c")).toBe(false);
  });
});
