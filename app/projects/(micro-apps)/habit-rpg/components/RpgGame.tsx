"use client";
import React, { useState, useTransition } from 'react';
import { addHabitAction, completeHabitAction } from '../actions';

interface Habit {
  id: string;
  title: string;
  done: boolean;
}

export default function RpgGame({ level, exp, habits }: { level: number, exp: number, habits: Habit[] }) {
  const [isPending, startTransition] = useTransition();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    startTransition(() => {
      addHabitAction(newTitle);
      setNewTitle('');
    });
  }

  const handleComplete = (id: string) => {
    startTransition(() => {
      completeHabitAction(id);
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
      <div className="text-center mb-8 border-b pb-6 dark:border-gray-700">
        <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">🧙‍♂️</div>
        <h2 className="text-2xl font-bold">Level {level} Hero</h2>
        <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden relative">
          <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${exp}%` }}></div>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">{exp} / 100 EXP</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            placeholder="Add new quest..." 
            className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} disabled={isPending} className="bg-gray-900 dark:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-xl font-bold">Add</button>
        </div>

        <h3 className="font-bold text-gray-500 uppercase text-sm tracking-wider">Daily Quests</h3>
        {habits.map(h => (
          <div key={h.id} className={`p-4 rounded-xl border flex justify-between items-center ${h.done ? 'bg-gray-50 opacity-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-700'}`}>
            <span className={`font-medium ${h.done ? 'line-through text-gray-400' : ''}`}>{h.title}</span>
            {!h.done && (
              <button 
                disabled={isPending}
                onClick={() => handleComplete(h.id)} 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:scale-105 transition-transform disabled:opacity-50">
                + EXP
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
