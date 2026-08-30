"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('../../components/system/CommandPalette').then(mod => mod.CommandPalette), { ssr: false });
import { TourControls } from '../../components/system/TourControls';
const ToastContainer = dynamic(() => import('../../components/system/ToastContainer').then(mod => mod.ToastContainer), { ssr: false });
const ParticleBackground = dynamic(() => import('../../components/system/ParticleBackground').then(mod => mod.ParticleBackground), { ssr: false });
const TourHighlight = dynamic(() => import('../../components/system/TourHighlight').then(mod => mod.TourHighlight), { ssr: false });
const FloatingThemeControls = dynamic(() => import('../../components/system/FloatingThemeControls').then(mod => mod.FloatingThemeControls), { ssr: false });

import {
  FONTS,
  LOCALES,
  STYLES,
  type FontKey,
  type LocaleKey,
  type StyleKey,
  getInitialThemePreference,
} from '../../models/theme/ThemeConfig';
import { notify, setNotificationChannel, subscribeToToasts } from '../../services/system/notification/NotificationBridge';
import { SiteHeader } from '../../components/layout/SiteHeader';
import { useContentTabMapper } from './useContentTabMapper';

import { useTourCommandOrchestration } from './useTourCommandOrchestration';
import { getPathFromTab, normalizeTabId } from './tabRouting';
import { useThemeStore } from '../../store/useThemeStore';
import { useSessionStore } from '../../store/useSessionStore';
import type { CompositeNode } from '../../interfaces/content-tree';
import type { Blog, Project } from '../../data/content';

type PersonalWebsiteAppProps = {
  initialTab?: string;
  initialDocParam?: string;
  initialProjectParam?: string;
  initialBlogParam?: string;
  initialArticleParam?: string;
  initialProjectsList: Project[];
  initialBlogsTree: CompositeNode;
  initialArticlesTree: CompositeNode;
  blogsList: Blog[];
};

export function PersonalWebsiteApp({
  initialTab = 'home',
  initialDocParam,
  initialProjectParam,
  initialBlogParam,
  initialArticleParam,
  initialProjectsList,
  initialBlogsTree,
  initialArticlesTree,
  blogsList,
}: Readonly<PersonalWebsiteAppProps>) {
  const router = useRouter();
  const normalizedInitialTab = normalizeTabId(initialTab);

  const [activeTab, setActiveTab] = useState(normalizedInitialTab);

  // Sync state with props during render to avoid cascading renders (React warning)
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(normalizeTabId(initialTab));
  }

  const isDark = useThemeStore((s) => s.isDark);
  const styleKey = useThemeStore((s) => s.styleKey);
  const fontKey = useThemeStore((s) => s.fontKey);
  const langKey = useThemeStore((s) => s.langKey);
  const setStyleKey = useThemeStore((s) => s.setStyleKey);
  const toggleDark = useThemeStore((s) => s.toggleDark);
  
  const isAdmin = useSessionStore((s) => s.isAdmin);
  const toggleRole = useSessionStore((s) => s.toggleRole);
  const { data: session, status } = useSession();

  useEffect(() => {
    setNotificationChannel('Toast');
  }, []);

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
    projectsList: initialProjectsList,
    blogsTree: initialBlogsTree,
    articlesTree: initialArticlesTree,
    blogsList,
    // removed onCloneProject
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
        <SiteHeader
          activeTab={activeTab}
          onNavigate={navigateToTab}
        />
        <main className="pt-8 min-h-screen">{content}</main>
        {/* Floating palette drawer (closed by default) - refined styling */}
        <FloatingThemeControls
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
        <TourControls iterator={tourIterator} isActive={isTourActive} onStop={stopTour} onExecuteStep={handleTourStep} style={currentStyle} labels={labels} />
        <ToastContainer style={currentStyle} subscribe={subscribeToToasts} />

        <CommandPalette key={isCommandOpen ? 'open' : 'closed'} commands={commands} isOpen={isCommandOpen} onClose={closeCommandPalette} style={currentStyle} />
      </div>
    </div>
  );
}
