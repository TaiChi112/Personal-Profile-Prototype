"use client";
import Link from 'next/link';
import Macro from './components/Macro';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8">MacroCalc 🥩</h1>
        <Macro />
      </div>
    </div>
  );
}
