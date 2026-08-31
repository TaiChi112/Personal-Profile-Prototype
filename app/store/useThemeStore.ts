import { create } from 'zustand';
import type { StyleKey, FontKey, LocaleKey } from '../models/theme/ThemeConfig';

export interface ThemeState {
  isDark: boolean;
  styleKey: StyleKey;
  fontKey: FontKey;
  langKey: LocaleKey;
  
  setIsDark: (val: boolean) => void;
  setStyleKey: (val: StyleKey) => void;
  setFontKey: (val: FontKey) => void;
  setLangKey: (val: LocaleKey) => void;
  toggleDark: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  styleKey: 'modern',
  fontKey: 'sans',
  langKey: 'en',
  
  setIsDark: (val) => set({ isDark: val }),
  setStyleKey: (val) => set({ styleKey: val }),
  setFontKey: (val) => set({ fontKey: val }),
  setLangKey: (val) => set({ langKey: val }),
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),
}));
