"use client";
import Link from 'next/link';
import Calculator from './components/Calculator';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black mb-8">BodyMetrics ⚖️</h1>
        <Calculator />
      </div>
    </div>
  );
}
