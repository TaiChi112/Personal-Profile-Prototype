"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { CommandPalette } from '../../components/system/CommandPalette';
import { TourControls } from '../../components/system/TourControls';
import { ToastContainer } from '../../components/system/ToastContainer';
import { ParticleBackground } from '../../components/system/ParticleBackground';
import { ThemeControls } from '../../components/system/ThemeControls';
import { TourHighlight } from '../../components/system/TourHighlight';
import {
  FONTS,
  LOCALES,
  STYLES,
  type FontKey,
  type LocaleKey,
  type StyleKey,
  getInitialThemePreference,
} from '../../models/theme/ThemeConfig';
import { AppSystemFacade } from '../../services/system/AppSystemFacade';
import { notify, setNotificationChannel, subscribeToToasts } from '../../services/system/notification/NotificationBridge';
import { NavigationShell } from './NavigationShell';
import { useContentTabMapper } from './useContentTabMapper';
import { useProjectTreeState } from './useProjectTreeState';
import { useTourCommandOrchestration } from './useTourCommandOrchestration';
import { getPathFromTab, normalizeTabId } from './tabRouting';

type PersonalWebsiteAppProps = {
  initialTab?: string;
  initialDocParam?: string;
  initialProjectParam?: string;
  initialBlogParam?: string;
  initialArticleParam?: string;
};

export function PersonalWebsiteApp({
  initialTab = 'home',
  initialDocParam,
  initialProjectParam,
  initialBlogParam,
  initialArticleParam,
}: Readonly<PersonalWebsiteAppProps>) {
  const router = useRouter();
  const normalizedInitialTab = normalizeTabId(initialTab);

  const [activeTab, setActiveTab] = useState(normalizedInitialTab);
  const [styleKey, setStyleKey] = useState<StyleKey>('modern');
  const [langKey, setLangKey] = useState<LocaleKey>('en');
  const [fontKey, setFontKey] = useState<FontKey>('sans');
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setNotificationChannel('Toast');
    void AppSystemFacade.initializeSystem(
      { setDark: setIsDark, setStyle: setStyleKey, setFont: setFontKey, setAdmin: setIsAdmin, setLang: setLangKey },
      (message, level) => notify.notify(message, level),
      getInitialThemePreference,
    );
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const resolvedTab = normalizeTabId(initialTab);
    setActiveTab(resolvedTab);
  }, [initialTab]);

  const setActiveTabWithoutNavigation = (tabId: string) => {
    setActiveTab(normalizeTabId(tabId));
  };

  const navigateToTab = (tabId: string) => {
    const resolvedTab = normalizeTabId(tabId);
    setActiveTabWithoutNavigation(resolvedTab);
    router.push(getPathFromTab(resolvedTab));
  };

  const currentStyle = STYLES[styleKey];
  const currentLang = LOCALES[langKey];
  const currentFont = FONTS[fontKey];
  const labels = currentLang.getLabels();
  const isAuthenticated = status === 'authenticated';
  const userDisplayName = session?.user?.name ?? session?.user?.email ?? null;
  const toggleDark = () => setIsDark((prev) => !prev);
  const toggleRole = () => setIsAdmin((prev) => !prev);
  const { projectTree, addProjectFromTemplate } = useProjectTreeState({ onNotify: notify.notify });

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isPaletteOpen) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const isClickedInside = paletteRef.current?.contains(target) || buttonRef.current?.contains(target);
      
      if (!isClickedInside) {
        setIsPaletteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPaletteOpen]);

  const {
    activeNodeId,
    commands,
    handleTourStep,
    handleUndo,
    isCommandOpen,
    isTourActive,
    openCommandPalette,
    closeCommandPalette,
    startTour,
    stopTour,
    tourIterator,
  } = useTourCommandOrchestration({
    activeTab,
    styleKey,
    setTourTab: setActiveTabWithoutNavigation,
    setActiveTab: navigateToTab,
    setStyleKey,
    toggleDark,
    toggleRole,
    notify: (message, level) => notify.notify(message, level),
  });

  const content = useContentTabMapper({
    activeTab,
    selectedDocParam: initialDocParam,
    selectedProjectParam: initialProjectParam,
    selectedBlogParam: initialBlogParam,
    selectedArticleParam: initialArticleParam,
    currentStyle,
    labels,
    projectTree,
    onCloneProject: addProjectFromTemplate,
    isAdmin,
    activeNodeId,
    onNotify: notify.notify,
  });

  const currentTourStep = isTourActive ? tourIterator.current() : null;

  return (
    <div className={`${currentStyle.getMainLayoutClass()} ${currentFont.getFontClass()} relative min-h-screen overflow-x-hidden`}>
      <ParticleBackground isDark={isDark} styleName={currentStyle.name} />
      <div className="relative z-10 bg-transparent">
        <TourHighlight isActive={isTourActive} step={currentTourStep} />
        <NavigationShell
          currentStyle={currentStyle}
          labels={labels}
          activeTab={activeTab}
          onNavigate={navigateToTab}
          isAuthenticated={isAuthenticated}
          userDisplayName={userDisplayName}
          onSignIn={() => signIn('google')}
          onSignOut={() => signOut({ callbackUrl: '/' })}
        />
        <main className="pt-8 min-h-screen">{content}</main>
        {/* Floating palette drawer (closed by default) - refined styling */}
        <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse items-end gap-2">
          <button
            ref={buttonRef}
            aria-expanded={isPaletteOpen}
            aria-label={isPaletteOpen ? 'Close controls' : 'Open controls'}
            onClick={(e) => {
              e.stopPropagation();
              setIsPaletteOpen((p) => !p);
            }}
            className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 transform transition-all duration-300 hover:scale-105 bg-linear-to-br from-white to-gray-100 dark:from-gray-800 dark:to-black z-50"
            title={isPaletteOpen ? 'Close' : 'Open'}
          >
            {/* subtle pulse when closed */}
            {!isPaletteOpen && <span className="absolute inset-0 rounded-full bg-blue-400/10 animate-pulse" aria-hidden />}

            <svg className={`w-7 h-7 text-gray-700 dark:text-gray-200 transform transition-transform duration-300 ${isPaletteOpen ? 'rotate-45' : 'rotate-0'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            ref={paletteRef}
            className={`origin-bottom-right transform transition-all duration-300 z-40 ${isPaletteOpen ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'}`}>
            {/* Wrapper to close drawer on any control click */}
            {/* <div className="mb-1 bg-white/95 dark:bg-gray-900/95 rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-md min-w-[240px] max-w-sm" onClick={() => setIsPaletteOpen(false)}> */}
              <ThemeControls
                isDark={isDark}
                toggleDark={toggleDark}
                openCommandPalette={openCommandPalette}
                undoLastAction={handleUndo}
                isAdmin={isAdmin}
                toggleRole={toggleRole}
                startTour={startTour}
                isAuthenticated={isAuthenticated}
                userDisplayName={userDisplayName}
                onSignIn={() => signIn('google')}
                onSignOut={() => signOut({ callbackUrl: '/' })}
              />
            {/* </div> */}
          </div>
        </div>
        <TourControls iterator={tourIterator} isActive={isTourActive} onStop={stopTour} onExecuteStep={handleTourStep} style={currentStyle} labels={labels} />
        <ToastContainer style={currentStyle} subscribe={subscribeToToasts} />

        <CommandPalette key={isCommandOpen ? 'open' : 'closed'} commands={commands} isOpen={isCommandOpen} onClose={closeCommandPalette} style={currentStyle} />
      </div>
    </div>
  );
}
