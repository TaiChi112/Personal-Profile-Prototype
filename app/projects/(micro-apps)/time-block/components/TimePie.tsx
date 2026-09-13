"use client";
import React from 'react';
import { useTimeStore } from '../store/useTimeStore';

export default function TimePie() {
  const { activities, updateHour } = useTimeStore() as any;
  const totalUsed = activities.reduce((s:number, a:any) => s + a.hours, 0);
  const free = 24 - totalUsed;

  // Build conic gradient string
  let currentPct = 0;
  const stops = activities.map((a:any) => {
    const start = currentPct;
    currentPct += (a.hours / 24) * 100;
    return `${a.color} ${start}%, ${a.color} ${currentPct}%`;
  });
  if (free > 0) stops.push(`#e5e7eb ${currentPct}%, #e5e7eb 100%`); // free time

  const gradient = `conic-gradient(${stops.join(', ')})`;

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="flex justify-center relative">
        <div className="w-64 h-64 rounded-full shadow-2xl relative" style={{background: gradient}}>
          <div className="absolute inset-0 m-auto w-40 h-40 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-black">{free > 0 ? free : 0}h</span>
            <span className="text-xs font-bold text-gray-500">FREE TIME</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl">
        <h3 className="font-black text-xl mb-6">Your 24 Hours</h3>
        <div className="space-y-4">
          {activities.map((a:any) => (
            <div key={a.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{backgroundColor: a.color}}></span>
                <span className="font-bold">{a.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="0" max="24" value={a.hours} onChange={e=>updateHour(a.id, Number(e.target.value))} className="w-16 text-center font-bold p-2 border rounded-lg bg-white dark:bg-gray-800" />
                <span className="text-sm font-bold text-gray-500">hrs</span>
              </div>
            </div>
          ))}
        </div>
        {free < 0 && <p className="text-red-500 font-bold text-center mt-6 text-sm">Warning: You exceeded 24 hours!</p>}
      </div>
    </div>
  );
}
