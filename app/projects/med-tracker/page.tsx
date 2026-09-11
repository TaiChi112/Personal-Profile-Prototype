"use client";
import Link from 'next/link';
import MedList from './components/MedList';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-emerald-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8 text-emerald-700 dark:text-emerald-400">💊 Med Tracker</h1>
        <MedList />
      </div>
    </div>
  );
}
