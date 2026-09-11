"use client";
import React, { useState, useEffect } from 'react';
import { useWheelStore } from '../store/useWheelStore';

export default function Spinner() {
  const { options, result, isSpinning, spin, stopSpin, addOption, delOption } = useWheelStore() as any;
  const [newOpt, setNewOpt] = useState('');
  const [displayResult, setDisplayResult] = useState('');

  useEffect(() => {
    if (isSpinning) {
      let ticks = 0;
      const interval = setInterval(() => {
        setDisplayResult(options[Math.floor(Math.random() * options.length)]);
        ticks++;
        if (ticks > 20) {
          clearInterval(interval);
          setDisplayResult(result);
          stopSpin();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpinning, result, options, stopSpin]);

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-center">
        <h2 className="text-gray-500 font-bold mb-4">The Verdict</h2>
        <div className="h-32 flex items-center justify-center border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl mb-6">
          <h1 className={`text-5xl font-black ${isSpinning ? 'text-gray-400 animate-pulse' : 'text-rose-500'}`}>
            {displayResult || '?'}
          </h1>
        </div>
        <button onClick={spin} disabled={isSpinning || options.length===0} className="w-full bg-rose-500 text-white font-black text-2xl py-4 rounded-xl hover:bg-rose-600 disabled:opacity-50">
          SPIN!
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm">
        <h3 className="font-bold mb-4">Options</h3>
        <div className="flex gap-2 mb-4">
          <input value={newOpt} onChange={e=>setNewOpt(e.target.value)} placeholder="Add option..." className="flex-1 p-2 border rounded-lg" />
          <button onClick={()=>{if(newOpt){addOption(newOpt); setNewOpt('');}}} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-lg font-bold">+</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((o:string) => (
            <span key={o} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm flex items-center gap-2">
              {o} <button onClick={()=>delOption(o)} className="text-gray-400 hover:text-red-500">✕</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
