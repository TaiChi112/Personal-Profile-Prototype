"use client";

import React, { useEffect } from 'react';
import { useFocusStore, TimerMode, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME } from '../store/useFocusStore';

export default function PomodoroTimer() {
  const { timeLeft, isRunning, mode, setTimeLeft, setIsRunning, setMode, addSession } = useFocusStore();

  const totalTime = mode === 'FOCUS' ? FOCUS_TIME : mode === 'SHORT_BREAK' ? SHORT_BREAK_TIME : LONG_BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer finished!
      setIsRunning(false);
      
      // Play sound (fallback to alert)
      try {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
        audio.play().catch(() => alert('Time is up!'));
      } catch (e) {
        alert('Time is up!');
      }

      if (mode === 'FOCUS') {
        addSession(Math.round(FOCUS_TIME / 60));
        setMode('SHORT_BREAK'); // Auto-switch to break
      } else {
        setMode('FOCUS'); // Auto-switch to focus
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, setTimeLeft, setIsRunning, setMode, addSession]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      
      {/* Mode Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-full mb-8">
        {(['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'] as TimerMode[]).map((tMode) => (
          <button
            key={tMode}
            onClick={() => setMode(tMode)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              mode === tMode 
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {tMode.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* SVG Timer Ring */}
      <div className="relative flex items-center justify-center mb-10 group">
        <svg className="transform -rotate-90 w-72 h-72">
          {/* Background circle */}
          <circle
            cx="144" cy="144" r={radius}
            className="text-gray-100 dark:text-gray-700"
            strokeWidth="12" stroke="currentColor" fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="144" cy="144" r={radius}
            className={`${mode === 'FOCUS' ? 'text-rose-500' : 'text-blue-500'} transition-all duration-1000 ease-linear`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">
            {minutes}:{seconds}
          </span>
          <span className="text-sm font-medium text-gray-400 mt-2 tracking-widest uppercase">
            {mode.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={`w-32 py-4 rounded-2xl font-black text-lg transition-transform hover:scale-105 active:scale-95 ${
            isRunning 
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl'
          }`}
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
          title="Reset Timer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>

    </div>
  );
}
