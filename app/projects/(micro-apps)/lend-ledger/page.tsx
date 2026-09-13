"use client";
import Link from 'next/link';
import Ledger from './components/Ledger';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-emerald-50 dark:bg-gray-900">
      <Link href="/projects" className="inline-block mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
      <Ledger />
    </div>
  );
}
