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
  type StyleFactory,
  type UILabels,
} from "../../models/theme/ThemeConfig";

type SiteHeaderProps = {
  readonly currentStyle?: StyleFactory;
  readonly labels?: UILabels;
  readonly activeTab?: string;
  readonly onNavigate?: (tabId: string) => void;
};

export function SiteHeader({
  currentStyle,
  labels,
  activeTab,
  onNavigate,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const userDisplayName = session?.user?.name ?? session?.user?.email ?? null;

  // Use provided style/labels or fall back to default Modern (EN)
  const resolvedStyle = currentStyle ?? STYLES.modern;
  const resolvedLabels = labels ?? LOCALES.en.getLabels();

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
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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
          </div>
        </div>
      )}
    </nav>
  );
}
