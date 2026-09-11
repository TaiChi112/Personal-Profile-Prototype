"use client";
import React from 'react';
import { useTimetableStore } from '../store/useTimetableStore';

export default function Timetable() {
  const { slots, updateSlot } = useTimetableStore() as any;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '10:30', '13:00', '14:30', '16:00'];

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl overflow-x-auto">
      <div className="grid grid-cols-6 gap-2 min-w-[700px]">
        <div className="p-4"></div>
        {days.map(d => <div key={d} className="p-4 font-bold text-center bg-gray-100 dark:bg-gray-700 rounded-xl">{d}</div>)}
        
        {times.map((t, rowIdx) => (
          <React.Fragment key={t}>
            <div className="p-4 font-bold text-center bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">{t}</div>
            {days.map((_, colIdx) => {
              const idx = rowIdx * 5 + colIdx;
              return (
                <textarea
                  key={idx}
                  value={slots[idx] || ''}
                  onChange={e => updateSlot(idx, e.target.value)}
                  placeholder="Empty..."
                  className={`p-4 h-24 rounded-xl border text-sm resize-none focus:outline-blue-500 transition-colors ${slots[idx] ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-white dark:bg-gray-800'}`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
