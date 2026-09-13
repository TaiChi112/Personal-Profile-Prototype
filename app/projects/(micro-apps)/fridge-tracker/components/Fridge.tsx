"use client";
import React, { useState } from 'react';
import { useFridgeStore } from '../store/useFridgeStore';

export default function Fridge() {
  const { items, addItem, delItem } = useFridgeStore() as any;
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAdd = () => { if(name && expiry) { addItem(name, expiry); setName(''); setExpiry(''); } };

  const getStatus = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return { color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400', label: 'Expired!' };
    if (days <= 2) return { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: `Exp in ${days}d` };
    return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', label: `Safe (${days}d)` };
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <div className="flex gap-4 mb-8">
        <input type="text" placeholder="Item name (e.g. Milk)" value={name} onChange={e=>setName(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <input type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} className="p-3 border rounded-lg" />
        <button onClick={handleAdd} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg">+</button>
      </div>
      <div className="space-y-3">
        {items.sort((a:any, b:any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime()).map((item:any) => {
          const status = getStatus(item.expiry);
          return (
            <div key={item.id} className="flex justify-between items-center p-4 border rounded-xl dark:border-gray-700">
              <span className="font-bold text-lg">{item.name}</span>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>{status.label}</span>
                <span className="text-gray-500 text-sm">{item.expiry}</span>
                <button onClick={()=>delItem(item.id)} className="text-red-500 hover:scale-110">✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
