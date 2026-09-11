"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PomodoroTimer from './components/PomodoroTimer';
import ActivityHeatmap from './components/ActivityHeatmap';
import { useFocusStore } from './store/useFocusStore';

export default function FocusFlowApp() {
  const [mounted, setMounted] = useState(false);
  const { history, clearHistory } = useFocusStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalSessions = history.length;
  const totalMinutes = history.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  if (!mounted) return null; // Avoid hydration mismatch for LocalStorage

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-rose-500">Focus</span>Flow
              </h1>
              <p className="text-sm text-gray-500">Pomodoro Timer & Habit Tracker</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Focus Time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sessions</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Timer Section */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl shadow-rose-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-center">
              <PomodoroTimer />
            </div>
          </div>

          {/* Analytics & Heatmap Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activity Heatmap</h2>
                {history.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all your history?')) {
                        clearHistory();
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>
              <ActivityHeatmap />
              <p className="text-sm text-gray-500 mt-6 text-center">
                Complete a Focus session to fill a square. Each square represents a day!
              </p>
            </div>
            
            {/* Recent Sessions List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Sessions</h2>
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No sessions recorded yet. Start focusing!</div>
              ) : (
                <ul className="space-y-3">
                  {[...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5).map((session) => (
                    <li key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        <span className="font-medium text-gray-900 dark:text-white">{session.date}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {session.durationMinutes} mins
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
