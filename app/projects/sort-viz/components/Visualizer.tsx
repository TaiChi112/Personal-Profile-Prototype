"use client";
import React from 'react';
import { useSortStore } from '../store/useSortStore';

export default function Visualizer() {
  const { array, isSorting, generateArray, setArray, setIsSorting } = useSortStore();

  const bubbleSort = async () => {
    setIsSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await new Promise(r => setTimeout(r, 50));
        }
      }
    }
    setIsSorting(false);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl w-full">
      <div className="flex gap-4 mb-8">
        <button onClick={generateArray} disabled={isSorting} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50">Generate New Array</button>
        <button onClick={bubbleSort} disabled={isSorting} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">Bubble Sort</button>
      </div>
      <div className="flex items-end h-64 gap-1 w-full justify-center">
        {array.map((val, idx) => (
          <div key={idx} className="w-4 bg-blue-500 rounded-t-md transition-all duration-75" style={{ height: `${val}%` }}></div>
        ))}
      </div>
    </div>
  );
}
