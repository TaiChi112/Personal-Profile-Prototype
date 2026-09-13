"use client";
import Link from 'next/link';
import Fridge from './components/Fridge';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-blue-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8 text-blue-800 dark:text-blue-400">🧊 Fridge Expiry Tracker</h1>
        <Fridge />
      </div>
    </div>
  );
}
