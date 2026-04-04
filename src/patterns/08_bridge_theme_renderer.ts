/**
 * BRIDGE PATTERN - Theme & Style Separation
 * 
 * Problem: Themes (Modern, Minimal, Future, Academic) and Style targets (Web, Mobile, Print)
 *          are tightly coupled - difficult to extend
 * 
 * Solution: Separate theme abstraction from style implementation
 *          Bridge allows independent variation of both
 * 
 * Real-world usage from page.tsx:
 *   - ModernStyle.getButtonClass() works for web, mobile, print differently
 *   - FutureStyle needs same independence
 *   - Add new styles or themes without modifying each other
 */

// ====================================
// ABSTRACTION - Theme
// ====================================

export interface ThemeAPI {
  name: string;
  getButtonStyle(): string;
  getCardStyle(): string;
  getContainerStyle(): string;
  getTypographyStyle(): string;
  getAccentColor(): string;
}

/**
 * Abstract theme that uses bridge to platform
 */
export abstract class Theme implements ThemeAPI {
  protected renderer: StyleRenderer;

  constructor(renderer: StyleRenderer) {
    this.renderer = renderer;
  }

  abstract name: string;
  abstract getButtonStyle(): string;
  abstract getCardStyle(): string;
  abstract getContainerStyle(): string;
  abstract getTypographyStyle(): string;
  abstract getAccentColor(): string;

  /**
   * Common method using renderer - delegates to implementation
   */
  render(cssClass: string): string {
    return this.renderer.render(cssClass);
  }
}

// ====================================
// CONCRETE ABSTRACTIONS - Themes
// ====================================

export class ModernTheme extends Theme {
  name = 'Modern';

  getButtonStyle(): string {
    return this.renderer.render('btn-rounded-gradient-shadow');
  }

  getCardStyle(): string {
    return this.renderer.render('card-shadow-minimal');
  }

  getContainerStyle(): string {
    return this.renderer.render('container-flex-centered');
  }

  getTypographyStyle(): string {
    return this.renderer.render('font-sans-smooth');
  }

  getAccentColor(): string {
    return this.renderer.render('color-blue-600');
  }
}

export class MinimalTheme extends Theme {
  name = 'Minimal';

  getButtonStyle(): string {
    return this.renderer.render('btn-flat-black');
  }

  getCardStyle(): string {
    return this.renderer.render('card-no-shadow');
  }

  getContainerStyle(): string {
    return this.renderer.render('container-block');
  }

  getTypographyStyle(): string {
    return this.renderer.render('font-serif-sharp');
  }

  getAccentColor(): string {
    return this.renderer.render('color-black');
  }
}

export class FutureTheme extends Theme {
  name = 'Future';

  getButtonStyle(): string {
    return this.renderer.render('btn-skewed-neon');
  }

  getCardStyle(): string {
    return this.renderer.render('card-glow-effect');
  }

  getContainerStyle(): string {
    return this.renderer.render('container-grid-3d');
  }

  getTypographyStyle(): string {
    return this.renderer.render('font-mono-glow');
  }

  getAccentColor(): string {
    return this.renderer.render('color-cyan-neon');
  }
}

// ====================================
// IMPLEMENTOR - Style Renderer (Bridge)
// ====================================

export interface StyleRenderer {
  render(cssClass: string): string;
  name: string;
}

/**
 * Concrete Implementor: Web Renderer
 */
export class WebStyleRenderer implements StyleRenderer {
  name = 'Web';

  render(cssClass: string): string {
    return `.web { ${cssClass} { display: flex; } }`;
  }
}

/**
 * Concrete Implementor: Mobile Renderer
 */
export class MobileStyleRenderer implements StyleRenderer {
  name = 'Mobile';

  render(cssClass: string): string {
    return `@media (max-width: 768px) { .${cssClass} { width: 100%; padding: 16px; } }`;
  }
}

/**
 * Concrete Implementor: Print Renderer
 */
export class PrintStyleRenderer implements StyleRenderer {
  name = 'Print';

  render(cssClass: string): string {
    return `@media print { .${cssClass} { page-break-inside: avoid; color: black; } }`;
  }
}

/**
 * Concrete Implementor: Dark Mode Renderer
 */
export class DarkModeStyleRenderer implements StyleRenderer {
  name = 'Dark Mode';

  render(cssClass: string): string {
    return `.dark-mode .${cssClass} { filter: invert(1); }`;
  }
}

// ====================================
// BRIDGE COORDINATOR
// ====================================

/**
 * Combines themes with renderers
 */
export class ThemeStyleBridge {
  private theme: Theme;
  private renderer: StyleRenderer;

  constructor(theme: Theme, renderer: StyleRenderer) {
    this.theme = theme;
    this.renderer = renderer;
  }

  /**
   * Change theme (varies abstraction)
   */
  setTheme(theme: Theme): void {
    this.theme = theme;
  }

  /**
   * Change renderer (varies implementation)
   */
  setRenderer(renderer: StyleRenderer): void {
    this.renderer = renderer;
  }

  /**
   * Get complete style output
   */
  getCompleteStyle(): {
    theme: string;
    renderer: string;
    button: string;
    card: string;
    container: string;
    typography: string;
  } {
    return {
      theme: this.theme.name,
      renderer: this.renderer.name,
      button: this.theme.getButtonStyle(),
      card: this.theme.getCardStyle(),
      container: this.theme.getContainerStyle(),
      typography: this.theme.getTypographyStyle(),
    };
  }

  /**
   * Get theme info
   */
  getInfo(): string {
    return `${this.theme.name} Theme via ${this.renderer.name} Renderer`;
  }
}

// ====================================
// THEME PALETTE - Available combinations
// ====================================

export class ThemePalette {
  private themes: Map<string, Theme> = new Map();
  private renderers: Map<string, StyleRenderer> = new Map();

  constructor() {
    // Initialize themes with default web renderer
    const webRenderer = new WebStyleRenderer();
    this.themes.set('modern', new ModernTheme(webRenderer));
    this.themes.set('minimal', new MinimalTheme(webRenderer));
    this.themes.set('future', new FutureTheme(webRenderer));

    // Initialize renderers
    this.renderers.set('web', webRenderer);
    this.renderers.set('mobile', new MobileStyleRenderer());
    this.renderers.set('print', new PrintStyleRenderer());
    this.renderers.set('darkmode', new DarkModeStyleRenderer());
  }

  /**
   * Create bridge with theme + renderer
   */
  createBridge(themeName: string, rendererName: string): ThemeStyleBridge {
    const theme = this.themes.get(themeName);
    const renderer = this.renderers.get(rendererName);

    if (!theme || !renderer) {
      throw new Error(`Theme: ${themeName} or Renderer: ${rendererName} not found`);
    }

    // Create new theme instance with selected renderer
    // Clone to avoid shared state
    let themeInstance: Theme;
    switch (themeName) {
      case 'modern':
        themeInstance = new ModernTheme(renderer);
        break;
      case 'minimal':
        themeInstance = new MinimalTheme(renderer);
        break;
      case 'future':
        themeInstance = new FutureTheme(renderer);
        break;
      default:
        throw new Error(`Unknown theme: ${themeName}`);
    }

    return new ThemeStyleBridge(themeInstance, renderer);
  }

  /**
   * List all available combinations
   */
  listAvailableCombinations(): Array<{ theme: string; renderer: string }> {
    const combinations: Array<{ theme: string; renderer: string }> = [];
    const themeNames = Array.from(this.themes.keys());
    const rendererNames = Array.from(this.renderers.keys());

    themeNames.forEach((theme) => {
      rendererNames.forEach((renderer) => {
        combinations.push({ theme, renderer });
      });
    });

    return combinations;
  }

  /**
   * Get available themes
   */
  getThemeNames(): string[] {
    return Array.from(this.themes.keys());
  }

  /**
   * Get available renderers
   */
  getRendererNames(): string[] {
    return Array.from(this.renderers.keys());
  }
}

// ====================================
// DEMO
// ====================================

export function demoBridgePattern() {
  console.log('\n🌉 BRIDGE PATTERN - Theme & Style Separation\n');

  const palette = new ThemePalette();

  // Example 1: Modern + Web
  console.log('Example 1: Modern Theme on Web');
  let bridge = palette.createBridge('modern', 'web');
  console.log('  Info:', bridge.getInfo());
  console.log('  Button:', bridge.getCompleteStyle().button);

  // Example 2: Minimal + Mobile
  console.log('\nExample 2: Minimal Theme on Mobile');
  bridge = palette.createBridge('minimal', 'mobile');
  console.log('  Info:', bridge.getInfo());
  console.log('  Card:', bridge.getCompleteStyle().card);

  // Example 3: Future + Dark Mode
  console.log('\nExample 3: Future Theme on Dark Mode');
  bridge = palette.createBridge('future', 'darkmode');
  console.log('  Info:', bridge.getInfo());
  console.log('  Accent:', bridge.getCompleteStyle().button);

  // Example 4: Switch renderer
  console.log('\nExample 4: Switch renderer at runtime');
  bridge = palette.createBridge('modern', 'web');
  console.log('  Initial:', bridge.getInfo());
  bridge.setRenderer(new PrintStyleRenderer());
  console.log('  After switch:', bridge.getInfo());

  // Show all combinations
  console.log('\n📊 All possible combinations:');
  const combinations = palette.listAvailableCombinations();
  console.log(`  Total: ${combinations.length} combinations`);
  combinations.slice(0, 6).forEach((combo) => {
    console.log(`    • ${combo.theme} + ${combo.renderer}`);
  });

  console.log(
    `\n✅ Bridge Pattern Benefits:`
  );
  console.log(
    '  ✓ Themes independent from renderers (can add new renderers without changing themes)'
  );
  console.log(
    '  ✓ Renderers independent from themes (can add new themes without changing renderers)'
  );
  console.log(
    '  ✓ Switch combinations at runtime'
  );
  console.log(
    '  ✓ Easy to extend both dimensions'
  );
}
