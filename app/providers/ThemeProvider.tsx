'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  type StyleKey, 
  type FontKey, 
  type LocaleKey, 
  getInitialThemePreference 
} from '../models/theme/ThemeConfig';
import { AppSystemFacade } from '../services/system/AppSystemFacade';

export type ThemeContextType = {
  isDark: boolean;
  styleKey: StyleKey;
  fontKey: FontKey;
  langKey: LocaleKey;
  isAdmin: boolean;
  setIsDark: (val: boolean) => void;
  setStyleKey: (val: StyleKey) => void;
  setFontKey: (val: FontKey) => void;
  setLangKey: (val: LocaleKey) => void;
  setIsAdmin: (val: boolean) => void;
  toggleDark: () => void;
  toggleRole: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [styleKey, setStyleKey] = useState<StyleKey>('modern');
  const [langKey, setLangKey] = useState<LocaleKey>('en');
  const [fontKey, setFontKey] = useState<FontKey>('sans');
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void AppSystemFacade.initializeSystem(
      { setDark: setIsDark, setStyle: setStyleKey, setFont: setFontKey, setAdmin: setIsAdmin, setLang: setLangKey },
      () => {}, // suppress duplicate toasts from facade since it might run on every page mount otherwise
      getInitialThemePreference,
    );
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (!isReady) return null; // Avoid hydration mismatch for theme-dependent UI

  return (
    <ThemeContext.Provider value={{
      isDark, styleKey, fontKey, langKey, isAdmin,
      setIsDark, setStyleKey, setFontKey, setLangKey, setIsAdmin,
      toggleDark: () => setIsDark(p => !p),
      toggleRole: () => setIsAdmin(p => !p)
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
