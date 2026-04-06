import { useMemo, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import type { StyleFactory, UILabels } from '../../models/theme/ThemeConfig';
import { createNavItems } from './navConfig';

type NavigationShellProps = {
  currentStyle: StyleFactory;
  labels: UILabels;
  activeTab: string;
  onNavigate: (tabId: string) => void;
  isAuthenticated: boolean;
  userDisplayName: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
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

  const navigateAndClose = (tabId: string) => {
    onNavigate(tabId);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav className={currentStyle.getNavbarClass()}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigateAndClose('home')}>
            <span className={`text-xl font-bold ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>TaiChi</span>
          </div>

          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${activeDropdown === item.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
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
                            key={child.id}
                            onClick={() => navigateAndClose(child.id)}
                            className={`w-full text-left flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${activeTab === child.id ? (currentStyle.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400') : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
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
                  key={item.id}
                  onClick={() => navigateAndClose(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === item.id ? (currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400') : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
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
                onClick={isAuthenticated ? onSignOut : onSignIn}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isAuthenticated ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300">
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
                      key={child.id}
                      onClick={() => navigateAndClose(child.id)}
                      className={`block w-full text-left px-3 py-2 pl-8 text-sm transition-colors ${activeTab === child.id ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => navigateAndClose(item.id)}
                  className={`flex items-center gap-2 w-full text-left px-3 py-3 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 last:border-0 ${activeTab === item.id ? 'bg-gray-50 dark:bg-gray-800/50 text-blue-600 dark:text-blue-400 font-medium' : ''}`}
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
