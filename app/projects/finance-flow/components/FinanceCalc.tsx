"use client";
import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

export default function FinanceCalc() {
  const { transactions, addTx, delTx } = useFinanceStore() as any;
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('expense');

  const handleAdd = () => {
    if (amount && label) {
      addTx({ amount: Number(amount), label, type });
      setAmount(''); setLabel('');
    }
  };

  const income = transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
  const expense = transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-emerald-500 text-white p-8 text-center">
        <p className="opacity-80 font-bold uppercase tracking-widest text-xs mb-2">Total Balance</p>
        <h1 className="text-5xl font-black">{balance.toLocaleString()} ฿</h1>
        <div className="flex justify-between mt-6 pt-6 border-t border-emerald-400">
          <div><p className="text-xs opacity-80 uppercase">Income</p><p className="font-bold">{income.toLocaleString()}</p></div>
          <div><p className="text-xs opacity-80 uppercase">Expense</p><p className="font-bold">{expense.toLocaleString()}</p></div>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 flex gap-2">
        <select value={type} onChange={e=>setType(e.target.value)} className="p-3 rounded-lg border w-28 bg-white dark:bg-gray-800">
          <option value="expense">Exp 🔴</option>
          <option value="income">Inc 🟢</option>
        </select>
        <input type="text" placeholder="Label" value={label} onChange={e=>setLabel(e.target.value)} className="p-3 rounded-lg border flex-1" />
        <input type="number" placeholder="Amt" value={amount} onChange={e=>setAmount(e.target.value)} className="p-3 rounded-lg border w-24" />
        <button onClick={handleAdd} className="bg-blue-600 text-white p-3 rounded-lg font-bold">+</button>
      </div>

      <div className="p-6 space-y-3 h-80 overflow-y-auto">
        {transactions.map((t: any) => (
          <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span className="font-medium">{t.label}</span>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
              </span>
              <button onClick={() => delTx(t.id)} className="text-gray-400 hover:text-red-500">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
