import { useMemo, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createNavItems } from './navConfig';

type NavigationShellProps = {
  readonly currentStyle: StyleFactory;
  readonly labels: UILabels;
  readonly activeTab: string;
  readonly onNavigate: (tabId: string) => void;
  readonly isAuthenticated: boolean;
  readonly userDisplayName: string | null;
  readonly onSignIn: () => void;
  readonly onSignOut: () => void;
};

export function NavigationShell({
  currentStyle,
  labels,
  activeTab,
  onNavigate,
  isAuthenticated,
  userDisplayName,
  onSignIn,
  onSignOut,
}: NavigationShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navItems = useMemo(() => createNavItems(labels), [labels]);

  const getActiveDesktopNavTextClassName = () => (currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400');

  const getInactiveDesktopNavTextClassName = () => 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white';

  const getDesktopNavClassName = (tabId: string) =>
    `flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === tabId ? getActiveDesktopNavTextClassName() : getInactiveDesktopNavTextClassName()}`;

  const getActiveDesktopChildClassName = () => (currentStyle.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400');

  const getInactiveDesktopChildClassName = () => 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';

  const getDesktopChildClassName = (tabId: string) =>
    `w-full text-left flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === tabId ? getActiveDesktopChildClassName() : getInactiveDesktopChildClassName()}`;

  const getActiveMobileNavClassName = () => 'bg-gray-50 dark:bg-gray-800/50 text-blue-600 dark:text-blue-400 font-medium';

  const getMobileNavClassName = (tabId: string) =>
    `flex items-center gap-2 w-full text-left px-3 py-3 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 last:border-0 ${activeTab === tabId ? getActiveMobileNavClassName() : ''}`;

  const navigateAndClose = (tabId: string) => {
    // ดักจับตรงนี้! ถ้ากดไป docs ให้บังคับโหลดหน้าเว็บใหม่ไปเลย
    if (tabId === 'docs') {
      globalThis.location.href = '/docs';
      return;
    }
    onNavigate(tabId);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className={currentStyle.getNavbarClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <button
            type="button"
            className="flex items-center cursor-pointer"
            onClick={() => navigateAndClose('home')}
            data-tour-highlight="nav-home"
          >
            <span className={`text-xl font-bold ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>TaiChi112</span>
          </button>

          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.id}
                  className="relative"
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${activeDropdown === item.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
                    data-tour-highlight={`nav-${item.id}`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {activeDropdown === item.id && (
                    <div className="absolute left-0 top-full pt-2 w-48 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className={`${currentStyle.name === 'Future' ? 'bg-slate-900 border border-cyan-500/50' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'} rounded-lg shadow-xl overflow-hidden p-1`}>
                        {item.children.map((child) => (
                          <button
                            type="button"
                            key={child.id}
                            onClick={() => navigateAndClose(child.id)}
                            className={getDesktopChildClassName(child.id)}
                            data-tour-highlight={`nav-${child.id}`}
                          >
                            {child.icon}
                            <span>{child.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigateAndClose(item.id)}
                  className={getDesktopNavClassName(item.id)}
                  data-tour-highlight={`nav-${item.id}`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              )
            ))}

            <div className="ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-36 truncate" title={userDisplayName ?? 'No session'}>
                {isAuthenticated ? userDisplayName ?? 'Google User' : 'Guest'}
              </span>
              <button
                type="button"
                onClick={isAuthenticated ? onSignOut : onSignIn}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isAuthenticated ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-36 truncate" title={userDisplayName ?? 'No session'}>
                {isAuthenticated ? userDisplayName ?? 'Google User' : 'Guest'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    onSignOut();
                  } else {
                    onSignIn();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isAuthenticated ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
            {navItems.map((item) => (
              item.children ? (
                <div key={item.id} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                    {item.icon} {item.name}
                  </div>
                  {item.children.map((child) => (
                    <button
                      type="button"
                      key={child.id}
                      onClick={() => navigateAndClose(child.id)}
                      className={`block w-full text-left px-3 py-2 pl-8 text-sm transition-colors ${activeTab === child.id ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                      data-tour-highlight={`nav-${child.id}`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigateAndClose(item.id)}
                  className={getMobileNavClassName(item.id)}
                  data-tour-highlight={`nav-${item.id}`}
                >
                  {item.icon} {item.name}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
