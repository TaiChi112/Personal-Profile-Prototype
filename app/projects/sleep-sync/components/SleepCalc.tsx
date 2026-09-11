"use client";
import React from 'react';
import { useSleepStore } from '../store/useSleepStore';

export default function SleepCalc() {
  const { wakeTime, setWakeTime } = useSleepStore() as any;

  const calculateTimes = (timeStr: string) => {
    if (!timeStr) return [];
    const [h, m] = timeStr.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);
    
    // 90 min cycles = 5400000 ms. We calculate 6, 5, 4, 3 cycles. +15 mins to fall asleep (900000 ms)
    const cycles = [6, 5, 4, 3];
    return cycles.map(c => {
      const sleepDate = new Date(wakeDate.getTime() - (c * 5400000) - 900000);
      return { 
        cycles: c, 
        time: sleepDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        hours: (c * 90) / 60
      };
    });
  };

  const times = calculateTimes(wakeTime);

  return (
    <div className="max-w-xl mx-auto bg-slate-900 text-white p-8 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-black mb-6 text-center text-indigo-400">SleepSync 🌙</h2>
      <div className="flex flex-col items-center mb-8 bg-slate-800 p-6 rounded-2xl">
        <label className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-4">I need to wake up at</label>
        <input 
          type="time" 
          value={wakeTime} 
          onChange={e=>setWakeTime(e.target.value)} 
          className="text-5xl font-black bg-transparent border-b-2 border-indigo-500 outline-none text-center pb-2 w-48"
        />
      </div>
      
      <p className="text-center text-slate-400 mb-6 font-medium">To wake up refreshed, head to bed at one of these times<br/>(Includes 15 mins to fall asleep):</p>
      
      <div className="space-y-4">
        {times.map((t, i) => (
          <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${i === 0 ? 'bg-indigo-600 border-2 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-slate-800'}`}>
            <div>
              <span className="font-bold block">{t.cycles} Cycles</span>
              <span className="text-sm opacity-80">{t.hours} hours sleep</span>
            </div>
            <span className="text-3xl font-black">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
