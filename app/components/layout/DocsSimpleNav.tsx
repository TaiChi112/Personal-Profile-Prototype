"use client";

import { useState } from "react";
import {
  User,
  Code,
  FileText,
  BookOpen,
  Briefcase,
  Menu,
  X,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

export function DocsSimpleNav() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userDisplayName = session?.user?.name ?? session?.user?.email ?? null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", name: "Home", icon: <User size={16} />, href: "/" },
    {
      id: "projects",
      name: "Projects",
      icon: <Code size={16} />,
      href: "/projects",
    },
    { id: "docs", name: "Docs", icon: <FileText size={16} />, href: "/docs" },
    {
      id: "articles",
      name: "Articles",
      icon: <BookOpen size={16} />,
      href: "/articles",
    },
    { id: "blog", name: "Blog", icon: <FileText size={16} />, href: "/blogs" },
    {
      id: "resume",
      name: "Resume",
      icon: <Briefcase size={16} />,
      href: "/resume",
    },
  ];

  return (
    <nav className="w-full border-b border-gray-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center cursor-pointer font-bold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-500 transition-colors shrink-0"
          >
            TaiChi112
          </a>

          {/* ---------------- DESKTOP MENU ---------------- */}
          {/* เปลี่ยนมาใช้ flex เป็นหลัก แล้วซ่อนเฉพาะตอนจอเล็กด้วย max-md:hidden */}
          <div className="flex max-md:hidden flex-1 justify-center gap-1 lg:gap-4 items-center px-2">
            {navItems.map((item) => {
              const isActive = item.id === "docs";
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 lg:px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* ---------------- DESKTOP AUTH ---------------- */}
          {/* เปลี่ยนมาใช้ flex เป็นหลัก แล้วซ่อนเฉพาะตอนจอเล็กด้วย max-md:hidden */}
          <div className="flex max-md:hidden items-center gap-3 shrink-0 border-l border-gray-200 dark:border-neutral-800 pl-4">
            <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
              {isAuthenticated ? userDisplayName : "Guest"}
            </span>
            <button
              type="button"
              onClick={() => isAuthenticated ? signOut({ callbackUrl: "/" }) : signIn("google")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                isAuthenticated ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isAuthenticated ? "Sign Out" : "Sign In"}
            </button>
          </div>

          {/* ---------------- MOBILE HAMBURGER BUTTON ---------------- */}
          {/* โชว์เป็นค่าเริ่มต้น (มือถือ) และซ่อน (hidden) เมื่อจอใหญ่ระดับ md */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE DROPDOWN MENU ---------------- */}
      {/* ซ่อนอัตโนมัติเมื่อขยายจอใหญ่กว่า md */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#0a0a0a] shadow-lg animate-in slide-in-from-top-2 fade-in duration-200 z-50">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.id === "docs";
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </a>
              );
            })}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between px-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                {isAuthenticated ? userDisplayName : "Guest"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  isAuthenticated
                    ? signOut({ callbackUrl: "/" })
                    : signIn("google");
                }}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                  isAuthenticated
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
