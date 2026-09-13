"use client";
import React, { useState } from 'react';
import { addTransaction, deleteTransaction } from '../actions';
import { signOut } from 'next-auth/react';

export default function FinanceCalc({ initialTransactions, user }: { initialTransactions: any[], user: any }) {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (amount && label && !loading) {
      setLoading(true);
      await addTransaction(Number(amount), label, type);
      setAmount(''); setLabel('');
      setLoading(false);
    }
  };

  const handleDel = async (id: string) => {
    if(!loading) {
      setLoading(true);
      await deleteTransaction(id);
      setLoading(false);
    }
  };

  const income = initialTransactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
  const expense = initialTransactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          {user?.image && <img src={user.image} alt="Avatar" className="w-8 h-8 rounded-full" />}
          <span className="font-bold text-sm">Welcome, {user?.name?.split(' ')[0] || 'User'}</span>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/projects/finance-flow' })} className="text-xs font-bold text-red-500 hover:underline">
          Sign Out
        </button>
      </div>

      <div className="bg-emerald-500 text-white p-8 text-center relative">
        {loading && <div className="absolute top-2 right-4 text-xs font-bold animate-pulse">Syncing...</div>}
        <p className="opacity-80 font-bold uppercase tracking-widest text-xs mb-2">Total Balance</p>
        <h1 className="text-5xl font-black">{balance.toLocaleString()} ฿</h1>
        <div className="flex justify-between mt-6 pt-6 border-t border-emerald-400">
          <div><p className="text-xs opacity-80 uppercase">Income</p><p className="font-bold">{income.toLocaleString()}</p></div>
          <div><p className="text-xs opacity-80 uppercase">Expense</p><p className="font-bold">{expense.toLocaleString()}</p></div>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 flex flex-wrap gap-2">
        <select value={type} onChange={e=>setType(e.target.value)} disabled={loading} className="p-3 rounded-lg border w-28 bg-white dark:bg-gray-800 disabled:opacity-50">
          <option value="expense">Exp 🔴</option>
          <option value="income">Inc 🟢</option>
        </select>
        <input type="text" placeholder="Label" value={label} onChange={e=>setLabel(e.target.value)} disabled={loading} className="p-3 rounded-lg border flex-1 min-w-[120px] disabled:opacity-50" />
        <input type="number" placeholder="Amt" value={amount} onChange={e=>setAmount(e.target.value)} disabled={loading} className="p-3 rounded-lg border w-24 disabled:opacity-50" />
        <button onClick={handleAdd} disabled={loading} className="bg-blue-600 text-white px-5 py-3 rounded-lg font-bold disabled:opacity-50 transition-transform active:scale-95 flex-shrink-0">
          + Add
        </button>
      </div>

      <div className="p-6 space-y-3 h-80 overflow-y-auto">
        {initialTransactions.map((t: any) => (
          <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span className="font-medium">{t.label}</span>
            <div className="flex items-center gap-4">
              <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
              </span>
              <button onClick={() => handleDel(t.id)} disabled={loading} className="text-gray-400 hover:text-red-500 disabled:opacity-50">✕</button>
            </div>
          </div>
        ))}
        {initialTransactions.length === 0 && <p className="text-center text-gray-400 font-bold mt-12">No transactions.</p>}
      </div>
    </div>
  );
}
