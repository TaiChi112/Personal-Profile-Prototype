"use client";
import React, { useEffect } from 'react';
import { useFocusIdleStore } from '../store/useFocusIdleStore';

export default function IdleGame() {
  const { timeLeft, isRunning, coins, buildings, tick, toggle, buyBuilding } = useFocusIdleStore() as any;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-8xl font-black tabular-nums text-amber-500 mb-8">{m}:{s}</h2>
        <button onClick={toggle} className={`px-12 py-4 rounded-full font-bold text-xl ${isRunning ? 'bg-gray-200 text-gray-800' : 'bg-amber-500 text-white shadow-lg hover:scale-105'} transition-all`}>
          {isRunning ? 'PAUSE' : 'FOCUS'}
        </button>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-3xl shadow-sm border border-amber-200 flex flex-col">
        <h3 className="text-2xl font-bold mb-6">Your Empire</h3>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl mb-4">
          <span className="font-medium">Coins (Get 100 per Focus)</span>
          <span className="text-xl font-bold text-amber-500">{coins} 🪙</span>
        </div>
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl mb-auto">
          <span className="font-medium">Townhalls</span>
          <span className="text-xl font-bold">🏛️ x {buildings}</span>
        </div>
        
        <button 
          onClick={buyBuilding} 
          disabled={coins < 50} 
          className="mt-6 w-full py-4 bg-amber-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-colors"
        >
          Buy Townhall (50 🪙)
        </button>
      </div>
    </div>
  );
}
