"use client";
import React from 'react';
import { useRegexStore } from '../store/useRegexStore';

export default function Highlighter() {
  const { pattern, text, setPattern, setText } = useRegexStore();
  let matchCount = 0;
  let isValid = true;
  
  try {
    const regex = new RegExp(pattern, 'g');
    matchCount = (text.match(regex) || []).length;
  } catch (e) {
    isValid = false;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm">
        <label className="block text-sm font-bold mb-2">Regex Pattern</label>
        <input 
          type="text" 
          value={pattern} 
          onChange={e => setPattern(e.target.value)}
          className={`w-full p-4 border rounded-xl font-mono ${isValid ? 'border-gray-200' : 'border-red-500 bg-red-50'}`}
        />
        <p className="text-sm mt-2 font-bold text-blue-500">{isValid ? `Found ${matchCount} matches` : 'Invalid Regex Pattern'}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm">
        <label className="block text-sm font-bold mb-2">Test String</label>
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-xl h-48 resize-none"
        />
      </div>
    </div>
  );
}
