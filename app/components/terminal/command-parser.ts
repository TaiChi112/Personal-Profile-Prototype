import type {
  CommandContext,
  CommandHandler,
  CommandResult,
  SecurityValidationResult,
  TerminalCommand,
  TerminalTheme,
} from "./types";

/**
 * Sanitize and validate raw input against security injection attacks.
 */
export function sanitizeInput(input: string): SecurityValidationResult {
  if (typeof input !== "string") {
    return {
      isValid: false,
      sanitized: "",
      rejectionReason: "Input must be a valid text string",
    };
  }

  const trimmed = input.trim();

  // Reject excessively large inputs to prevent buffer/DoS issues
  if (trimmed.length > 1000) {
    return {
      isValid: false,
      sanitized: "",
      rejectionReason: "Command length exceeds 1000 character buffer limit",
    };
  }

  // Check for malicious script tags or unsafe payloads
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
  ];

  // Reject null bytes
  if (trimmed.includes("\0")) {
    return {
      isValid: false,
      sanitized: "",
      rejectionReason: "Malicious payload signature detected: Null byte",
    };
  }

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        sanitized: "",
        rejectionReason: "Malicious payload signature detected",
      };
    }
  }

  // Remove control characters (preserve standard printable characters, tabs, newlines)
  const sanitized = trimmed
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 9 || code === 10;
    })
    .join("");

  return {
    isValid: true,
    sanitized,
  };
}

/**
 * Tokenize a raw command string into command name and arguments.
 * Supports double and single quoted strings with spaces.
 */
export function parseCommandLine(rawInput: string): TerminalCommand {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { raw: rawInput, name: "", args: [] };
  }

  const args: string[] = [];
  let currentToken = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
      if (inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else {
        inQuotes = true;
        quoteChar = char;
      }
    } else if (char === " " && !inQuotes) {
      if (currentToken.length > 0) {
        args.push(currentToken);
        currentToken = "";
      }
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0) {
    args.push(currentToken);
  }

  const name = args.length > 0 ? (args[0]?.toLowerCase() ?? "") : "";
  const commandArgs = args.slice(1);

  return {
    raw: rawInput,
    name,
    args: commandArgs,
  };
}

const VALID_THEMES: TerminalTheme[] = [
  "cyberpunk",
  "matrix",
  "retro-amber",
  "classic-dark",
];

/**
 * Static Command Handlers collection.
 */
export const staticCommandHandlers: CommandHandler[] = [
  {
    name: "help",
    description:
      "Display list of available commands and navigation instructions",
    usage: "help",
    aliases: ["?", "man"],
    execute: () => {
      const output = [
        "==================== TERMINAL SUBSYSTEM HELP ====================",
        "COMMAND        USAGE           DESCRIPTION",
        "----------------------------------------------------------------",
        "help           help            Display this command directory",
        "whoami         whoami          Display operator identity and system bio",
        "skills         skills          Inspect technical skills and competencies",
        "projects       projects        List highlighted engineering projects",
        "resume         resume          View curriculum vitae and career timeline",
        "contact        contact         Retrieve communication channels",
        "theme          theme [name]    Switch theme (cyberpunk|matrix|retro-amber|classic-dark)",
        "echo           echo [text]     Echo text back to stdout",
        "date           date            Print current system time and UTC clock",
        "history        history         List executed command buffer",
        "clear          clear           Clear output display buffer",
        "----------------------------------------------------------------",
        "[SYS-NOTE] Any unknown commands or freeform queries will be",
        "routed to the Cyberpunk SysAdmin AI assistant automatically.",
        "================================================================",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "whoami",
    description: "Display operator bio, system privileges, and credentials",
    usage: "whoami",
    aliases: ["id", "bio", "about"],
    execute: () => {
      const output = [
        "[SYSTEM NODE: PORTFOLIO-V2 // SECURITY LEVEL: GUEST]",
        "IDENTIFIER:   Anothai Vichapaiboon (TaiChi)",
        "ROLE:         Software Engineer & Systems Architect",
        "LOCATION:     Bangkok, Thailand",
        "CLEARANCE:    UID 1000 (Guest Interactive Shell)",
        "PRIMARY ARCH: TypeScript, Next.js 16, React 19, Python, Distributed Systems",
        "STATUS:       Active / Ready for high-impact engineering missions",
        "DIRECTIVE:    Architecting resilient software, AI tooling, and clean design patterns.",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "skills",
    description:
      "List technical proficiencies, frameworks, and architecture patterns",
    usage: "skills",
    aliases: ["stack", "tech"],
    execute: () => {
      const output = [
        "==================== CORE TECHNICAL ARSENAL ====================",
        "[LANGUAGES]    TypeScript, JavaScript (ESNext), Python 3, SQL, HTML5, CSS3",
        "[FRONTEND]     React 19, Next.js 16 App Router, Tailwind CSS v4, Zustand, Framer Motion",
        "[BACKEND]      Node.js, Express.js, Elysia.js, Bun runtime, REST, GraphQL",
        "[DATA & DB]    PostgreSQL, Prisma ORM, Redis, BullMQ queue processing",
        "[AI & MCP]     Google Gemini API, OpenAI SDK, Vercel AI SDK, Model Context Protocol (MCP)",
        "[DEVOPS & SYS] Docker, Docker Compose, Linux/UNIX bash, Git, CI/CD GitHub Actions",
        "[ARCHITECTURE] GoF Design Patterns, Clean Architecture, HITL Pipelines, Event-Sourcing",
        "================================================================",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "projects",
    description:
      "List featured software projects with repositories and descriptions",
    usage: "projects",
    aliases: ["ls", "portfolio"],
    execute: () => {
      const output = [
        "====================== FEATURED PROJECTS ======================",
        "1. Universal Academic Portfolio System (UAPs)",
        "   - Stack: TypeScript, Next.js, PostgreSQL, Prisma ORM",
        "   - URL:   https://github.com/TaiChi112/UAPs",
        "   - Note:  Dynamic resume engine with relational skill matching and JD alignment.",
        "",
        "2. AI-Powered Manga OCR and Translation Pipeline (HITL)",
        "   - Stack: Python, OpenCV, Digital Image Processing, HITL Workflow",
        "   - URL:   https://github.com/TaiChi112/AI-Powered-Manga-OCR-and-Translation-Pipeline",
        "   - Note:  End-to-end comic text extraction with human-in-the-loop review.",
        "",
        "3. Google Calendar AI Agent (MCP)",
        "   - Stack: Python, Model Context Protocol, Google APIs",
        "   - URL:   https://github.com/TaiChi112/Google-Calendar-AI-Agent",
        "   - Note:  Autonomous scheduling assistant with natural language overlap detection.",
        "",
        "4. Personal Website (Design Pattern Playground)",
        "   - Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4",
        "   - URL:   https://github.com/TaiChi112/Personal-Website",
        "   - Note:  Living laboratory applying GoF patterns (Factory, Builder, Visitor).",
        "",
        "5. CS-ICEbreaker-HUB (Phygital Platform)",
        "   - Stack: Next.js, Real-time WebSockets, AI Question Generator",
        "   - URL:   https://github.com/TaiChi112/CS-ICEbreaker-HUB",
        "   - Note:  Hybrid physical-digital icebreaker application for conferences.",
        "",
        "6. Project Scaffolding CLI Tool (MVP)",
        "   - Stack: Node.js, TypeScript, CLI Tooling",
        "   - URL:   https://github.com/TaiChi112/Project-Scaffolding-CLI-Tool",
        "   - Note:  Automated project bootstrapper with future LLM-scaffolding support.",
        "==============================================================",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "resume",
    description: "View professional experience, education, and career overview",
    usage: "resume",
    aliases: ["cv"],
    execute: () => {
      const output = [
        "====================== CURRICULUM VITAE ======================",
        "CANDIDATE: Anothai Vichapaiboon",
        "POSITION:  Software Engineer",
        "EDUCATION: B.Sc. in Computer Science - Ramkhamhaeng University (2022 - 2026)",
        "",
        "EXPERIENCE HISTORY:",
        "--------------------------------------------------------------",
        "1. Software Engineer (Volunteer) | Tech Co (2021 - Present)",
        "   * Led architectural migration toward modular services.",
        "   * Engineered frontend rendering optimizations cutting latency by 40%.",
        "   * Mentored team members on TypeScript best practices and design patterns.",
        "",
        "2. Web Developer | Agency XY (2019 - 2021)",
        "   * Developed high-performance interactive client applications.",
        "   * Built responsive UI components conforming to strict accessibility standards.",
        "   * Integrated external APIs and state management pipelines.",
        "",
        "CORE HIGHLIGHTS:",
        "   * Dedicated to engineering scalable, resilient web systems.",
        "   * Strong expertise in TypeScript, React, Next.js, and Python backend pipelines.",
        "==============================================================",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "contact",
    description: "Display communication channels and network endpoints",
    usage: "contact",
    aliases: ["email", "reach"],
    execute: () => {
      const output = [
        "=================== COMMUNICATIONS DIRECTORY ===================",
        "EMAIL:     anothai.0978452316@gmail.com",
        "GITHUB:    https://github.com/TaiChi112",
        "LOCATION:  Bangkok, Thailand",
        "TIMEZONE:  UTC+7 (Indochina Time)",
        "AVAILABILITY: Open for high-impact software engineering roles",
        "================================================================",
      ].join("\n");

      return { output };
    },
  },

  {
    name: "clear",
    description: "Clear terminal viewport history",
    usage: "clear",
    aliases: ["cls"],
    execute: () => {
      return {
        output: "",
        clearScreen: true,
      };
    },
  },

  {
    name: "date",
    description: "Print current local and UTC system timestamp",
    usage: "date",
    aliases: ["time"],
    execute: () => {
      const now = new Date();
      const output = [
        `[SYS-TIME] UTC:   ${now.toUTCString()}`,
        `[SYS-TIME] LOCAL: ${now.toString()}`,
        `[SYS-TIME] UNIX:  ${Math.floor(now.getTime() / 1000)}`,
      ].join("\n");

      return { output };
    },
  },

  {
    name: "echo",
    description: "Echo arguments to terminal output",
    usage: "echo <text>",
    execute: (args) => {
      const text = args.join(" ");
      return { output: text };
    },
  },

  {
    name: "theme",
    description:
      "Switch visual theme: cyberpunk, matrix, retro-amber, classic-dark",
    usage: "theme [cyberpunk|matrix|retro-amber|classic-dark]",
    execute: (args, context) => {
      const target = args[0]?.toLowerCase();

      if (!target) {
        const current = context.state.theme ?? "cyberpunk";
        return {
          output: `Current theme: '${current}'. Available themes: ${VALID_THEMES.join(", ")}. Usage: theme <name>`,
        };
      }

      const matchedTheme = VALID_THEMES.find((t) => t === target);

      if (!matchedTheme) {
        return {
          output: `Invalid theme '${target}'. Available themes: ${VALID_THEMES.join(", ")}`,
          isError: true,
        };
      }

      if (context.setTheme) {
        context.setTheme(matchedTheme);
      }

      return {
        output: `[THEME] Switched display matrix to '${matchedTheme}' successfully.`,
      };
    },
  },

  {
    name: "history",
    description: "List previously executed terminal commands",
    usage: "history",
    execute: (_args, context) => {
      const inputItems = context.state.history.filter(
        (item) => item.type === "input",
      );

      if (inputItems.length === 0) {
        return { output: "No commands recorded in history." };
      }

      const lines = inputItems.map(
        (item, idx) => `  ${String(idx + 1).padStart(3, " ")}  ${item.content}`,
      );

      return {
        output: ["--- COMMAND HISTORY ---", ...lines].join("\n"),
      };
    },
  },

  {
    name: "pwd",
    description: "Print current working path",
    usage: "pwd",
    execute: (_args, context) => {
      return { output: context.state.currentPath || "~" };
    },
  },

  {
    name: "exit",
    description: "Close terminal session",
    usage: "exit",
    aliases: ["quit"],
    execute: () => {
      return {
        output: "[TERMINAL SESSION TERMINATED] Shell closed.",
      };
    },
  },
];

/**
 * CommandParser class managing registration and instant local execution of static commands.
 */
export class CommandParser {
  private handlers: Map<string, CommandHandler> = new Map();

  constructor(initialHandlers: CommandHandler[] = staticCommandHandlers) {
    for (const handler of initialHandlers) {
      this.register(handler);
    }
  }

  public register(handler: CommandHandler): void {
    this.handlers.set(handler.name.toLowerCase(), handler);
    if (handler.aliases) {
      for (const alias of handler.aliases) {
        this.handlers.set(alias.toLowerCase(), handler);
      }
    }
  }

  public unregister(name: string): void {
    const key = name.toLowerCase();
    const handler = this.handlers.get(key);
    if (handler) {
      this.handlers.delete(key);
      if (handler.aliases) {
        for (const alias of handler.aliases) {
          this.handlers.delete(alias.toLowerCase());
        }
      }
    }
  }

  public getRegisteredCommands(): CommandHandler[] {
    const unique = new Set<CommandHandler>(this.handlers.values());
    return Array.from(unique);
  }

  public getHandler(name: string): CommandHandler | undefined {
    return this.handlers.get(name.toLowerCase());
  }

  public hasCommand(name: string): boolean {
    return this.handlers.has(name.toLowerCase());
  }

  public async execute(
    command: TerminalCommand,
    context: CommandContext,
  ): Promise<CommandResult | null> {
    const handler = this.getHandler(command.name);
    if (!handler) {
      return null;
    }
    return await handler.execute(command.args, context);
  }
}
