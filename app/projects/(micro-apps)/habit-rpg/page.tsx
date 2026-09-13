"use client";
import Link from 'next/link';
import RpgGame from './components/RpgGame';

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm hover:bg-gray-50">← Back</Link>
          <h1 className="text-3xl font-black text-indigo-600">Habit RPG</h1>
        </div>
        <RpgGame />
      </div>
    </div>
  );
}
