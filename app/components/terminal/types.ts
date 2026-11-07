/**
 * EPIC-022: Interactive Terminal - Type Definitions and State Machine Contracts
 *
 * Strict TypeScript architecture contracts for the interactive portfolio terminal.
 * Designed for high security, zero network latency local command dispatch,
 * and seamless fallback to remote AI persona streaming.
 */

/**
 * Type of terminal history line entry.
 */
export type TerminalHistoryType = "input" | "output" | "error" | "system";

/**
 * Visual themes available for the terminal overlay.
 */
export type TerminalTheme =
  | "cyberpunk"
  | "matrix"
  | "retro-amber"
  | "classic-dark";

/**
 * Single line or block item rendered in the terminal output history buffer.
 */
export interface TerminalHistoryItem {
  id: string;
  type: TerminalHistoryType;
  content: string;
  timestamp: number;
  command?: string;
  isStreaming?: boolean;
}

/**
 * Complete state tree for the interactive terminal component.
 */
export interface TerminalState {
  isOpen: boolean;
  history: TerminalHistoryItem[];
  currentInput: string;
  historyIndex: number;
  isStreaming: boolean;
  currentPath: string;
  theme?: TerminalTheme;
}

/**
 * Execution result returned from any command parser, handler, or router.
 */
export interface CommandResult {
  output: string;
  isError?: boolean;
  isStreaming?: boolean;
  clearScreen?: boolean;
  newPath?: string;
}

/**
 * Execution context supplied to command handlers during command invocation.
 */
export interface CommandContext {
  state: TerminalState;
  setHistory: (
    history:
      | TerminalHistoryItem[]
      | ((prev: TerminalHistoryItem[]) => TerminalHistoryItem[]),
  ) => void;
  clearHistory: () => void;
  executeCommand: (rawInput: string) => Promise<CommandResult | undefined>;
  setCurrentPath?: (path: string) => void;
  setTheme?: (theme: TerminalTheme) => void;
}

/**
 * Interface representing an executable terminal command handler.
 */
export interface CommandHandler {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  execute: (
    args: string[],
    context: CommandContext,
  ) => Promise<CommandResult> | CommandResult;
}

/**
 * Parsed representation of raw user command input.
 */
export interface TerminalCommand {
  raw: string;
  name: string;
  args: string[];
}

/**
 * Command Router contract for routing user inputs to local static handlers
 * or dispatching to the fallback AI endpoint.
 */
export interface CommandRouter {
  register: (handler: CommandHandler) => void;
  unregister: (name: string) => void;
  getRegisteredCommands: () => CommandHandler[];
  route: (rawInput: string, context: CommandContext) => Promise<CommandResult>;
}

/**
 * State machine actions for driving the terminal reducer.
 */
export type TerminalAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_HISTORY"; payload: TerminalHistoryItem }
  | {
      type: "SET_HISTORY";
      payload:
        | TerminalHistoryItem[]
        | ((prev: TerminalHistoryItem[]) => TerminalHistoryItem[]);
    }
  | { type: "CLEAR_HISTORY" }
  | { type: "NAVIGATE_HISTORY"; direction: "prev" | "next" }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "APPEND_STREAM_CHUNK"; payload: { id: string; chunk: string } }
  | { type: "SET_PATH"; payload: string }
  | { type: "SET_THEME"; payload: TerminalTheme };

/**
 * Payload sent to the backend AI agent endpoint (/api/terminal).
 */
export interface AITerminalRequest {
  prompt: string;
  currentPath: string;
  historySnapshot?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
}

/**
 * Guardrail check result for security boundary validation.
 */
export interface SecurityValidationResult {
  isValid: boolean;
  sanitized: string;
  rejectionReason?: string;
}
