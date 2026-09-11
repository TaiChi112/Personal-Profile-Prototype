"use client";
import Link from 'next/link';
import Timer from './components/Timer';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/projects" className="inline-block px-4 py-2 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20">← Back</Link>
        <Timer />
      </div>
    </div>
  );
}
