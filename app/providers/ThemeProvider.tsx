'use client';

import { useEffect, type ReactNode } from 'react';
import { getInitialThemePreference } from '../models/theme/ThemeConfig';
import { AppSystemFacade } from '../services/system/AppSystemFacade';
import { useThemeStore } from '../store/useThemeStore';
import { useSessionStore } from '../store/useSessionStore';

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const setIsDark = useThemeStore((s) => s.setIsDark);
  const setStyleKey = useThemeStore((s) => s.setStyleKey);
  const setFontKey = useThemeStore((s) => s.setFontKey);
  const setLangKey = useThemeStore((s) => s.setLangKey);
  const setIsAdmin = useSessionStore((s) => s.setIsAdmin);
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    void AppSystemFacade.initializeSystem(
      { setDark: setIsDark, setStyle: setStyleKey, setFont: setFontKey, setAdmin: setIsAdmin, setLang: setLangKey },
      () => {}, // suppress duplicate toasts
      getInitialThemePreference,
    );
  }, [setIsDark, setStyleKey, setFontKey, setIsAdmin, setLangKey]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return <>{children}</>;
}

