import { THEME_LABELS, type ThemeLocaleKey } from './locales';
import type { LocaleLabels } from './locales/types';

export type ThemeLocaleCode = string;

export type ThemeButtonClasses = {
  primary: string;
  text: string;
  secondary: string;
};

export type ThemeToastClasses = {
  success: string;
  default: string;
};

export type ThemeLocaleData = {
  code: ThemeLocaleCode;
  labels: LocaleLabels;
};

export type ThemeStyleData = {
  name: string;
  mainLayoutClass: string;
  cardClass: string;
  buttonClasses: ThemeButtonClasses;
  navbarClass: string;
  badgeClass: string;
  sectionTitleClass: string;
  containerClass: string;
  modalClass: string;
  toastClasses: ThemeToastClasses;
  lockedOverlayClass: string;
  tourOverlayClass: string;
};

export { THEME_LABELS };

export type { ThemeLocaleKey };

export const THEME_FONT_DATA = {
  sans: { name: 'Sans', fontClass: 'font-sans' },
  serif: { name: 'Serif', fontClass: 'font-serif' },
} as const satisfies Record<string, { name: string; fontClass: string }>;

export type ThemeFontKey = keyof typeof THEME_FONT_DATA;

export const THEME_STYLE_DATA = {
  modern: {
    name: 'Modern',
    mainLayoutClass: 'bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300',
    cardClass: 'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative',
    buttonClasses: {
      primary: 'px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
      text: 'px-3 py-1 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all',
      secondary: 'px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all',
    },
    navbarClass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50',
    badgeClass: 'px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full',
    sectionTitleClass: 'text-3xl font-bold text-gray-900 dark:text-white',
    containerClass: 'rounded-2xl p-4 md:p-6 bg-gray-100/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 backdrop-blur-sm mt-4',
    modalClass: 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden',
    toastClasses: {
      success: 'fixed bottom-4 left-4 z-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 bg-green-600 text-white',
      default: 'fixed bottom-4 left-4 z-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 bg-gray-800 text-white dark:bg-white dark:text-black',
    },
    lockedOverlayClass: 'absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-20',
    tourOverlayClass: 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10',
  },
  minimal: {
    name: 'Minimal',
    mainLayoutClass: 'bg-white dark:bg-black min-h-screen transition-colors duration-300',
    cardClass: 'bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 hover:opacity-80 transition-opacity relative',
    buttonClasses: {
      primary: 'px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      text: 'px-3 py-1 text-black dark:text-white uppercase tracking-wider text-xs font-bold hover:underline transition-all',
      secondary: 'px-6 py-2 bg-transparent text-black dark:text-white border border-black dark:border-white rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors',
    },
    navbarClass: 'bg-white dark:bg-black border-b-2 border-black dark:border-white sticky top-0 z-50',
    badgeClass: 'px-2 py-1 border border-gray-400 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider',
    sectionTitleClass: 'text-2xl font-normal text-black dark:text-white uppercase tracking-[0.2em]',
    containerClass: 'p-0 border-l border-black dark:border-white pl-4 mt-4',
    modalClass: 'bg-white dark:bg-black border-2 border-black dark:border-white shadow-none',
    toastClasses: {
      success: 'fixed bottom-4 left-4 z-100 px-4 py-3 border-2 border-black dark:border-white flex items-center gap-3 bg-white dark:bg-black text-black dark:text-white uppercase tracking-widest text-xs font-bold',
      default: 'fixed bottom-4 left-4 z-100 px-4 py-3 border-2 border-black dark:border-white flex items-center gap-3 bg-white dark:bg-black text-black dark:text-white uppercase tracking-widest text-xs font-bold',
    },
    lockedOverlayClass: 'absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20 border-2 border-black dark:border-white m-2',
    tourOverlayClass: 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-black border-2 border-black dark:border-white px-6 py-3 flex items-center gap-6 shadow-none',
  },
  future: {
    name: 'Future',
    mainLayoutClass: 'bg-slate-900 dark:bg-black min-h-screen transition-colors duration-300',
    cardClass: 'bg-slate-800/50 dark:bg-gray-900/80 backdrop-blur border border-cyan-500/30 dark:border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 rounded-none skew-x-[-2deg] relative',
    buttonClasses: {
      primary: 'px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-wider clip-path-slant hover:brightness-110 transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed',
      text: 'px-3 py-1 text-cyan-400 font-bold uppercase tracking-wider hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all',
      secondary: 'px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500/50 font-bold uppercase tracking-wider hover:bg-cyan-950/30 transition-all',
    },
    navbarClass: 'bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    badgeClass: 'px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase',
    sectionTitleClass: 'text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase italic',
    containerClass: 'p-4 border border-cyan-900/50 bg-slate-900/50 mt-4',
    modalClass: 'bg-slate-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-none',
    toastClasses: {
      success: 'fixed bottom-4 left-4 z-100 px-4 py-3 bg-slate-900 border border-cyan-500 text-cyan-400 flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      default: 'fixed bottom-4 left-4 z-100 px-4 py-3 bg-slate-900 border border-cyan-500 text-cyan-400 flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    },
    lockedOverlayClass: 'absolute inset-0 bg-slate-900/90 border border-cyan-500/50 flex flex-col items-center justify-center text-center p-4 z-20',
    tourOverlayClass: 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500 text-cyan-400 px-6 py-3 flex items-center gap-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]',
  },
  academic: {
    name: 'Academic',
    mainLayoutClass: 'bg-[#fdfbf7] dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300',
    cardClass: 'bg-white dark:bg-[#2a2a2a] p-1 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow relative',
    buttonClasses: {
      primary: 'px-5 py-2 bg-[#8b1e3f] dark:bg-[#d4af37] text-white dark:text-black font-serif italic hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed',
      text: 'px-3 py-1 text-[#8b1e3f] dark:text-[#d4af37] font-serif italic hover:underline transition-all',
      secondary: 'px-5 py-2 bg-transparent text-[#8b1e3f] dark:text-[#d4af37] border border-[#8b1e3f] dark:border-[#d4af37] font-serif italic hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
    },
    navbarClass: 'bg-[#fdfbf7] dark:bg-[#1a1a1a] border-b-4 border-double border-gray-300 dark:border-gray-600 sticky top-0 z-50',
    badgeClass: 'px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-serif italic border border-gray-400',
    sectionTitleClass: 'text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2 inline-block',
    containerClass: 'p-6 border-2 border-double border-gray-300 dark:border-gray-600 mt-4',
    modalClass: 'bg-[#fdfbf7] dark:bg-[#1a1a1a] border-4 border-double border-gray-300 dark:border-gray-600 rounded-sm',
    toastClasses: {
      success: 'fixed bottom-4 left-4 z-100 px-6 py-3 bg-[#fdfbf7] dark:bg-[#1a1a1a] border-2 border-double border-gray-400 text-gray-800 dark:text-gray-200 font-serif italic shadow-md',
      default: 'fixed bottom-4 left-4 z-100 px-6 py-3 bg-[#fdfbf7] dark:bg-[#1a1a1a] border-2 border-double border-gray-400 text-gray-800 dark:text-gray-200 font-serif italic shadow-md',
    },
    lockedOverlayClass: 'absolute inset-0 bg-[#fdfbf7]/90 dark:bg-[#1a1a1a]/90 flex flex-col items-center justify-center text-center p-4 z-20 border-2 border-double border-gray-400',
    tourOverlayClass: 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#fdfbf7] dark:bg-[#1a1a1a] border-2 border-double border-gray-400 px-6 py-3 flex items-center gap-6 shadow-md',
  },
} as const satisfies Record<string, ThemeStyleData>;

export type ThemeStyleKey = keyof typeof THEME_STYLE_DATA;
