"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";

interface CommandHistory {
  command: string;
  output: string | React.ReactNode;
}

export default function TerminalPage() {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let output: string | React.ReactNode = "";
    const lowerCmd = trimmed.toLowerCase();

    switch (lowerCmd) {
      case "help":
        output = (
          <div>
            Available commands:
            <br />
            &nbsp;&nbsp;help&nbsp;&nbsp;&nbsp;- Show this help message
            <br />
            &nbsp;&nbsp;about&nbsp;&nbsp;- Show information about this terminal
            <br />
            &nbsp;&nbsp;clear&nbsp;&nbsp;- Clear the terminal screen
            <br />
            &nbsp;&nbsp;date&nbsp;&nbsp;&nbsp;- Show current date and time
          </div>
        );
        break;
      case "about":
        output = "Easter Egg Terminal v1.0.0\nWelcome to the secret zone.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "date":
        output = new Date().toString();
        break;
      default:
        output = `Command not found: ${trimmed}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInput("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  // Keep focus on the input when clicking anywhere on the terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div 
      className="min-h-screen bg-black text-green-500 p-4 font-mono text-sm sm:text-base flex flex-col cursor-text"
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-auto">
        <div className="mb-4">
          <p>Welcome to the Easter Egg Terminal.</p>
          <p>Type 'help' to see available commands.</p>
        </div>

        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            <div className="flex">
              <span className="mr-2 text-green-400">guest@terminal:~$</span>
              <span>{entry.command}</span>
            </div>
            <div className="whitespace-pre-wrap mt-1 text-green-300">
              {entry.output}
            </div>
          </div>
        ))}

        <div className="flex items-center">
          <span className="mr-2 text-green-400">guest@terminal:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent outline-none border-none text-green-500 shadow-none focus:ring-0 focus:outline-none p-0 m-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
