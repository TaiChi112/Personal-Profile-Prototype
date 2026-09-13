"use client";
import React from 'react';
import { useWaterStore } from '../store/useWaterStore';

export default function Hydrate() {
  const { glasses, goal, add, reset } = useWaterStore() as any;
  const pct = Math.round((glasses / goal) * 100);

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-center relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-blue-100 dark:bg-blue-900/30 -z-10 transition-all duration-1000" style={{height: `${pct}%`}}></div>
      
      <h2 className="text-2xl font-bold mb-2 text-blue-600">Daily Hydration</h2>
      <p className="text-gray-500 font-medium mb-8">Stay fresh. Hit 8 glasses.</p>
      
      <div className="relative inline-flex items-center justify-center mb-12">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-gray-700" />
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * pct) / 100} className="text-blue-500 transition-all duration-1000" />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-black text-blue-600">{pct}%</span>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {Array.from({length: goal}).map((_, i) => (
          <div key={i} className={`w-8 h-10 rounded-b-xl border-2 transition-colors ${i < glasses ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}></div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <button onClick={reset} className="px-6 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200">Reset</button>
        <button onClick={add} disabled={glasses>=goal} className="px-12 py-4 rounded-2xl font-black text-xl text-white bg-blue-500 hover:bg-blue-600 shadow-lg disabled:opacity-50">+ Add</button>
      </div>
    </div>
  );
}
