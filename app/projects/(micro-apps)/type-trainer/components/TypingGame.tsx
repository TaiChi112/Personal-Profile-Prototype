"use client";
import React, { useRef, useEffect } from 'react';
import { useTypeStore } from '../store/useTypeStore';

export default function TypingGame() {
  const { prompt, input, wpm, setInput, reset } = useTypeStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getCharClass = (char: string, index: number) => {
    if (index >= input.length) return 'text-gray-400';
    if (char === input[index]) return 'text-green-500 bg-green-500/10';
    return 'text-red-500 bg-red-500/20 underline';
  };

  const isFinished = input.length === prompt.length;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl w-full text-center" onClick={() => inputRef.current?.focus()}>
      <div className="text-5xl font-black mb-8 text-blue-500">{wpm} <span className="text-xl text-gray-400 uppercase tracking-widest">WPM</span></div>
      
      <div className="text-3xl font-mono leading-relaxed mb-8 tracking-wide">
        {prompt.split('').map((char, i) => (
          <span key={i} className={`transition-colors ${getCharClass(char, i)}`}>{char}</span>
        ))}
      </div>

      <input 
        ref={inputRef}
        type="text" 
        value={input} 
        onChange={e => !isFinished && setInput(e.target.value)} 
        className="opacity-0 absolute" 
        maxLength={prompt.length}
      />
      
      {isFinished && (
        <div className="animate-bounce mt-4">
          <p className="text-green-500 font-bold mb-4">You finished!</p>
          <button onClick={reset} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Play Again</button>
        </div>
      )}
    </div>
  );
}
