"use client";
import React, { useState } from 'react';
import { useRecipeStore } from '../store/useRecipeStore';

export default function Scaler() {
  const { baseServings, targetServings, ingredients, setBase, setTarget, addIng, delIng } = useRecipeStore() as any;
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');

  const handleAdd = () => { if(name && amount) { addIng({name, amount: Number(amount), unit}); setName(''); setAmount(''); setUnit(''); } };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black mb-6 text-orange-500">RecipeScaler 🍳</h2>
      
      <div className="flex items-center gap-6 mb-8 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100">
        <div className="flex-1 text-center">
          <label className="block text-sm font-bold text-gray-500 mb-2">Original Servings</label>
          <input type="number" min="1" value={baseServings} onChange={e=>setBase(Number(e.target.value))} className="w-24 text-3xl font-black text-center p-2 rounded-lg border bg-white dark:bg-gray-900" />
        </div>
        <div className="text-3xl font-black text-orange-300">➜</div>
        <div className="flex-1 text-center">
          <label className="block text-sm font-bold text-gray-500 mb-2">Target Servings</label>
          <input type="number" min="1" value={targetServings} onChange={e=>setTarget(Number(e.target.value))} className="w-24 text-3xl font-black text-center p-2 rounded-lg border bg-white dark:bg-gray-900 text-orange-600" />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input placeholder="Ingredient (e.g. Sugar)" value={name} onChange={e=>setName(e.target.value)} className="flex-[2] p-3 border rounded-lg" />
        <input type="number" placeholder="Amt (e.g. 50)" value={amount} onChange={e=>setAmount(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <input placeholder="Unit (g, ml)" value={unit} onChange={e=>setUnit(e.target.value)} className="flex-1 p-3 border rounded-lg" />
        <button onClick={handleAdd} className="bg-orange-500 text-white font-bold px-4 rounded-lg">+</button>
      </div>

      <div className="space-y-3">
        {ingredients.map((i:any) => {
          const scaledAmount = (i.amount / (baseServings || 1)) * (targetServings || 1);
          return (
            <div key={i.id} className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900">
              <span className="font-medium text-lg">{i.name}</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400 line-through">{i.amount} {i.unit}</p>
                  <p className="font-black text-xl text-orange-600">{scaledAmount % 1 !== 0 ? scaledAmount.toFixed(1) : scaledAmount} {i.unit}</p>
                </div>
                <button onClick={()=>delIng(i.id)} className="text-gray-400 hover:text-red-500">✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
