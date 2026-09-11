"use client";
import React from 'react';
import { usePackStore } from '../store/usePackStore';

export default function Packer() {
  const { tripType, setTripType, items, togglePack } = usePackStore() as any;
  const filtered = items.filter((i:any) => i.type === 'All' || i.type === tripType);
  const progress = Math.round((filtered.filter((i:any)=>i.packed).length / filtered.length) * 100) || 0;

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-3xl font-black mb-6 text-sky-500">PackMate 🧳</h2>
      
      <div className="flex gap-2 mb-8 bg-gray-100 dark:bg-gray-900 p-2 rounded-xl">
        {['Beach', 'Winter', 'Business'].map(t => (
          <button key={t} onClick={()=>setTripType(t)} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${tripType === t ? 'bg-white dark:bg-gray-700 shadow text-sky-600' : 'text-gray-500 hover:bg-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm font-bold text-gray-500 mb-2"><span>Packing Progress</span> <span>{progress}%</span></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item:any) => (
          <div key={item.id} onClick={()=>togglePack(item.id)} className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all border ${item.packed ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200' : 'bg-white dark:bg-gray-700'}`}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.packed ? 'bg-sky-500 border-sky-500 text-white' : 'border-gray-300 text-transparent'}`}>✓</div>
            <span className={`font-bold ${item.packed ? 'line-through text-gray-400' : ''}`}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
