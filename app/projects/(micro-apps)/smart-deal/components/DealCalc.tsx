"use client";
import React from 'react';
import { useDealStore } from '../store/useDealStore';

export default function DealCalc() {
  const { itemA, itemB, updateA, updateB } = useDealStore() as any;
  const unitA = itemA.price / (itemA.qty || 1);
  const unitB = itemB.price / (itemB.qty || 1);
  
  let winner = "Equal Value";
  let color = "text-gray-500";
  let percent = 0;

  if (unitA < unitB) {
    winner = "Item A is Cheaper!";
    color = "text-green-500";
    percent = ((unitB - unitA) / unitB) * 100;
  } else if (unitB < unitA) {
    winner = "Item B is Cheaper!";
    color = "text-blue-500";
    percent = ((unitA - unitB) / unitA) * 100;
  }

  const InputCard = ({ title, item, update, colorClass }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className={`font-bold text-xl mb-4 ${colorClass}`}>{title}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold">Price (THB)</label>
          <input type="number" min="0" value={item.price} onChange={e => update('price', Number(e.target.value))} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border" />
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase font-bold">Quantity / Weight</label>
          <input type="number" min="1" value={item.qty} onChange={e => update('qty', Number(e.target.value))} className="w-full p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t text-sm font-bold text-gray-500">Unit Cost: {isNaN(item.price/item.qty) ? 0 : (item.price/item.qty).toFixed(2)} THB/unit</div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InputCard title="Item A" item={itemA} update={updateA} colorClass="text-green-500" />
        <InputCard title="Item B" item={itemB} update={updateB} colorClass="text-blue-500" />
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">Verdict</h2>
        <h1 className={`text-4xl font-black ${color}`}>{winner}</h1>
        {percent > 0 && <p className="text-lg mt-2 text-gray-500">Saves {percent.toFixed(1)}% per unit</p>}
      </div>
    </div>
  );
}
