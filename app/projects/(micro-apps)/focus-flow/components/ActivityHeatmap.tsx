"use client";

import React, { useMemo } from 'react';
import { useFocusStore } from '../store/useFocusStore';

export default function ActivityHeatmap() {
  const { history } = useFocusStore();

  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    history.forEach((session) => {
      map[session.date] = (map[session.date] || 0) + session.durationMinutes;
    });
    return map;
  }, [history]);

  // Generate last 84 days (12 weeks)
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      arr.push({
        dateStr,
        minutes: activityMap[dateStr] || 0
      });
    }
    return arr;
  }, [activityMap]);

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-gray-100 dark:bg-gray-700/50';
    if (minutes < 25) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (minutes < 60) return 'bg-emerald-400 dark:bg-emerald-700/70';
    if (minutes < 120) return 'bg-emerald-500 dark:bg-emerald-500';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  // Group by weeks for grid rendering (7 rows)
  // Weeks are columns, Days are rows
  const weeks = [];
  for (let i = 0; i < 12; i++) {
    weeks.push(days.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="w-full">
      <div className="flex gap-1 overflow-x-auto pb-4">
        {weeks.map((week, wIdx) => (
          <div key={`week-${wIdx}`} className="flex flex-col gap-1">
            {week.map((day) => (
              <div 
                key={day.dateStr} 
                title={`${day.dateStr}: ${day.minutes} mins focused`}
                className={`w-4 h-4 rounded-sm ${getColor(day.minutes)} transition-colors hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500 cursor-help`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mt-2">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700/50"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/70"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-400"></div>
        <span>More</span>
      </div>
    </div>
  );
}
