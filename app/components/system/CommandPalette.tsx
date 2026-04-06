'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

type CommandPaletteCommand = {
  id: string;
  label: string;
  icon: React.ReactNode;
  execute: () => void;
  matches: (query: string) => boolean;
};

type CommandPaletteStyle = {
  name: string;
  getModalClass: () => string;
};

type CommandPaletteProps = {
  commands: CommandPaletteCommand[];
  isOpen: boolean;
  onClose: () => void;
  style: CommandPaletteStyle;
};

export function CommandPalette({ commands, isOpen, onClose, style }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredCommands = commands.filter((command) => command.matches(query));

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous + 1) % filteredCommands.length);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].execute();
          onClose();
        }
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[20vh] px-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className={`w-full max-w-lg flex flex-col ${style.getModalClass()} animate-in zoom-in-95 duration-200`}>
        <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 py-4 bg-transparent outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400"
            placeholder="Type a command..."
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            <span className="text-xs font-bold text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">ESC</span>
          </button>
        </div>

        <div className="max-h-75 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No commands found.</div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => {
                  command.execute();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${index === selectedIndex ? (style.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300') : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                {command.icon}
                <span className="flex-1 font-medium">{command.label}</span>
                {index === selectedIndex ? <ArrowRight size={16} className="opacity-50" /> : null}
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
          <span>Select <b className="font-bold">↑↓</b></span>
          <span>Execute <b className="font-bold">Enter</b></span>
        </div>
      </div>
    </div>
  );
}
