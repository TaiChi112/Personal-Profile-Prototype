"use client";
import React, { useState, useTransition } from 'react';
import { addNoteAction, updateNoteAction, deleteNoteAction } from '../actions';

interface Note { id: string; title: string; content: string; updatedAt: Date; }

export default function MarkdownEditor({ initialNotes }: { initialNotes: Note[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNotes[0]?.id || null);
  
  const activeNote = initialNotes.find(n => n.id === activeNoteId);
  const [localContent, setLocalContent] = useState(activeNote?.content || "");
  const [localTitle, setLocalTitle] = useState(activeNote?.title || "");

  // Update local state when switching notes
  const switchNote = (note: Note) => {
    setActiveNoteId(note.id);
    setLocalContent(note.content);
    setLocalTitle(note.title);
  };

  const handleAdd = () => {
    startTransition(() => {
      addNoteAction("New Note", "# New Note\n\n...");
    });
  };

  const handleSave = () => {
    if (activeNoteId) {
      startTransition(() => {
        updateNoteAction(activeNoteId, localContent, localTitle);
      });
    }
  };

  const handleDelete = () => {
    if (activeNoteId) {
      startTransition(() => {
        deleteNoteAction(activeNoteId);
        setActiveNoteId(null);
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b dark:border-gray-700">
          <button onClick={handleAdd} disabled={isPending} className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-sm">
            + New Note
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {initialNotes.map(note => (
            <div 
              key={note.id} 
              onClick={() => switchNote(note)}
              className={`p-4 cursor-pointer border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600' : ''}`}
            >
              <h3 className="font-bold text-sm truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 flex flex-col gap-4">
        {activeNoteId ? (
          <>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={localTitle} 
                onChange={e => setLocalTitle(e.target.value)}
                className="flex-1 text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1 transition-colors"
                placeholder="Note Title"
              />
              <button onClick={handleSave} disabled={isPending} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-green-700">
                {isPending ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleDelete} disabled={isPending} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-red-200">
                Delete
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6 flex-1">
              <textarea 
                className="flex-1 p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl resize-none outline-none font-mono shadow-sm"
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="Type markdown..."
              />
              <div className="flex-1 p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl overflow-y-auto shadow-sm">
                <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: localContent.replace(/\n/g, '<br/>').replace(/^# (.*)/gm, '<h1>$1</h1>') }} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 font-medium">Select or create a note</p>
          </div>
        )}
      </div>
    </div>
  );
}
