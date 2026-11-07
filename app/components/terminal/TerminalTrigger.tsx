"use client";

import { useEffect, useState } from "react";
import { TerminalModal } from "./TerminalModal";
import type { TerminalTheme } from "./types";

export interface TerminalTriggerProps {
  initialTheme?: TerminalTheme;
  className?: string;
}

export function TerminalTrigger({
  initialTheme = "cyberpunk",
  className = "",
}: TerminalTriggerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Toggle on Ctrl+Shift+T or Cmd+Shift+T
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "t"
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Toggle on Tilde / Backquote key ` or ~
      if (e.key === "`" || e.key === "~") {
        const target = e.target as HTMLElement | null;
        const isEditing =
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);

        // If user is editing in a field outside our terminal, do not hijack unless terminal is already open
        if (!isOpen && isEditing) {
          return;
        }

        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close on Escape if open
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating HUD Button */}
      <aside
        className={`fixed bottom-6 left-6 z-40 flex items-center ${className}`}
        aria-label="Interactive Terminal Controls"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-xs font-semibold bg-black/80 hover:bg-black/95 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.45)] transition-all duration-300 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Open Interactive Terminal (~ or Ctrl+Shift+T)"
          title="Open Terminal (~ or Ctrl+Shift+T)"
        >
          {/* Pulsing Status Dot */}
          <span
            className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
            aria-hidden="true"
          />

          {/* Terminal Label */}
          <span className="tracking-wide text-cyan-300 group-hover:text-cyan-100 transition-colors">
            &gt;_ TERMINAL
          </span>

          {/* Shortcut Key Badge */}
          <span
            className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-[10px] text-cyan-300 border border-cyan-500/30 group-hover:border-cyan-400/60"
            aria-hidden="true"
          >
            ~
          </span>
        </button>
      </aside>

      {/* Terminal Modal Component */}
      <TerminalModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTheme={initialTheme}
      />
    </>
  );
}
