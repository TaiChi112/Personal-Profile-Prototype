"use client";
import React, { useState } from 'react';
import { useLedgerStore } from '../store/useLedgerStore';

export default function Ledger() {
  const { records, addRecord, toggleReturn, delRecord } = useLedgerStore() as any;
  const [name, setName] = useState('');
  const [item, setItem] = useState('');

  const handleAdd = () => { if(name && item) { addRecord({name, item, date: new Date().toISOString().split('T')[0]}); setName(''); setItem(''); } };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black mb-6 text-emerald-600">LendLedger 🤝</h2>
      <div className="flex gap-4 mb-8 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
        <input type="text" placeholder="Who?" value={name} onChange={e=>setName(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <input type="text" placeholder="What (Money/Item)?" value={item} onChange={e=>setItem(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <button onClick={handleAdd} className="bg-emerald-600 text-white font-bold px-6 rounded-lg">+</button>
      </div>

      <div className="space-y-4">
        {records.map((r:any) => (
          <div key={r.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${r.returned ? 'bg-gray-50 dark:bg-gray-900 opacity-50' : 'bg-white dark:bg-gray-700 shadow-sm border-emerald-200'}`}>
            <div className="flex items-center gap-4">
              <button onClick={()=>toggleReturn(r.id)} className={`w-6 h-6 rounded-md border flex items-center justify-center ${r.returned ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>{r.returned ? '✓' : ''}</button>
              <div>
                <p className={`font-bold ${r.returned ? 'line-through' : ''}`}>{r.name} borrowed {r.item}</p>
                <p className="text-xs text-gray-500">Since {r.date}</p>
              </div>
            </div>
            <button onClick={()=>delRecord(r.id)} className="text-gray-400 hover:text-red-500 p-2">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
