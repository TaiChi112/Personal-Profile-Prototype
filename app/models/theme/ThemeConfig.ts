import {
  THEME_FONT_DATA,
  THEME_LABELS,
  THEME_STYLE_DATA,
  type ThemeFontKey,
  type ThemeLocaleKey,
  type ThemeLocaleData,
  type ThemeStyleKey,
  type ThemeStyleData,
} from './ThemeData';

export type UILabels = ThemeLocaleData['labels'];

export interface LocalizationFactory { code: string; getLabels(): UILabels; }
export interface TypographyFactory { name: string; getFontClass(): string; }

export interface StyleFactory {
  name: string;
  getMainLayoutClass(): string;
  getCardClass(): string;
  getButtonClass(variant?: 'primary' | 'secondary' | 'text'): string;
  getNavbarClass(): string;
  getBadgeClass(type?: string): string;
  getSectionTitleClass(): string;
  getContainerClass(type: string): string;
  getModalClass(): string;
  getToastClass(type: string): string;
  getLockedOverlayClass(): string;
  getTourOverlayClass(): string;
}

export type LocaleKey = ThemeLocaleKey;
export type FontKey = ThemeFontKey;
export type StyleKey = ThemeStyleKey;

export type ThemePreference = {
  dark: boolean;
  style: StyleKey;
  font: FontKey;
  lang: LocaleKey;
};

function mapRecord<T extends Record<string, unknown>, R>(
  source: T,
  mapper: <K extends keyof T>(value: T[K], key: K) => R,
): { [K in keyof T]: R } {
  const result = {} as { [K in keyof T]: R };
  for (const key of Object.keys(source) as Array<keyof T>) {
    result[key] = mapper(source[key], key);
  }
  return result;
}

const createLocalizationFactory = (code: string, labels: UILabels): LocalizationFactory => ({
  code,
  getLabels: () => labels,
});

const createTypographyFactory = (name: string, fontClass: string): TypographyFactory => ({
  name,
  getFontClass: () => fontClass,
});

const createStyleFactory = (data: ThemeStyleData): StyleFactory => ({
  name: data.name,
  getMainLayoutClass: () => data.mainLayoutClass,
  getCardClass: () => data.cardClass,
  getButtonClass: (variant) => {
    if (variant === 'primary') return data.buttonClasses.primary;
    if (variant === 'text') return data.buttonClasses.text;
    return data.buttonClasses.secondary;
  },
  getNavbarClass: () => data.navbarClass,
  getBadgeClass: (type) => {
    void type;
    return data.badgeClass;
  },
  getSectionTitleClass: () => data.sectionTitleClass,
  getContainerClass: (type) => {
    void type;
    return data.containerClass;
  },
  getModalClass: () => data.modalClass,
  getToastClass: (type) => (type === 'SUCCESS' ? data.toastClasses.success : data.toastClasses.default),
  getLockedOverlayClass: () => data.lockedOverlayClass,
  getTourOverlayClass: () => data.tourOverlayClass,
});

export const LOCALES: Record<LocaleKey, LocalizationFactory> = mapRecord(
  THEME_LABELS,
  (localeData) => createLocalizationFactory(localeData.code, localeData.labels),
);

export const FONTS: Record<FontKey, TypographyFactory> = mapRecord(
  THEME_FONT_DATA,
  (fontData) => createTypographyFactory(fontData.name, fontData.fontClass),
);

export const STYLES: Record<StyleKey, StyleFactory> = mapRecord(
  THEME_STYLE_DATA,
  (styleData) => createStyleFactory(styleData),
);

export function getInitialThemePreference(): ThemePreference {
  const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { dark: isDark, style: 'modern', font: 'sans', lang: 'en' };
}
