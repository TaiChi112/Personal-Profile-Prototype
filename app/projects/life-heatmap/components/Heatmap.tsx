"use client";
import React from 'react';
import { useHeatStore } from '../store/useHeatStore';

export default function Heatmap() {
  const { days, toggleDay } = useHeatStore() as any;
  
  const getColor = (lvl: number) => {
    if (lvl === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (lvl === 1) return 'bg-emerald-200 dark:bg-emerald-900';
    if (lvl === 2) return 'bg-emerald-400 dark:bg-emerald-700';
    return 'bg-emerald-600 dark:bg-emerald-500';
  };

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl overflow-x-auto border border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-black mb-6">Activity Heatmap 🟩</h2>
      <div className="flex flex-col gap-1 min-w-max">
        {Array.from({length: 7}).map((_, row) => (
          <div key={row} className="flex gap-1">
            {Array.from({length: 52}).map((_, col) => {
              const idx = col * 7 + row;
              const day = days[idx];
              if (!day) return <div key={col} className="w-4 h-4"></div>;
              return (
                <div 
                  key={col} 
                  title={day.date}
                  onClick={()=>toggleDay(idx)}
                  className={`w-4 h-4 rounded-sm cursor-pointer hover:ring-2 ring-gray-400 transition-colors ${getColor(day.level)}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end items-center gap-2 text-xs font-bold text-gray-500">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500"></div>
        <span>More</span>
      </div>
    </div>
  );
}
