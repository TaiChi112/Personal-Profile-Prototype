"use client";
import Link from 'next/link';
import TypingGame from './components/TypingGame';

export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-sm px-4 py-2 bg-white dark:bg-gray-800 rounded-full border shadow-sm">← Back</Link>
          <h1 className="text-3xl font-black">Type Trainer</h1>
        </div>
        <TypingGame />
      </div>
    </div>
  );
}
