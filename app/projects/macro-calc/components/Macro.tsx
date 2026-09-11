"use client";
import React from 'react';
import { useMacroStore } from '../store/useMacroStore';

export default function Macro() {
  const { protein, carbs, fat, update } = useMacroStore() as any;
  
  const pCal = protein * 4;
  const cCal = carbs * 4;
  const fCal = fat * 9;
  const total = pCal + cCal + fCal;
  
  const pPct = total ? (pCal/total)*100 : 0;
  const cPct = total ? (cCal/total)*100 : 0;
  const fPct = total ? (fCal/total)*100 : 0;

  const InputBar = ({ label, val, onChange, color, cal }: any) => (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className={`w-3 h-12 rounded-full ${color}`}></div>
      <div className="flex-1">
        <p className="font-bold">{label}</p>
        <p className="text-xs text-gray-500">{cal} kcal</p>
      </div>
      <input type="number" value={val} onChange={e=>onChange(Number(e.target.value))} className="w-24 p-2 text-xl font-black text-center border rounded-lg bg-white dark:bg-gray-800" />
      <span className="font-bold text-gray-500">g</span>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <div className="text-center mb-8">
        <p className="text-sm font-bold uppercase text-gray-500 mb-2">Total Calories</p>
        <h1 className="text-6xl font-black">{total.toLocaleString()}</h1>
      </div>
      
      <div className="h-4 w-full flex rounded-full overflow-hidden mb-8 shadow-inner">
        <div style={{width: `${pPct}%`}} className="bg-blue-500"></div>
        <div style={{width: `${cPct}%`}} className="bg-emerald-500"></div>
        <div style={{width: `${fPct}%`}} className="bg-amber-500"></div>
      </div>
      <div className="flex justify-between text-xs font-bold text-gray-500 mb-8 px-2">
        <span className="text-blue-500">{pPct.toFixed(0)}% P</span>
        <span className="text-emerald-500">{cPct.toFixed(0)}% C</span>
        <span className="text-amber-500">{fPct.toFixed(0)}% F</span>
      </div>

      <div className="space-y-4">
        <InputBar label="Protein" val={protein} onChange={(v:number)=>update('protein',v)} color="bg-blue-500" cal={pCal} />
        <InputBar label="Carbs" val={carbs} onChange={(v:number)=>update('carbs',v)} color="bg-emerald-500" cal={cCal} />
        <InputBar label="Fat" val={fat} onChange={(v:number)=>update('fat',v)} color="bg-amber-500" cal={fCal} />
      </div>
    </div>
  );
}
