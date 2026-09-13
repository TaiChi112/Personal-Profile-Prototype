"use client";
import React, { useEffect, useState } from 'react';

export default function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-80 h-80 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white">
      <h2 className="text-6xl font-black tabular-nums">{time.toLocaleTimeString()}</h2>
      <p className="mt-4 text-xl font-medium tracking-widest">{time.toLocaleDateString()}</p>
    </div>
  );
}
