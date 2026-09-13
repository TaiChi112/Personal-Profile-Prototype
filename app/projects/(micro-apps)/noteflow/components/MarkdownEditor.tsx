"use client";
import React from 'react';
import { useNoteStore } from '../store/useNoteStore';

export default function MarkdownEditor() {
  const { markdown, setMarkdown } = useNoteStore();
  
  return (
    <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
      <textarea 
        className="flex-1 p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl resize-none outline-none font-mono shadow-sm"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type markdown..."
      />
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl overflow-y-auto shadow-sm">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Preview (Raw HTML Simulation)</h2>
        <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: markdown.replace(/\n/g, '<br/>').replace(/^# (.*)/gm, '<h1>$1</h1>') }} />
      </div>
    </div>
  );
}
