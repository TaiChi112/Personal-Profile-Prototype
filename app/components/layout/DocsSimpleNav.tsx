'use client';

import { User, Code, FileText, BookOpen, Briefcase } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export function DocsSimpleNav() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const userDisplayName = session?.user?.name ?? session?.user?.email ?? null;

  const navItems = [
    { id: 'home', name: 'Home', icon: <User size={16} />, href: '/' },
    { id: 'projects', name: 'Projects', icon: <Code size={16} />, href: '/projects' },
    { id: 'docs', name: 'Docs', icon: <FileText size={16} />, href: '/docs' },
    { id: 'articles', name: 'Articles', icon: <BookOpen size={16} />, href: '/articles' },
    { id: 'blog', name: 'Blog', icon: <FileText size={16} />, href: '/blogs' },
    { id: 'resume', name: 'Resume', icon: <Briefcase size={16} />, href: '/resume' },
  ];

  return (
    // แก้สีพื้นหลังให้ตรงกับ Fumadocs (bg-white และ bg-[#0a0a0a])
    <nav className="w-full border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ใช้ flex-wrap เพื่อให้เมนูไหลลงมาถัดไปได้ถ้าที่ว่างไม่พอ จะได้ไม่หายไป */}
        <div className="flex flex-wrap justify-between items-center min-h-[4rem] py-2 gap-y-3">
          
          {/* Logo */}
          <a href="/" className="flex items-center cursor-pointer font-bold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors shrink-0">
            TaiChi112
          </a>

          {/* Center Nav (เอา hidden ทิ้งไปเลย ให้แสดงตลอดเวลา) */}
          <div className="flex flex-wrap flex-1 justify-center gap-1 sm:gap-4 items-center px-2">
            {navItems.map((item) => {
              const isActive = item.id === 'docs'; 
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100'
                  }`}
                >
                  {item.icon}
                  {/* ในมือถือจอเล็กมากๆ จะโชว์แค่ Icon, จอใหญ่โชว์ Text ด้วย */}
                  <span className="hidden sm:inline">{item.name}</span>
                </a>
              );
            })}
          </div>
          
          {/* ระบบ Auth */}
          <div className="flex items-center gap-3 shrink-0 border-l border-gray-200 dark:border-neutral-800 pl-3 sm:pl-4">
            <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
              {isAuthenticated ? userDisplayName : 'Guest'}
            </span>
            <button
              type="button"
              onClick={() => isAuthenticated ? signOut({ callbackUrl: '/' }) : signIn('google')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                isAuthenticated 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAuthenticated ? 'Sign Out' : 'Sign In'}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}