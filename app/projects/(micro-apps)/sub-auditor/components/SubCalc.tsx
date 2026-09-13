"use client";
import React from 'react';
import { useSubStore } from '../store/useSubStore';

export default function SubCalc() {
  const { subs, toggle } = useSubStore() as any;
  const activeMonthly = subs.filter((s:any)=>s.active).reduce((sum:number, s:any)=>sum+s.price, 0);
  const activeYearly = activeMonthly * 12;

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-rose-500 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center">
        <h3 className="font-bold opacity-80 uppercase tracking-widest text-xs mb-2">Yearly Burn Rate</h3>
        <h1 className="text-5xl font-black mb-4">{activeYearly.toLocaleString()} ฿</h1>
        <p className="opacity-90 border-t border-rose-400 pt-4 mt-2">You spend <b>{activeMonthly.toLocaleString()} ฿</b> every single month.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-lg mb-4">Your Subscriptions</h3>
        <div className="space-y-3">
          {subs.map((s:any) => (
            <div key={s.id} onClick={()=>toggle(s.id)} className={`p-4 rounded-xl flex justify-between items-center cursor-pointer transition-all border ${s.active ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={s.active} readOnly className="w-5 h-5 accent-rose-500" />
                <span className={`font-bold ${s.active?'':'line-through'}`}>{s.name}</span>
              </div>
              <span className="font-mono">{s.price} ฿</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
