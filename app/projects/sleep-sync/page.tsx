"use client";
import Link from 'next/link';
import SleepCalc from './components/SleepCalc';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block px-4 py-2 bg-slate-800 text-white rounded-full border border-slate-700 shadow-sm hover:bg-slate-700 transition">← Back</Link>
        <SleepCalc />
      </div>
    </div>
  );
}
