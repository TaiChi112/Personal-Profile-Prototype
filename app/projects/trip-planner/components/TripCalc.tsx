"use client";
import React from 'react';
import { useTripStore } from '../store/useTripStore';

export default function TripCalc() {
  const { distance, efficiency, price, update } = useTripStore() as any;

  const litersNeeded = distance / (efficiency || 1);
  const totalCost = litersNeeded * price;
  const stops = Math.floor(distance / 200);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6">Route Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-500">Total Distance (km)</label>
            <input type="number" value={distance} onChange={e => update('distance', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-500">Car Efficiency (km/l)</label>
            <input type="number" value={efficiency} onChange={e => update('efficiency', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-500">Fuel Price (THB/l)</label>
            <input type="number" value={price} onChange={e => update('price', Number(e.target.value))} className="w-full p-3 border rounded-lg mt-1" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-3xl text-amber-900 dark:text-amber-100 flex flex-col items-center justify-center text-center">
          <p className="font-bold text-sm uppercase tracking-widest opacity-70 mb-2">Estimated Fuel Cost</p>
          <h1 className="text-6xl font-black">{totalCost.toLocaleString(undefined, {maximumFractionDigits:0})} ฿</h1>
          <p className="mt-4 opacity-80">You will need approx {litersNeeded.toFixed(1)} liters</p>
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-3xl text-blue-900 dark:text-blue-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold">Recommended Stops</h3>
            <p className="text-sm opacity-80">Stop every 200km for safety</p>
          </div>
          <div className="text-4xl font-black">{stops}</div>
        </div>
      </div>
    </div>
  );
}
