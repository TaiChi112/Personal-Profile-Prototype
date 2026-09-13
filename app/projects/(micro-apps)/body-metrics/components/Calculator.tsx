"use client";
import React from 'react';
import { useMetricsStore } from '../store/useMetricsStore';

export default function Calculator() {
  const { weight, height, age, gender, update } = useMetricsStore() as any;

  const bmi = weight / Math.pow(height / 100, 2);
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  let category = '';
  let color = '';
  if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
  else if (bmi < 24.9) { category = 'Normal'; color = 'text-green-500'; }
  else if (bmi < 29.9) { category = 'Overweight'; color = 'text-yellow-500'; }
  else { category = 'Obese'; color = 'text-red-500'; }

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6">Your Stats</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={()=>update('gender', 'male')} className={`flex-1 p-3 rounded-lg font-bold border-2 ${gender==='male'?'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600':'border-gray-200 text-gray-500'}`}>Male</button>
            <button onClick={()=>update('gender', 'female')} className={`flex-1 p-3 rounded-lg font-bold border-2 ${gender==='female'?'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600':'border-gray-200 text-gray-500'}`}>Female</button>
          </div>
          <div><label className="text-sm font-bold text-gray-500">Age</label><input type="number" value={age} onChange={e=>update('age', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" /></div>
          <div><label className="text-sm font-bold text-gray-500">Weight (kg)</label><input type="number" value={weight} onChange={e=>update('weight', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" /></div>
          <div><label className="text-sm font-bold text-gray-500">Height (cm)</label><input type="number" value={height} onChange={e=>update('height', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" /></div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm font-bold uppercase text-gray-500 mb-2">BMI</p>
          <h1 className="text-5xl font-black mb-2">{bmi.toFixed(1)}</h1>
          <span className={`px-4 py-1 rounded-full font-bold bg-white dark:bg-gray-900 ${color}`}>{category}</span>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white text-center shadow-xl">
          <p className="text-sm font-bold uppercase opacity-80 mb-2">Base Calorie Burn (BMR)</p>
          <h1 className="text-5xl font-black mb-2">{bmr.toFixed(0)}</h1>
          <p className="opacity-90 font-medium">kcal / day</p>
        </div>
      </div>
    </div>
  );
}
