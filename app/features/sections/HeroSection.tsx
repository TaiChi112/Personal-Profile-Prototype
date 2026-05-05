"use client";

import { Code2, Database, Layout, Terminal, ExternalLink, FileText } from 'lucide-react';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import Link from 'next/link';

type HeroSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNavigate?: (tabId: string) => void; // เพิ่ม Prop สำหรับให้ปุ่มเปลี่ยนหน้าได้
};

export function HeroSection({ currentStyle, labels, onNavigate }: HeroSectionProps) {
  // ฟังก์ชันตัวช่วยสำหรับสลับ Tab หรือลิงก์ไปหน้า Docs
  const handleNavigation = (target: string) => {
    if (target === 'docs') {
      globalThis.location.href = '/docs/computer_science'; // บังคับไปหน้า Docs
    } else if (onNavigate) {
      onNavigate(target); // เปลี่ยน Tab ปกติ
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-[80vh] flex flex-col justify-center">
      {/* Bento Box Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">

        {/* Box 1: Welcome & Headline (กินพื้นที่ 2 คอลัมน์) */}
        <div className="md:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center hover:shadow-lg transition-shadow">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 w-fit">
            Available for new opportunities
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 ${currentStyle.name === 'Future' ? 'text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600' : 'text-gray-900 dark:text-white'}`}>
            {labels.hero.titlePrefix}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 mb-6">
            {labels.hero.titleHighlight}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
            {labels.hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-auto">
            <button
              onClick={() => handleNavigation('projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <Layout size={18} />
              {labels.hero.btnProjects}
            </button>
            <button
              onClick={() => handleNavigation('docs')}
              className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 border border-gray-200 dark:border-slate-700"
            >
              <FileText size={18} />
              {labels.hero.btnArticles}
            </button>
          </div>
        </div>

        {/* Box 2: Profile / Identity */}
        <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 w-32 h-32 rounded-full mb-6 flex items-center justify-center text-5xl font-bold bg-white/20 backdrop-blur-sm border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
            AD
          </div>
          <h3 className="text-2xl font-bold z-10">Software Engineer</h3>
          <p className="text-blue-100 mt-2 z-10 text-center">Building scalable systems & elegant interfaces</p>
        </div>

        {/* Box 3: Tech Stack */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Core Arsenal</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Terminal size={20} className="text-blue-500" />
              <span className="font-medium">TypeScript</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Layout size={20} className="text-cyan-500" />
              <span className="font-medium">Next.js</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Database size={20} className="text-emerald-500" />
              <span className="font-medium">PostgreSQL</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Code2 size={20} className="text-indigo-500" />
              <span className="font-medium">Architecture</span>
            </div>
          </div>
        </div>

        {/* Box 4: Featured Highlight (กินพื้นที่ 2 คอลัมน์) */}
        <div className="md:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors" onClick={() => handleNavigation('docs')}>
          <div>
            <div className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2 uppercase">Currently Building</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Universal Academic Portfolio System (UAPS)</h3>
            <p className="text-gray-600 dark:text-gray-400">An intelligent document processing and portfolio management platform.</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <ExternalLink size={24} />
          </div>
        </div>

      </div>
    </div>
  );
}