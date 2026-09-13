"use client";
import React from 'react';
import { useTaxStore } from '../store/useTaxStore';

export default function TaxCalc() {
  const { salary, bonus, ssf, insurance, update } = useTaxStore() as any;

  // Simplified Thai Tax Logic
  const totalIncome = (salary * 12) + bonus;
  const standardDeduction = Math.min(totalIncome * 0.5, 100000);
  const personalDeduction = 60000;
  const netIncome = Math.max(0, totalIncome - standardDeduction - personalDeduction - ssf - insurance);

  let tax = 0;
  if (netIncome > 5000000) tax += (netIncome - 5000000) * 0.35 + 1265000;
  else if (netIncome > 2000000) tax += (netIncome - 2000000) * 0.30 + 365000;
  else if (netIncome > 1000000) tax += (netIncome - 1000000) * 0.25 + 115000;
  else if (netIncome > 750000) tax += (netIncome - 750000) * 0.20 + 65000;
  else if (netIncome > 500000) tax += (netIncome - 500000) * 0.15 + 27500;
  else if (netIncome > 300000) tax += (netIncome - 300000) * 0.10 + 7500;
  else if (netIncome > 150000) tax += (netIncome - 150000) * 0.05;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm">
        <h2 className="text-xl font-bold border-b pb-4">Income & Deductions</h2>
        <div>
          <label className="text-sm font-bold text-gray-500">Monthly Salary (THB)</label>
          <input type="number" value={salary} onChange={e => update('salary', Number(e.target.value))} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-500">Yearly Bonus (THB)</label>
          <input type="number" value={bonus} onChange={e => update('bonus', Number(e.target.value))} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-500">Life Insurance (Max 100k)</label>
          <input type="number" value={insurance} onChange={e => update('insurance', Number(e.target.value))} className="w-full p-3 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-500">SSF / RMF</label>
          <input type="number" value={ssf} onChange={e => update('ssf', Number(e.target.value))} className="w-full p-3 border rounded-lg" />
        </div>
      </div>
      
      <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl flex flex-col">
        <h2 className="text-xl font-bold border-b border-indigo-400 pb-4 mb-6">Tax Summary (Estimated)</h2>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between"><span>Total Yearly Income:</span> <span>{totalIncome.toLocaleString()} ฿</span></div>
          <div className="flex justify-between text-indigo-200"><span>Standard Deduction:</span> <span>-{standardDeduction.toLocaleString()} ฿</span></div>
          <div className="flex justify-between text-indigo-200"><span>Personal Deduction:</span> <span>-{personalDeduction.toLocaleString()} ฿</span></div>
          <div className="flex justify-between font-bold border-t border-indigo-400 pt-2"><span>Net Taxable Income:</span> <span>{netIncome.toLocaleString()} ฿</span></div>
        </div>
        
        <div className="mt-auto text-center p-6 bg-indigo-700 rounded-2xl">
          <p className="text-indigo-200 font-bold mb-2">Estimated Tax to Pay</p>
          <h1 className="text-5xl font-black">{tax.toLocaleString()} ฿</h1>
        </div>
      </div>
    </div>
  );
}
