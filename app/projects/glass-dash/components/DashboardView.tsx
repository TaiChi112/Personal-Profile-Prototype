"use client";

import React from 'react';
import AnalogClock from './AnalogClock';
import FinanceWidget from './FinanceWidget';
import KanbanWidget from './KanbanWidget';

interface DashboardViewProps {
  transactions: any[];
  tasks: any[];
}

export default function DashboardView({ transactions, tasks }: DashboardViewProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <AnalogClock />
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6 md:col-span-1 lg:col-span-2">
          <FinanceWidget transactions={transactions} />
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6 col-span-1 md:col-span-2 lg:col-span-3">
          <KanbanWidget tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
