import { auth } from "@/auth";
import Link from "next/link";

export default async function ProjectsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 🌐 Global Profile OS Layout */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b shadow-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/projects" className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition-opacity">
            ✦ AI-Native OS
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {session.user.name}
              </span>
              {session.user.image ? (
                <img src={session.user.image} alt="Profile" className="w-7 h-7 rounded-full border border-green-500 shadow-sm" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
              <Link href="/api/auth/signout" className="text-xs text-red-500 hover:text-red-700 font-semibold ml-2">
                Sign Out
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Guest Mode Indicator */}
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold">Guest Mode</span>
              </div>
              <Link href="/api/auth/signin" className="text-sm px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
                Login to Save Data
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 🚀 Micro-Project Content */}
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
