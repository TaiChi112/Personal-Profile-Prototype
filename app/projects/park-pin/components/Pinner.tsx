"use client";
import React, { useState } from 'react';
import { useParkStore } from '../store/useParkStore';

export default function Pinner() {
  const { floor, pillar, note, saved, savePark, clearPark } = useParkStore() as any;
  const [f, setF] = useState(floor);
  const [p, setP] = useState(pillar);
  const [n, setN] = useState(note);

  if (saved) {
    return (
      <div className="max-w-md mx-auto bg-yellow-400 text-yellow-900 p-8 rounded-3xl shadow-xl text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest opacity-80 mb-2">You Parked At</h2>
        <div className="bg-white/90 p-8 rounded-2xl mb-6 shadow-inner">
          <p className="text-gray-500 font-bold mb-1">Floor</p>
          <h1 className="text-7xl font-black mb-4">{floor}</h1>
          <p className="text-gray-500 font-bold mb-1">Pillar</p>
          <h2 className="text-5xl font-black">{pillar}</h2>
        </div>
        {note && <p className="font-medium bg-yellow-500/50 p-4 rounded-xl mb-6">📝 {note}</p>}
        <button onClick={()=>{clearPark(); setF(''); setP(''); setN('');}} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800">I Found My Car! 🚗</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black mb-6">ParkPin 📍</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label className="font-bold text-gray-500">Floor (e.g. 5B)</label>
          <input type="text" value={f} onChange={e=>setF(e.target.value)} className="w-full text-3xl font-black p-4 border-2 rounded-xl mt-1 uppercase" placeholder="5B" />
        </div>
        <div>
          <label className="font-bold text-gray-500">Pillar (e.g. H4)</label>
          <input type="text" value={p} onChange={e=>setP(e.target.value)} className="w-full text-3xl font-black p-4 border-2 rounded-xl mt-1 uppercase" placeholder="H4" />
        </div>
        <div>
          <label className="font-bold text-gray-500">Extra Note (Optional)</label>
          <input type="text" value={n} onChange={e=>setN(e.target.value)} className="w-full p-4 border rounded-xl mt-1" placeholder="Near the elevator..." />
        </div>
      </div>
      <button onClick={()=>f && savePark(f, p, n)} disabled={!f} className="w-full bg-yellow-400 text-yellow-900 font-black text-xl py-4 rounded-xl disabled:opacity-50">Pin Location 📌</button>
    </div>
  );
}
