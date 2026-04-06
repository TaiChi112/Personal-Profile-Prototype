import { EN_LOCALE } from './en';
import { TH_LOCALE } from './th';
import type { ThemeLocaleEntry } from './types';

export const THEME_LABELS = {
  en: EN_LOCALE,
  th: TH_LOCALE,
} as const satisfies Record<string, ThemeLocaleEntry>;

export type ThemeLocaleKey = keyof typeof THEME_LABELS;
