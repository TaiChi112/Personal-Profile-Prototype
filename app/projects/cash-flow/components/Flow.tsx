"use client";
import React from 'react';
import { useFlowStore } from '../store/useFlowStore';

export default function Flow() {
  const { income, expenses, setIncome, updateExp } = useFlowStore() as any;
  const totalExp = expenses.reduce((s:number, e:any)=>s+e.value, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex gap-8 items-stretch">
        <div className="flex-1 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl flex flex-col justify-center border-l-8 border-gray-900 dark:border-gray-100">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Income</p>
          <input type="number" value={income} onChange={e=>setIncome(Number(e.target.value))} className="text-4xl font-black bg-transparent outline-none w-full border-b-2 border-dashed border-gray-300 pb-2" />
        </div>
        
        <div className="w-16 flex flex-col justify-center items-center opacity-50">
          <div className="h-1 bg-gray-400 w-full mb-1"></div>
          <div className="w-4 h-4 border-t-4 border-r-4 border-gray-400 transform rotate-45"></div>
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          {expenses.map((e:any) => {
            const pct = income ? (e.value / income) * 100 : 0;
            return (
              <div key={e.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm flex items-center relative overflow-hidden group">
                <div className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all ${e.color}`} style={{width: `${pct}%`}}></div>
                <div className={`w-3 h-10 rounded-full mr-4 ${e.color}`}></div>
                <div className="flex-1 z-10">
                  <p className="font-bold">{e.name}</p>
                  <p className="text-xs text-gray-500">{pct.toFixed(1)}% of Income</p>
                </div>
                <input type="number" value={e.value} onChange={ev=>updateExp(e.id, Number(ev.target.value))} className="z-10 w-28 text-right p-2 bg-gray-50 dark:bg-gray-900 border rounded-lg font-bold" />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className={`p-6 rounded-3xl text-center font-bold text-lg border-2 ${income >= totalExp ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
        Remaining Unallocated: {(income - totalExp).toLocaleString()} ฿
      </div>
    </div>
  );
}
