"use client";

import React from 'react';

interface FinanceWidgetProps {
  transactions: any[];
}

export default function FinanceWidget({ transactions }: FinanceWidgetProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-green-300">Total Income:</span>
        <span className="font-bold text-green-400">${totalIncome.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-red-300">Total Expense:</span>
        <span className="font-bold text-red-400">${totalExpense.toFixed(2)}</span>
      </div>
    </div>
  );
}
