"use client";
import React from 'react';
import { useBillStore } from '../store/useBillStore';

export default function SplitCalc() {
  const { total, people, ppNumber, update } = useBillStore() as any;
  const perPerson = total / (people || 1);

  // Thai PromptPay Payload format (basic mock implementation for visual purposes)
  const ppPayload = `00020101021129370016A00000067701011101130066${ppNumber.substring(1)}5802TH5303764540${perPerson.toFixed(2).length}${perPerson.toFixed(2)}6304`;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-black mb-6 text-center">BillSplitter + PromptPay</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-bold text-gray-500">Total Bill (THB)</label>
          <input type="number" value={total} onChange={e => update('total', Number(e.target.value))} className="w-full p-4 text-2xl font-black text-center bg-gray-50 dark:bg-gray-900 border rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-500">Number of People</label>
          <input type="number" value={people} onChange={e => update('people', Number(e.target.value))} className="w-full p-4 text-2xl font-black text-center bg-gray-50 dark:bg-gray-900 border rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-500">Your PromptPay Number (for QR)</label>
          <input type="text" value={ppNumber} onChange={e => update('ppNumber', e.target.value)} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border rounded-xl" />
        </div>
      </div>
      
      <div className="bg-blue-600 text-white p-6 rounded-2xl text-center">
        <p className="opacity-80 font-bold mb-1">Each Person Pays</p>
        <h1 className="text-5xl font-black">{perPerson.toLocaleString(undefined, {maximumFractionDigits: 2})} ฿</h1>
        
        {ppNumber.length >= 10 && (
          <div className="mt-6 bg-white p-4 rounded-xl inline-block mx-auto">
            {/* Dummy QR Code Visual since we don't have qrcode.react installed */}
            <div className="w-32 h-32 bg-gray-200 border-4 border-gray-800 flex items-center justify-center text-gray-800 font-bold text-xs p-2 text-center">
              [QR Code Simulation for<br/>{ppNumber}]
            </div>
            <p className="text-gray-800 font-bold mt-2 text-xs">Scan to pay</p>
          </div>
        )}
      </div>
    </div>
  );
}
