"use client";
import Link from 'next/link';
import Scaler from './components/Scaler';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-orange-50 dark:bg-gray-900">
      <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <Scaler />
    </div>
  );
}
