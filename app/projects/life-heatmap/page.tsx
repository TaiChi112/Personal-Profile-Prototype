"use client";
import Link from 'next/link';
import Heatmap from './components/Heatmap';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-emerald-50 dark:bg-black">
      <Link href="/projects" className="inline-block mb-8 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <Heatmap />
    </div>
  );
}
