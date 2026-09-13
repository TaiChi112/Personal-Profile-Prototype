"use client";
import React, { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/useTimerStore';

export default function Timer() {
  const { workTime, restTime, totalRounds, status, timeLeft, currentRound, updateSetup, setStatus, setTimeLeft, setRound } = useTimerStore() as any;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (status !== 'idle') {
      timerRef.current = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [status, timeLeft, setTimeLeft]);

  useEffect(() => {
    if (timeLeft < 0) {
      if (status === 'work') {
        if (currentRound >= totalRounds) { setStatus('idle'); setTimeLeft(workTime); setRound(1); }
        else { setStatus('rest'); setTimeLeft(restTime); }
      } else if (status === 'rest') {
        setStatus('work'); setTimeLeft(workTime); setRound(currentRound + 1);
      }
    }
  }, [timeLeft, status, currentRound, totalRounds, workTime, restTime, setStatus, setTimeLeft, setRound]);

  const toggle = () => {
    if (status === 'idle') { setStatus('work'); setTimeLeft(workTime); setRound(1); }
    else { setStatus('idle'); clearInterval(timerRef.current); }
  };

  const bg = status === 'idle' ? 'bg-slate-900' : status === 'work' ? 'bg-rose-600' : 'bg-emerald-500';

  return (
    <div className={`max-w-xl mx-auto p-8 rounded-3xl shadow-2xl transition-colors duration-500 ${bg} text-white text-center`}>
      <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl mb-8">
        <div><label className="text-xs uppercase font-bold opacity-70 block mb-1">Work (s)</label><input type="number" value={workTime} onChange={e=>updateSetup('workTime', Number(e.target.value))} disabled={status!=='idle'} className="w-16 bg-transparent border-b-2 text-center text-xl font-bold" /></div>
        <div><label className="text-xs uppercase font-bold opacity-70 block mb-1">Rest (s)</label><input type="number" value={restTime} onChange={e=>updateSetup('restTime', Number(e.target.value))} disabled={status!=='idle'} className="w-16 bg-transparent border-b-2 text-center text-xl font-bold" /></div>
        <div><label className="text-xs uppercase font-bold opacity-70 block mb-1">Rounds</label><input type="number" value={totalRounds} onChange={e=>updateSetup('totalRounds', Number(e.target.value))} disabled={status!=='idle'} className="w-16 bg-transparent border-b-2 text-center text-xl font-bold" /></div>
      </div>
      
      <p className="font-bold text-xl mb-4 tracking-widest uppercase opacity-80">{status === 'idle' ? 'Ready' : status}</p>
      <h1 className="text-9xl font-black mb-4 tabular-nums">{Math.max(0, timeLeft)}</h1>
      <p className="font-bold text-2xl mb-8">Round {currentRound} / {totalRounds}</p>
      
      <button onClick={toggle} className="w-full bg-white text-black font-black text-2xl py-4 rounded-2xl hover:bg-gray-200">
        {status === 'idle' ? 'START' : 'STOP'}
      </button>
    </div>
  );
}
