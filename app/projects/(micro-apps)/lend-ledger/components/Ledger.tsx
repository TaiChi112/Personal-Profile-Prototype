"use client";
import React, { useState, useTransition } from 'react';
import { addRecord, toggleReturn, deleteRecord } from '../actions';

export default function Ledger({ records }: { records: any[] }) {
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => { 
    if(name && item) { 
      const date = new Date().toISOString().split('T')[0];
      startTransition(async () => {
        await addRecord(name, item, date);
      });
      setName(''); 
      setItem(''); 
    } 
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleReturn(id);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteRecord(id);
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black mb-6 text-emerald-600">LendLedger 🤝</h2>
      <div className="flex gap-4 mb-8 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
        <input type="text" placeholder="Who?" value={name} onChange={e=>setName(e.target.value)} className="flex-1 p-3 border rounded-lg" disabled={isPending} />
        <input type="text" placeholder="What (Money/Item)?" value={item} onChange={e=>setItem(e.target.value)} className="flex-1 p-3 border rounded-lg" disabled={isPending} />
        <button onClick={handleAdd} disabled={isPending} className="bg-emerald-600 text-white font-bold px-6 rounded-lg disabled:opacity-50">+</button>
      </div>

      <div className="space-y-4">
        {records.map((r:any) => (
          <div key={r.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${r.returned ? 'bg-gray-50 dark:bg-gray-900 opacity-50' : 'bg-white dark:bg-gray-700 shadow-sm border-emerald-200'}`}>
            <div className="flex items-center gap-4">
              <button onClick={()=>handleToggle(r.id)} disabled={isPending} className={`w-6 h-6 rounded-md border flex items-center justify-center disabled:opacity-50 ${r.returned ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>{r.returned ? '✓' : ''}</button>
              <div>
                <p className={`font-bold ${r.returned ? 'line-through' : ''}`}>{r.name} borrowed {r.item}</p>
                <p className="text-xs text-gray-500">Since {r.date}</p>
              </div>
            </div>
            <button onClick={()=>handleDelete(r.id)} disabled={isPending} className="text-gray-400 hover:text-red-500 p-2 disabled:opacity-50">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
