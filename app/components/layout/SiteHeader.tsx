"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import {
  createNavItems,
  isNavItemActive,
} from "../../features/composition/navConfig";
import {
  STYLES,
  LOCALES,
} from "../../models/theme/ThemeConfig";
import { useTheme } from "../../providers/ThemeProvider";

type SiteHeaderProps = {
  readonly activeTab?: string;
  readonly onNavigate?: (tabId: string) => void;
};

export function SiteHeader({
  activeTab,
  onNavigate,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { styleKey, langKey } = useTheme();

  const isAuthenticated = status === "authenticated";
  const userDisplayName = session?.user?.name ?? session?.user?.email ?? null;

  const resolvedStyle = STYLES[styleKey];
  const resolvedLabels = LOCALES[langKey].getLabels();

  const navItems = useMemo(
    () => createNavItems(resolvedLabels),
    [resolvedLabels],
  );

  const getActiveDesktopNavTextClassName = () =>
    resolvedStyle.name === "Future"
      ? "text-cyan-400"
      : "text-blue-600 dark:text-blue-400";

  const getInactiveDesktopNavTextClassName = () =>
    "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white";

  const getDesktopNavClassName = (item: (typeof navItems)[0]) => {
    const isActive = isNavItemActive(item, pathname, activeTab);
    const textClass = isActive
      ? getActiveDesktopNavTextClassName()
      : getInactiveDesktopNavTextClassName();
    return `flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${textClass}`;
  };

  const getActiveMobileNavClassName = () =>
    "bg-gray-50 dark:bg-gray-800/50 text-blue-600 dark:text-blue-400 font-medium";

  const getMobileNavClassName = (item: (typeof navItems)[0]) => {
    const isActive = isNavItemActive(item, pathname, activeTab);
    const activeClass = isActive ? getActiveMobileNavClassName() : "";
    return `flex items-center gap-2 w-full text-left px-3 py-3 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 last:border-0 ${activeClass}`;
  };

  const handleNavClick = (e: React.MouseEvent, item: (typeof navItems)[0]) => {
    if (onNavigate && item.id !== "docs") {
      e.preventDefault();
      onNavigate(item.id);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={resolvedStyle.getNavbarClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link
            href="/"
            onClick={(e) =>
              handleNavClick(e, {
                id: "home",
                name: resolvedLabels.nav.home,
                icon: null,
                href: "/",
              })
            }
            className="flex items-center cursor-pointer font-bold text-lg text-gray-900 dark:text-white shrink-0 hover:text-blue-500 transition-colors"
          >
            <span
              className={resolvedStyle.name === "Future" ? "text-cyan-400" : ""}
            >
              TaiChi112
            </span>
          </Link>

          {/* ---------------- DESKTOP MENU ---------------- */}
          <div className="flex max-md:hidden space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={getDesktopNavClassName(item)}
                data-tour-highlight={`nav-${item.id}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {/* ---------------- DESKTOP AUTH ---------------- */}
            <div className="ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 flex items-center gap-3">
              {pathname.match(/^\/(en|th)\/docs/) && (
                <div className="relative flex items-center mr-2">
                  <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <span className="text-sm font-medium">{pathname.startsWith('/th') ? 'TH' : 'EN'}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {isLangMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsLangMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-fd-popover border border-fd-border rounded-lg shadow-lg py-1 min-w-[120px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link 
                          href={pathname.replace(/^\/(en|th)\/docs/, '/en/docs')}
                          onClick={() => setIsLangMenuOpen(false)}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors ${pathname.startsWith('/en') ? 'text-fd-primary font-bold' : 'text-fd-foreground'}`}
                        >
                          English
                        </Link>
                        <Link 
                          href={pathname.replace(/^\/(en|th)\/docs/, '/th/docs')}
                          onClick={() => setIsLangMenuOpen(false)}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors ${pathname.startsWith('/th') ? 'text-fd-primary font-bold' : 'text-fd-foreground'}`}
                        >
                          ภาษาไทย
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
              <span
                className="text-xs text-gray-500 dark:text-gray-400 max-w-36 truncate"
                title={userDisplayName ?? "No session"}
              >
                {isAuthenticated ? (userDisplayName ?? "Google User") : "Guest"}
              </span>
              <button
                type="button"
                onClick={() =>
                  isAuthenticated
                    ? signOut({ callbackUrl: "/" })
                    : signIn("google")
                }
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  isAuthenticated
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>

          {/* ---------------- MOBILE HAMBURGER BUTTON ---------------- */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE DROPDOWN MENU ---------------- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background border-b border-gray-200 dark:border-gray-800 shadow-xl z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <span
                className="text-xs text-gray-500 dark:text-gray-400 max-w-36 truncate"
                title={userDisplayName ?? "No session"}
              >
                {isAuthenticated ? (userDisplayName ?? "Google User") : "Guest"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (isAuthenticated) {
                    signOut({ callbackUrl: "/" });
                  } else {
                    signIn("google");
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  isAuthenticated
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAuthenticated ? "Sign Out" : "Sign In"}
              </button>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={getMobileNavClassName(item)}
                data-tour-highlight={`nav-${item.id}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* ---------------- MOBILE LANGUAGE SWITCHER ---------------- */}
            {pathname.match(/^\/(en|th)\/docs/) && (
              <div className="flex items-center justify-between w-full px-3 py-3 text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800 mt-2">
                <span className="text-sm font-medium">Language</span>
                <div className="flex gap-2">
                  <Link 
                    href={pathname.replace(/^\/(en|th)\/docs/, '/en/docs')}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${pathname.startsWith('/en') ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    EN
                  </Link>
                  <Link 
                    href={pathname.replace(/^\/(en|th)\/docs/, '/th/docs')}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${pathname.startsWith('/th') ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    TH
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
