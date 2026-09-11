"use client";
import Link from 'next/link';
import AnalogClock from './components/AnalogClock';
export default function Page() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/projects" className="text-white/70 hover:text-white bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">Back</Link>
          <h1 className="text-3xl font-bold text-white">Glassmorphism Dash</h1>
        </div>
        <div className="flex items-center justify-center h-[60vh]">
          <AnalogClock />
        </div>
      </div>
    </div>
  );
}
