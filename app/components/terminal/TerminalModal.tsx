"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { HybridCommandRouter } from "./command-router";
import type {
  CommandContext,
  CommandResult,
  TerminalHistoryItem,
  TerminalTheme,
} from "./types";

interface ThemeStyle {
  id: TerminalTheme;
  label: string;
  windowBorder: string;
  windowBg: string;
  headerBg: string;
  headerText: string;
  bodyText: string;
  promptText: string;
  accentText: string;
  cursorColor: string;
  glowClass: string;
  scanlineOpacity: string;
}

const THEME_STYLES: Record<TerminalTheme, ThemeStyle> = {
  cyberpunk: {
    id: "cyberpunk",
    label: "CYBERPUNK",
    windowBorder: "border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.25)]",
    windowBg: "bg-[#090617]/95",
    headerBg: "bg-[#110d2c]/90 border-b border-cyan-500/30",
    headerText: "text-cyan-400",
    bodyText: "text-cyan-200",
    promptText: "text-pink-500",
    accentText: "text-cyan-400",
    cursorColor: "bg-cyan-400",
    glowClass: "drop-shadow-[0_0_4px_rgba(0,240,255,0.6)]",
    scanlineOpacity: "opacity-25",
  },
  matrix: {
    id: "matrix",
    label: "MATRIX",
    windowBorder: "border-green-500/50 shadow-[0_0_35px_rgba(34,197,94,0.25)]",
    windowBg: "bg-[#020b04]/95",
    headerBg: "bg-[#051809]/90 border-b border-green-500/30",
    headerText: "text-green-400",
    bodyText: "text-green-400",
    promptText: "text-green-500",
    accentText: "text-emerald-300",
    cursorColor: "bg-green-400",
    glowClass: "drop-shadow-[0_0_4px_rgba(34,197,94,0.6)]",
    scanlineOpacity: "opacity-30",
  },
  "retro-amber": {
    id: "retro-amber",
    label: "RETRO-AMBER",
    windowBorder: "border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.25)]",
    windowBg: "bg-[#130901]/95",
    headerBg: "bg-[#201004]/90 border-b border-amber-500/30",
    headerText: "text-amber-400",
    bodyText: "text-amber-300",
    promptText: "text-amber-500",
    accentText: "text-yellow-400",
    cursorColor: "bg-amber-400",
    glowClass: "drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]",
    scanlineOpacity: "opacity-25",
  },
  "classic-dark": {
    id: "classic-dark",
    label: "CLASSIC-DARK",
    windowBorder: "border-zinc-700 shadow-[0_0_35px_rgba(0,0,0,0.8)]",
    windowBg: "bg-[#0a0a0c]/98",
    headerBg: "bg-[#141418]/90 border-b border-zinc-800",
    headerText: "text-zinc-300",
    bodyText: "text-zinc-200",
    promptText: "text-blue-400",
    accentText: "text-zinc-400",
    cursorColor: "bg-zinc-200",
    glowClass: "",
    scanlineOpacity: "opacity-15",
  },
};

const INITIAL_BANNER: TerminalHistoryItem = {
  id: "banner-system-init",
  type: "system",
  content: [
    "======================================================================",
    "  ANOTHAI VICHAPAIBOON // SYSTEMS ARCHITECTURE PORTFOLIO TERMINAL v2.2",
    "  SECURITY CLEARANCE: GUEST (UID 1000) -- READ-ONLY INTERACTIVE SHELL",
    "======================================================================",
    "  * Type 'help' for available terminal subroutines.",
    "  * Type 'skills', 'projects', 'resume', or 'contact' for fast dossier.",
    "  * Freeform natural queries will route to the Cyberpunk SysAdmin AI.",
    "  * Theme switcher: 'theme matrix' | 'theme cyberpunk' | 'theme retro-amber'",
    "======================================================================",
  ].join("\n"),
  timestamp: Date.now(),
};

export interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTheme?: TerminalTheme;
}

export function TerminalModal({
  isOpen,
  onClose,
  initialTheme = "cyberpunk",
}: TerminalModalProps) {
  const [history, setHistory] = useState<TerminalHistoryItem[]>([
    INITIAL_BANNER,
  ]);
  const [input, setInput] = useState<string>("");
  const [theme, setTheme] = useState<TerminalTheme>(initialTheme);
  const [currentPath, setCurrentPath] = useState<string>("~");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [savedInput, setSavedInput] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useMemo(() => new HybridCommandRouter(), []);

  const currentThemeStyle = THEME_STYLES[theme] || THEME_STYLES.cyberpunk;

  // Auto scroll to bottom whenever history updates
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Cycle theme helper
  const handleCycleTheme = useCallback(() => {
    const themeKeys: TerminalTheme[] = [
      "cyberpunk",
      "matrix",
      "retro-amber",
      "classic-dark",
    ];
    const currentIndex = themeKeys.indexOf(theme);
    const nextTheme = themeKeys[(currentIndex + 1) % themeKeys.length];
    if (nextTheme) {
      setTheme(nextTheme);
    }
  }, [theme]);

  // Execute command handler
  const handleExecute = useCallback(
    async (rawInput: string): Promise<CommandResult | undefined> => {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        return undefined;
      }

      // Record input into history
      const inputEntry: TerminalHistoryItem = {
        id: `in-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "input",
        content: trimmed,
        timestamp: Date.now(),
        command: trimmed,
      };

      setHistory((prev) => [...prev, inputEntry]);
      setInput("");
      setHistoryIndex(-1);
      setSavedInput("");

      // Provide execution context
      const context: CommandContext = {
        state: {
          isOpen: true,
          history,
          currentInput: "",
          historyIndex: -1,
          isStreaming: false,
          currentPath,
          theme,
        },
        setHistory,
        clearHistory: () => setHistory([]),
        executeCommand: handleExecute,
        setCurrentPath: (path: string) => setCurrentPath(path),
        setTheme: (newTheme: TerminalTheme) => setTheme(newTheme),
      };

      const result = await router.route(trimmed, context);

      if (result.clearScreen) {
        setHistory([]);
        return result;
      }

      // If output is present and was not already handled by real-time streaming
      if (result.output && !result.isStreaming) {
        const isAlreadyAppended = history.some(
          (h) => h.content === result.output,
        );

        if (!isAlreadyAppended) {
          setHistory((prev) => [
            ...prev,
            {
              id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              type: result.isError ? "error" : "output",
              content: result.output,
              timestamp: Date.now(),
            },
          ]);
        }
      }

      // Special handling for exit
      const lower = trimmed.toLowerCase();
      if (lower === "exit" || lower === "quit") {
        setTimeout(() => onClose(), 400);
      }

      return result;
    },
    [currentPath, history, onClose, router, theme],
  );

  // Command history navigation
  const inputHistory = useMemo(
    () =>
      history
        .filter((item) => item.type === "input")
        .map((item) => item.content),
    [history],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleExecute(input);
      return;
    }

    // History UP
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (inputHistory.length === 0) return;

      if (historyIndex === -1) {
        setSavedInput(input);
        const nextIndex = inputHistory.length - 1;
        setHistoryIndex(nextIndex);
        setInput(inputHistory[nextIndex] ?? "");
      } else if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(inputHistory[nextIndex] ?? "");
      }
      return;
    }

    // History DOWN
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < inputHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(inputHistory[nextIndex] ?? "");
      } else {
        setHistoryIndex(-1);
        setInput(savedInput);
      }
      return;
    }

    // Tab Autocompletion
    if (e.key === "Tab") {
      e.preventDefault();
      const current = input.trim().toLowerCase();
      if (!current) return;

      const registered = router.getRegisteredCommands();
      const candidates: string[] = [];
      for (const cmd of registered) {
        if (cmd.name.startsWith(current)) candidates.push(cmd.name);
        if (cmd.aliases) {
          for (const alias of cmd.aliases) {
            if (alias.startsWith(current)) candidates.push(alias);
          }
        }
      }

      if (candidates.length > 0 && candidates[0]) {
        setInput(candidates[0]);
      }
      return;
    }

    // Ctrl+L to clear screen
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setHistory([]);
      return;
    }

    // Escape to close
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Interactive Terminal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close terminal overlay"
        tabIndex={-1}
        className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-default pointer-events-auto border-none"
        onClick={onClose}
      />

      {/* Terminal Window Frame */}
      <section
        aria-label="Terminal window"
        className={`relative z-10 pointer-events-auto flex flex-col font-mono text-xs sm:text-sm overflow-hidden border rounded-lg transition-all duration-300 ${
          currentThemeStyle.windowBorder
        } ${currentThemeStyle.windowBg} ${
          isMaximized
            ? "w-full h-full max-w-none max-h-none rounded-none"
            : "w-full max-w-4xl h-[85vh] max-h-[750px]"
        }`}
        onClick={() => {
          inputRef.current?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        {/* CRT Scanline Visual Filter Overlay */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 ${currentThemeStyle.scanlineOpacity}`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
            backgroundSize: "100% 4px, 6px 100%",
          }}
          aria-hidden="true"
        />

        {/* CRT Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(circle at center, transparent 65%, rgba(0, 0, 0, 0.5) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Window Chrome / Title Bar */}
        <div
          className={`relative z-30 flex items-center justify-between px-3 py-2 select-none ${currentThemeStyle.headerBg}`}
        >
          {/* Window Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"
              aria-label="Close terminal"
              title="Close terminal (Esc)"
            />
            <button
              type="button"
              onClick={handleCycleTheme}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"
              aria-label="Cycle theme"
              title="Cycle theme"
            />
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            />
          </div>

          {/* Window Title & Host Status */}
          <div
            className={`text-xs font-semibold tracking-wider flex items-center gap-2 ${currentThemeStyle.headerText}`}
          >
            <span>{"SYS_OPERATOR // TERMINAL_V2.2"}</span>
            <span className="hidden sm:inline opacity-60">
              [guest@anothai-portfolio:{currentPath}]
            </span>
          </div>

          {/* Theme Badge & Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCycleTheme}
              className={`text-[10px] uppercase px-2 py-0.5 rounded border border-current/30 hover:bg-white/10 transition-colors cursor-pointer ${currentThemeStyle.headerText}`}
              title="Click to cycle theme"
            >
              [{currentThemeStyle.label}]
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`text-xs px-1.5 py-0.5 rounded hover:bg-red-500/20 text-red-400 cursor-pointer`}
              aria-label="Close"
            >
              [X]
            </button>
          </div>
        </div>

        {/* Terminal Body / Output History Buffer */}
        <div
          ref={scrollContainerRef}
          className={`relative z-10 flex-1 p-3 sm:p-4 overflow-y-auto ${currentThemeStyle.bodyText}`}
        >
          {history.map((item) => (
            <div key={item.id} className="mb-2 leading-relaxed">
              {item.type === "input" ? (
                <div className="flex items-start gap-2">
                  <span
                    className={`font-semibold shrink-0 ${currentThemeStyle.promptText}`}
                  >
                    guest@portfolio:{currentPath}$
                  </span>
                  <span className="font-bold text-white/95 break-all">
                    {item.content}
                  </span>
                </div>
              ) : item.type === "error" ? (
                <pre className="text-red-400 whitespace-pre-wrap font-mono">
                  {item.content}
                </pre>
              ) : item.type === "system" ? (
                <pre
                  className={`opacity-85 whitespace-pre-wrap font-mono ${currentThemeStyle.accentText}`}
                >
                  {item.content}
                </pre>
              ) : (
                <pre
                  className={`whitespace-pre-wrap font-mono ${currentThemeStyle.glowClass}`}
                >
                  {item.content}
                  {item.isStreaming && (
                    <span
                      className={`inline-block w-2 h-4 ml-0.5 align-middle animate-pulse ${currentThemeStyle.cursorColor}`}
                    />
                  )}
                </pre>
              )}
            </div>
          ))}

          {/* Interactive Input Prompt Line */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`font-semibold shrink-0 select-none ${currentThemeStyle.promptText}`}
            >
              guest@portfolio:{currentPath}$
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none ring-0 shadow-none text-white font-mono p-0 m-0 focus:ring-0 focus:outline-none"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal prompt input"
              />
            </div>
          </div>
        </div>

        {/* Terminal Status Footer */}
        <div
          className={`relative z-30 px-3 py-1 text-[10px] flex items-center justify-between border-t border-white/10 opacity-75 select-none ${currentThemeStyle.headerBg} ${currentThemeStyle.headerText}`}
        >
          <div className="flex items-center gap-3">
            <span>[STATUS: ONLINE]</span>
            <span className="hidden sm:inline">
              [SHELL: BASH-COMPATIBLE GUEST]
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>UP/DOWN: HISTORY</span>
            <span>TAB: AUTOCOMPLETE</span>
            <span>ESC: CLOSE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
