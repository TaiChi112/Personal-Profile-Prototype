"use client";
import Link from 'next/link';
import Hydrate from './components/Hydrate';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-blue-50 dark:bg-gray-900 z-0">
      <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm relative z-10">← Back</Link>
      <Hydrate />
    </div>
  );
}
