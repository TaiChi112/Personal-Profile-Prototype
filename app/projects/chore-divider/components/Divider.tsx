"use client";
import React from 'react';
import { useChoreStore } from '../store/useChoreStore';

export default function Divider() {
  const { people, chores, assignments, assign } = useChoreStore() as any;

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-3">Roommates</h3>
          <div className="flex flex-wrap gap-2">
            {people.map((p:string) => <span key={p} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{p}</span>)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-3">Chores</h3>
          <div className="flex flex-wrap gap-2">
            {chores.map((c:string) => <span key={c} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{c}</span>)}
          </div>
        </div>
        <button onClick={assign} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl text-xl hover:bg-indigo-700 shadow-lg">Assign Duties</button>
      </div>
      
      <div className="bg-indigo-50 dark:bg-gray-800 p-6 rounded-3xl border-2 border-indigo-200 dark:border-indigo-900">
        <h3 className="font-black text-2xl mb-6 text-indigo-900 dark:text-indigo-100">This Week's Duty</h3>
        {assignments.length === 0 ? (
          <p className="text-gray-500 italic text-center mt-12">Click assign to distribute chores</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a:any, i:number) => (
              <div key={i} className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm flex justify-between items-center">
                <span className="font-bold text-lg">{a.person}</span>
                <span className="text-indigo-600 dark:text-indigo-300 font-medium">{a.chore}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
