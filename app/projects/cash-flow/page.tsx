"use client";
import Link from 'next/link';
import Flow from './components/Flow';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <Link href="/projects" className="inline-block mb-8 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <h1 className="text-3xl font-black mb-12 text-center">CashFlow Stream 🌊</h1>
      <Flow />
    </div>
  );
}
