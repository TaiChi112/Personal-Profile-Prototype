"use client";
import React from 'react';
import { useMedStore } from '../store/useMedStore';

export default function MedList() {
  const { meds, toggle, reset } = useMedStore() as any;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Today's Pills</h2>
        <button onClick={reset} className="text-sm text-blue-500 hover:underline">Reset Daily</button>
      </div>
      <div className="space-y-4">
        {meds.map((m:any) => (
          <div key={m.id} onClick={()=>toggle(m.id)} className={`p-5 rounded-2xl flex justify-between items-center cursor-pointer transition-all border-2 ${m.taken ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-700 hover:border-blue-300'}`}>
            <div>
              <p className={`font-bold text-lg ${m.taken ? 'line-through text-gray-500' : ''}`}>{m.name}</p>
              <p className="text-sm text-gray-500">⏰ {m.time}</p>
            </div>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${m.taken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-transparent'}`}>
              ✓
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
