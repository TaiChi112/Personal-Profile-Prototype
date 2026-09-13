"use client";
import Link from 'next/link';
import Mood from './components/Mood';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-purple-50 dark:bg-gray-900">
      <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <h1 className="text-3xl font-black mb-8 text-purple-800 dark:text-purple-400 text-center">ZenMood 🧘</h1>
      <Mood />
    </div>
  );
}
