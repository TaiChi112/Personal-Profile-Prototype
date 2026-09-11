"use client";
import React from 'react';
import { useWealthStore } from '../store/useWealthStore';

export default function WealthDashboard() {
  const { assets, liabilities, updateItem } = useWealthStore() as any;
  
  const totalAssets = assets.reduce((sum:number, a:any) => sum + a.value, 0);
  const totalLiab = liabilities.reduce((sum:number, l:any) => sum + l.value, 0);
  const netWorth = totalAssets - totalLiab;

  let cumulativePercent = 0;
  const svgLines = assets.map((a:any) => {
    const pct = totalAssets ? a.value / totalAssets : 0;
    const strokeDasharray = `${pct * 100} 100`;
    const strokeDashoffset = -cumulativePercent * 100;
    cumulativePercent += pct;
    return <circle key={a.id} cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke={a.color} strokeWidth="6" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />;
  });

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-8">Asset Allocation</h2>
        <div className="relative w-64 h-64 mb-8">
          <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
            <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e5e7eb" strokeWidth="6" />
            {svgLines}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Net Worth</p>
            <h1 className="text-2xl font-black">{netWorth.toLocaleString()} ฿</h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {assets.map((a:any) => (
            <div key={a.id} className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{backgroundColor: a.color}}></span><span className="text-sm font-bold">{a.name}</span></div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="font-bold text-emerald-600 mb-4">Assets</h3>
          {assets.map((a:any) => (
            <div key={a.id} className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">{a.name}</span>
              <input type="number" value={a.value} onChange={e=>updateItem('assets', a.id, Number(e.target.value))} className="w-28 text-right p-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
          <h3 className="font-bold text-rose-500 mb-4">Liabilities (Debt)</h3>
          {liabilities.map((l:any) => (
            <div key={l.id} className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">{l.name}</span>
              <input type="number" value={l.value} onChange={e=>updateItem('liabilities', l.id, Number(e.target.value))} className="w-28 text-right p-2 border rounded-lg bg-gray-50 dark:bg-gray-900" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
