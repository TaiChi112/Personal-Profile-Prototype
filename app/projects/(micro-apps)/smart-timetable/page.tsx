"use client";
import Link from 'next/link';
import Timetable from './components/Timetable';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
        <h1 className="text-3xl font-black text-blue-600 mb-8">Smart Timetable</h1>
        <Timetable />
      </div>
    </div>
  );
}
