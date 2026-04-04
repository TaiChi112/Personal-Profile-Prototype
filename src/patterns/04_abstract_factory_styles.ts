/**
 * ABSTRACT FACTORY PATTERN - Theming System
 * 
 * Purpose: Create entire families of related style objects (colors, spacing, typography)
 *          without exposing concrete classes
 * 
 * Key Classes:
 * - StyleFactory (Abstract Factory Interface)
 * - ModernStyle, MinimalStyle, FutureStyle, AcademicStyle (Concrete Factories)
 * 
 * Pattern Benefits:
 * - Add new theme by creating one factory class with all related styles
 * - Switch entire theme at once without individual method calls
 * - Ensures consistency across a theme (colors, borders, shadows work together)
 */

// ====================================
// ABSTRACT FACTORY INTERFACE
// ====================================
/**
 * Abstract Factory Interface
 * Defines all methods for creating style objects
 * Each concrete factory implements this interface for a specific theme
 */
interface StyleFactory {
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

// ====================================
// CONCRETE FACTORY 1: Modern Style
// ====================================
/**
 * Modern Theme Factory
 * Creates a contemporary, clean design with:
 * - Soft colors and shadows
 * - Rounded corners
 * - Hover animations
 */
const ModernStyle: StyleFactory = {
  name: 'Modern',

  getMainLayoutClass: () =>
    "bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300",

  getCardClass: () =>
    "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 " +
    "hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative",

  getButtonClass: (variant = 'secondary') => {
    switch (variant) {
      case 'primary':
        return "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium " +
               "hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all " +
               "disabled:opacity-50 disabled:cursor-not-allowed";
      case 'text':
        return "px-3 py-1 text-blue-600 dark:text-blue-400 font-medium " +
               "hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all";
      default:
        return "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 " +
               "border border-gray-300 dark:border-gray-600 rounded-lg font-medium " +
               "hover:bg-gray-50 dark:hover:bg-gray-700 transition-all";
    }
  },

  getNavbarClass: () =>
    "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 " +
    "dark:border-gray-800 sticky top-0 z-50",

  getBadgeClass: () =>
    "px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 " +
    "text-xs font-medium rounded-full",

  getSectionTitleClass: () =>
    "text-3xl font-bold text-gray-900 dark:text-white",

  getContainerClass: (type) =>
    "rounded-2xl p-4 md:p-6 bg-gray-100/50 dark:bg-gray-800/30 " +
    "border border-gray-200 dark:border-gray-700 backdrop-blur-sm mt-4",

  getModalClass: () =>
    "bg-white dark:bg-gray-800 rounded-xl shadow-2xl " +
    "border border-gray-200 dark:border-gray-700 overflow-hidden",

  getToastClass: (type) => {
    const baseClass = "fixed bottom-4 left-4 z-[100] px-4 py-3 rounded-lg shadow-lg " +
                     "flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300";
    return type === 'SUCCESS'
      ? `${baseClass} bg-green-600 text-white`
      : `${baseClass} bg-gray-800 text-white dark:bg-white dark:text-black`;
  },

  getLockedOverlayClass: () =>
    "absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm " +
    "flex flex-col items-center justify-center text-center p-4 z-20",

  getTourOverlayClass: () =>
    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 " +
    "border border-gray-200 dark:border-gray-700 shadow-2xl rounded-full px-6 py-3 " +
    "flex items-center gap-6 animate-in slide-in-from-bottom-10"
};

// ====================================
// CONCRETE FACTORY 2: Minimal Style
// ====================================
/**
 * Minimal Theme Factory
 * Creates a stripped-down, elegant design with:
 * - No colors, only black and white
 * - Sharp edges (no rounded corners)
 * - Maximum simplicity
 */
const MinimalStyle: StyleFactory = {
  name: 'Minimal',

  getMainLayoutClass: () =>
    "bg-white dark:bg-black min-h-screen transition-colors duration-300",

  getCardClass: () =>
    "bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 " +
    "hover:opacity-80 transition-opacity relative",

  getButtonClass: (variant = 'secondary') => {
    switch (variant) {
      case 'primary':
        return "px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-none " +
               "uppercase tracking-widest text-xs font-bold hover:bg-gray-800 " +
               "dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
      case 'text':
        return "px-3 py-1 text-black dark:text-white uppercase tracking-wider text-xs " +
               "font-bold hover:underline transition-all";
      default:
        return "px-6 py-2 bg-transparent text-black dark:text-white border border-black " +
               "dark:border-white rounded-none uppercase tracking-widest text-xs font-bold " +
               "hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors";
    }
  },

  getNavbarClass: () =>
    "bg-white dark:bg-black border-b-2 border-black dark:border-white sticky top-0 z-50",

  getBadgeClass: () =>
    "px-2 py-1 border border-gray-400 text-gray-600 dark:text-gray-400 " +
    "text-[10px] uppercase tracking-wider",

  getSectionTitleClass: () =>
    "text-2xl font-normal text-black dark:text-white uppercase tracking-[0.2em]",

  getContainerClass: (type) =>
    "p-0 border-l border-black dark:border-white pl-4 mt-4",

  getModalClass: () =>
    "bg-white dark:bg-black border-2 border-black dark:border-white shadow-none",

  getToastClass: (type) =>
    "fixed bottom-4 left-4 z-[100] px-4 py-3 border-2 border-black dark:border-white " +
    "flex items-center gap-3 bg-white dark:bg-black text-black dark:text-white " +
    "uppercase tracking-widest text-xs font-bold",

  getLockedOverlayClass: () =>
    "absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center " +
    "justify-center text-center p-4 z-20 border-2 border-black dark:border-white m-2",

  getTourOverlayClass: () =>
    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-black " +
    "border-2 border-black dark:border-white px-6 py-3 flex items-center gap-6 shadow-none"
};

// ====================================
// CONCRETE FACTORY 3: Future Style
// ====================================
/**
 * Future Theme Factory
 * Creates a cyberpunk/sci-fi design with:
 * - Neon colors (cyan, purple)
 * - Skewed angles
 * - Glow effects
 */
const FutureStyle: StyleFactory = {
  name: 'Future',

  getMainLayoutClass: () =>
    "bg-slate-900 dark:bg-black min-h-screen transition-colors duration-300",

  getCardClass: () =>
    "bg-slate-800/50 dark:bg-gray-900/80 backdrop-blur border border-cyan-500/30 " +
    "dark:border-cyan-500/50 hover:border-cyan-400 " +
    "hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 " +
    "rounded-none skew-x-[-2deg] relative",

  getButtonClass: (variant = 'secondary') => {
    switch (variant) {
      case 'primary':
        return "px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold " +
               "uppercase tracking-wider clip-path-slant hover:brightness-110 transition-all " +
               "shadow-[0_0_10px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed";
      case 'text':
        return "px-3 py-1 text-cyan-400 font-bold uppercase tracking-wider " +
               "hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all";
      default:
        return "px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500/50 " +
               "font-bold uppercase tracking-wider hover:bg-cyan-950/30 transition-all";
    }
  },

  getNavbarClass: () =>
    "bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 " +
    "shadow-[0_0_20px_rgba(6,182,212,0.15)]",

  getBadgeClass: () =>
    "px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 " +
    "text-xs font-bold uppercase",

  getSectionTitleClass: () =>
    "text-4xl font-black text-transparent bg-clip-text " +
    "bg-gradient-to-r from-cyan-400 to-purple-500 uppercase italic",

  getContainerClass: (type) =>
    "p-4 border border-cyan-900/50 bg-slate-900/50 mt-4",

  getModalClass: () =>
    "bg-slate-900 border border-cyan-500/50 " +
    "shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-none",

  getToastClass: (type) =>
    "fixed bottom-4 left-4 z-[100] px-4 py-3 bg-slate-900 border border-cyan-500 " +
    "text-cyan-400 flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]",

  getLockedOverlayClass: () =>
    "absolute inset-0 bg-slate-900/90 border border-cyan-500/50 " +
    "flex flex-col items-center justify-center text-center p-4 z-20",

  getTourOverlayClass: () =>
    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500 " +
    "text-cyan-400 px-6 py-3 flex items-center gap-6 " +
    "shadow-[0_0_20px_rgba(6,182,212,0.5)]"
};

// ====================================
// CONCRETE FACTORY 4: Academic Style
// ====================================
/**
 * Academic Theme Factory
 * Creates a classic, scholarly design with:
 * - Serif fonts
 * - Muted colors (burgundy, gold)
 * - Ornamental borders
 */
const AcademicStyle: StyleFactory = {
  name: 'Academic',

  getMainLayoutClass: () =>
    "bg-[#fdfbf7] dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300",

  getCardClass: () =>
    "bg-white dark:bg-[#2a2a2a] p-1 border border-gray-300 dark:border-gray-600 " +
    "shadow-sm hover:shadow-md transition-shadow relative",

  getButtonClass: (variant = 'secondary') => {
    switch (variant) {
      case 'primary':
        return "px-5 py-2 bg-[#8b1e3f] dark:bg-[#d4af37] text-white dark:text-black " +
               "font-serif italic hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";
      case 'text':
        return "px-3 py-1 text-[#8b1e3f] dark:text-[#d4af37] font-serif italic " +
               "hover:underline transition-all";
      default:
        return "px-5 py-2 bg-transparent text-[#8b1e3f] dark:text-[#d4af37] " +
               "border border-[#8b1e3f] dark:border-[#d4af37] font-serif italic " +
               "hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
    }
  },

  getNavbarClass: () =>
    "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-b-4 border-double border-gray-300 " +
    "dark:border-gray-600 sticky top-0 z-50",

  getBadgeClass: () =>
    "px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 " +
    "text-xs font-serif italic border border-gray-400",

  getSectionTitleClass: () =>
    "text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 " +
    "border-gray-300 dark:border-gray-600 pb-2 inline-block",

  getContainerClass: (type) =>
    "p-6 border-2 border-double border-gray-300 dark:border-gray-600 mt-4",

  getModalClass: () =>
    "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-4 border-double " +
    "border-gray-300 dark:border-gray-600 rounded-sm",

  getToastClass: (type) =>
    "fixed bottom-4 left-4 z-[100] px-6 py-3 bg-[#fdfbf7] dark:bg-[#1a1a1a] " +
    "border-2 border-double border-gray-400 text-gray-800 dark:text-gray-200 " +
    "font-serif italic shadow-md",

  getLockedOverlayClass: () =>
    "absolute inset-0 bg-[#fdfbf7]/90 dark:bg-[#1a1a1a]/90 flex flex-col items-center " +
    "justify-center text-center p-4 z-20 border-2 border-double border-gray-400",

  getTourOverlayClass: () =>
    "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#fdfbf7] dark:bg-[#1a1a1a] " +
    "border-2 border-double border-gray-400 px-6 py-3 flex items-center gap-6 shadow-md"
};

// ====================================
// STYLE REGISTRY
// ====================================
/**
 * All available style factories
 * Easy to add new themes by adding a new factory here
 */
const STYLES: Record<string, StyleFactory> = {
  'modern': ModernStyle,
  'minimal': MinimalStyle,
  'future': FutureStyle,
  'academic': AcademicStyle
};

// ====================================
// CLIENT CODE EXAMPLE
// ====================================

/**
 * DEMO: Abstract Factory pattern for theming
 */
export function demoStyleFactories() {
  console.log('=== ABSTRACT FACTORY PATTERN: Theming ===\n');

  // Get a specific theme factory
  const modernFactory = STYLES['modern'];
  const futureFactory = STYLES['future'];

  console.log('--- Modern Theme ---');
  console.log(`Main Layout: ${modernFactory.getMainLayoutClass().substring(0, 50)}...`);
  console.log(`Card: ${modernFactory.getCardClass().substring(0, 50)}...`);
  console.log(`Button (primary): ${modernFactory.getButtonClass('primary').substring(0, 50)}...`);

  console.log('\n--- Future Theme ---');
  console.log(`Main Layout: ${futureFactory.getMainLayoutClass().substring(0, 50)}...`);
  console.log(`Card: ${futureFactory.getCardClass().substring(0, 50)}...`);
  console.log(`Button (primary): ${futureFactory.getButtonClass('primary').substring(0, 50)}...`);

  // Switch theme at runtime
  console.log('\n--- Dynamic Theme Switching ---');
  const themeName = 'academic';
  const factory = STYLES[themeName];

  console.log(`Current Theme: ${factory.name}`);
  console.log(`Section Title: ${factory.getSectionTitleClass().substring(0, 50)}...`);
  console.log(`Badge: ${factory.getBadgeClass().substring(0, 50)}...`);
  console.log(`Modal: ${factory.getModalClass().substring(0, 50)}...`);

  console.log('\n--- All Available Themes ---');
  Object.keys(STYLES).forEach(key => {
    const factory = STYLES[key];
    console.log(`✓ ${factory.name} Theme`);
  });

  console.log('\n✓ Abstract Factory: Entire theme families created together\n');
}

// ====================================
// EXPORTS
// ====================================
export {
  type StyleFactory,
  ModernStyle,
  MinimalStyle,
  FutureStyle,
  AcademicStyle,
  STYLES
};
