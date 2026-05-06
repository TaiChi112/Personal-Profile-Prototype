"use client";

import { useState } from 'react';
import { Code2, Database, Layout, Terminal, ExternalLink, FileText, Server, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { profileData } from '../../data/profileData';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';

// เพิ่ม Loading Spinner ลงในฟังก์ชันเช็คไอคอน
const renderIcon = (iconName: string, isLoading: boolean = false) => {
  if (isLoading) {
    return <Loader2 size={20} className="animate-spin" />;
  }

  switch (iconName) {
    case 'terminal': return <Terminal size={20} />;
    case 'layout': return <Layout size={20} />;
    case 'database': return <Database size={20} />;
    case 'architecture': return <Code2 size={20} />;
    case 'server': return <Server size={20} />;
    case 'fileText': return <FileText size={20} />;
    case 'externalLink': return <ExternalLink size={20} />;
    default: return <Terminal size={20} />;
  }
};

type HeroSectionProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  onNavigate?: (tabId: string) => void;
};

export function HeroSection({ currentStyle, labels, onNavigate }: HeroSectionProps) {
  const router = useRouter();

  // 🎯 สร้าง State สำหรับเก็บว่าปุ่มไหนกำลังโหลดอยู่
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);

  const handleNavigation = (target: string) => {
    // เซ็ตสถานะให้ปุ่มที่ถูกกด กลายเป็นกำลังโหลด
    setLoadingTarget(target);

    // 1. ถ้าลิงก์ออกภายนอกเว็บ ให้เปิดแท็บใหม่
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      setLoadingTarget(null); // เปิดแท็บใหม่เสร็จ ก็ยกเลิกสถานะโหลดในหน้านี้
      return;
    }

    // 2. ถ้ามี / นำหน้า ให้ใช้ router.push เพื่อให้เป็น SPA Navigation (เร็วขึ้นและลดการโหลดใหม่ทั้งหน้า)
    if (target.startsWith('/')) {
      router.push(target);
      // ใน Next.js Router การย้ายหน้าจะเกิดขึ้นในเบื้องหลัง เราจะคงสถานะ Loading ไว้จนกว่าจะย้ายหน้าสำเร็จ
      return;
    }

    // 3. ถ้าเป็น Tab ภายใน (เช่น 'resume') ให้เปลี่ยน Tab
    if (onNavigate) {
      onNavigate(target);
      // ใช้ setTimeout เล็กน้อยเพื่อให้เห็นแอนิเมชันตอนสลับ Tab (UI ดูนุ่มนวลขึ้น)
      setTimeout(() => setLoadingTarget(null), 300);
    } else {
      router.push(`/${target}`);
      // ปล่อยให้มันหมุนไปเรื่อยๆ จนกว่า Router จะพาย้ายหน้าสำเร็จ
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-[80vh] flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">

        {/* Box 1: Welcome & Headline */}
        <div className="md:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center hover:shadow-lg transition-shadow">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 w-fit">
            {profileData.currectStatus}
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 ${currentStyle.name === 'Future' ? 'text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600' : 'text-gray-900 dark:text-white'}`}>
            {profileData.titlePrefix}
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 mb-6">
            {profileData.titleHighlight}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
            {profileData.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            {profileData.buttons.map((btn) => {
              const isPrimary = btn.variant === 'primary';
              const isThisBtnLoading = loadingTarget === btn.target; // 👈 ตรวจสอบว่าปุ่มนี้ถูกกดอยู่ไหม

              return (
                <button
                  key={btn.id}
                  onClick={() => handleNavigation(btn.target)}
                  disabled={loadingTarget !== null} // ป้องกันการกดปุ่มรัวๆ หรือกดปุ่มอื่นขณะกำลังโหลด
                  className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${loadingTarget !== null ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                    } ${isPrimary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {/* แสดง Spinner แทนไอคอนปกติถ้าปุ่มนี้กำลังโหลด */}
                  {renderIcon(btn.iconName, isThisBtnLoading)}
                  {isThisBtnLoading ? 'Loading...' : btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Box 2: Profile / Identity */}
        <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 w-32 h-32 rounded-full mb-6 flex items-center justify-center text-5xl font-bold bg-white/20 backdrop-blur-sm border-2 border-white/30 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
            {profileData.avatar.imageUrl ? (
              <Image
                src={profileData.avatar.imageUrl}
                alt="Profile Avatar"
                width={512}
                height={512}
                className="w-full h-full object-cover object-[100%_80%] scale-200"
                priority
              />
            ) : (
              profileData.avatar.text
            )}
          </div>
          <h3 className="text-2xl font-bold z-10">{profileData.avatar.position}</h3>
          <p className="text-blue-100 mt-2 z-10 text-center">{profileData.avatar.description}</p>
        </div>

        {/* Box 3: Tech Stack */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{profileData.skills.title}</h3>
          <div className="grid grid-cols-2 gap-4">
            {profileData.skills.data.map((skill, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <div className={skill.colorClass}>
                  {renderIcon(skill.iconName, false)}
                </div>
                <span className="font-medium">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 4: Featured Highlight */}
        <div
          className="md:col-span-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-slate-800 p-8 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors"
          onClick={() => handleNavigation(profileData.currentProject.link)}
        >
          <div>
            <div className="text-sm font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2 uppercase">{profileData.currentProject.status}</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{profileData.currentProject.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{profileData.currentProject.description}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex shrink-0 items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            {loadingTarget === profileData.currentProject.link ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <ExternalLink size={24} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}