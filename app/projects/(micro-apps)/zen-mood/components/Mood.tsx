"use client";
import React, { useState } from 'react';
import { useMoodStore } from '../store/useMoodStore';

export default function Mood() {
  const { entries, add } = useMoodStore() as any;
  const [mood, setMood] = useState('😐');
  const [energy, setEnergy] = useState(5);

  const handleSave = () => {
    add({ mood, energy, date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl text-center">
        <h2 className="font-bold text-gray-500 mb-6">How are you today?</h2>
        <div className="flex justify-center gap-4 mb-8 text-4xl">
          {['😠','😔','😐','🙂','😁'].map(m => (
            <button key={m} onClick={()=>setMood(m)} className={`p-3 rounded-full transition-transform ${mood===m?'bg-purple-100 scale-125 ring-4 ring-purple-300':''}`}>{m}</button>
          ))}
        </div>
        
        <h2 className="font-bold text-gray-500 mb-4">Energy Level: <span className="text-purple-600 text-xl">{energy}</span>/10</h2>
        <input type="range" min="1" max="10" value={energy} onChange={e=>setEnergy(Number(e.target.value))} className="w-full accent-purple-500 mb-8" />
        
        <button onClick={handleSave} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-700">Save Journal</button>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-500 ml-4">Recent Entries</h3>
        {entries.map((e:any) => (
          <div key={e.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50 dark:border-gray-700">
            <div className="text-3xl">{e.mood}</div>
            <div className="flex-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">{e.date}</p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: `${(e.energy/10)*100}%`}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
