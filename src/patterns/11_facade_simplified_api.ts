/**
 * FACADE PATTERN - Simplified API
 * 
 * Problem: page.tsx needs to coordinate multiple subsystems
 *          - Notifications, themes, localization, analytics
 *          - Client needs to interact with them all
 *          - Complex internal organization shouldn't be visible to client
 * 
 * Solution: Provide unified, simplified interface to complex subsystem
 *          Hide implementation details, expose only necessary methods
 * 
 * Real-world usage from page.tsx:
 *   - AppManager facade handles all app-level operations
 *   - Client calls simple methods like changeTheme(), switchLanguage()
 *   - Internally coordinates: theme change, CSS update, storage save, analytics
 */

// ====================================
// SUBSYSTEM 1 - Theme Manager
// ====================================

export type ThemeType = 'modern' | 'minimal' | 'future' | 'academic';

export class ThemeManager {
  private currentTheme: ThemeType = 'modern';
  private availableThemes: ThemeType[] = ['modern', 'minimal', 'future', 'academic'];

  setTheme(theme: ThemeType): boolean {
    if (this.availableThemes.includes(theme)) {
      console.log(`[ThemeManager] Applying theme: ${theme}`);
      this.currentTheme = theme;
      return true;
    }
    return false;
  }

  getCurrentTheme(): ThemeType {
    return this.currentTheme;
  }

  getAvailableThemes(): ThemeType[] {
    return [...this.availableThemes];
  }

  applyThemeCss(): string {
    console.log(`[ThemeManager] Injecting CSS for ${this.currentTheme}`);
    return `.theme-${this.currentTheme} { }`;
  }
}

// ====================================
// SUBSYSTEM 2 - Localization Manager
// ====================================

export type LanguageType = 'en' | 'th';

export interface Localization {
  nav: { home: string; about: string; services: string };
  hero: { title: string; subtitle: string };
}

export class LocalizationManager {
  private currentLanguage: LanguageType = 'en';
  private translations: Record<LanguageType, Localization> = {
    en: {
      nav: { home: 'Home', about: 'About', services: 'Services' },
      hero: { title: 'Welcome', subtitle: 'Build amazing things' },
    },
    th: {
      nav: { home: 'หน้าแรก', about: 'เกี่ยวกับ', services: 'บริการ' },
      hero: { title: 'ยินดีต้อนรับ', subtitle: 'สร้างสิ่งที่ยอดเยี่ยม' },
    },
  };

  setLanguage(language: LanguageType): boolean {
    if (language in this.translations) {
      console.log(`[LocalizationManager] Switching to language: ${language}`);
      this.currentLanguage = language;
      return true;
    }
    return false;
  }

  getCurrentLanguage(): LanguageType {
    return this.currentLanguage;
  }

  getTranslation(key: string): string {
    const parts = key.split('.');
    let value: unknown = this.translations[this.currentLanguage];
    for (const part of parts) {
      if (typeof value === 'object' && value !== null && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }

  getAllTranslations(): Localization {
    return this.translations[this.currentLanguage];
  }
}

// ====================================
// SUBSYSTEM 3 - Notification Manager
// ====================================

export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

export class NotificationManager {
  private notifications: Array<{
    id: string;
    message: string;
    level: NotificationLevel;
    timestamp: Date;
  }> = [];

  notify(message: string, level: NotificationLevel = 'info'): string {
    const id = `notif-${Date.now()}`;
    console.log(`[NotificationManager] ${level.toUpperCase()}: ${message}`);
    this.notifications.push({
      id,
      message,
      level,
      timestamp: new Date(),
    });
    return id;
  }

  clearNotifications(): void {
    console.log('[NotificationManager] Clearing all notifications');
    this.notifications = [];
  }

  getNotifications(): typeof this.notifications {
    return [...this.notifications];
  }
}

// ====================================
// SUBSYSTEM 4 - Analytics Manager
// ====================================

export class AnalyticsManager {
  private events: Array<{
    eventName: string;
    data: Record<string, unknown>;
    timestamp: Date;
  }> = [];

  trackEvent(eventName: string, data: Record<string, unknown> = {}): void {
    console.log(`[AnalyticsManager] Event: ${eventName}`, data);
    this.events.push({
      eventName,
      data,
      timestamp: new Date(),
    });
  }

  getEvents(): typeof this.events {
    return [...this.events];
  }
}

// ====================================
// SUBSYSTEM 5 - Storage Manager
// ====================================

export class StorageManager {
  private storage: Map<string, string> = new Map();

  save(key: string, value: unknown): void {
    console.log(`[StorageManager] Saving ${key}`);
    this.storage.set(key, JSON.stringify(value));
  }

  load<T>(key: string): T | null {
    const value = this.storage.get(key);
    if (value) {
      console.log(`[StorageManager] Loading ${key}`);
      return JSON.parse(value) as T;
    }
    return null;
  }

  clear(): void {
    console.log('[StorageManager] Clearing storage');
    this.storage.clear();
  }
}

// ====================================
// FACADE - Unified Application Interface
// ====================================

export interface AppConfig {
  theme: ThemeType;
  language: LanguageType;
}

/**
 * Application Facade - Single entry point for all app operations
 */
export class ApplicationFacade {
  // Subsystems
  private themeManager: ThemeManager;
  private localizationManager: LocalizationManager;
  private notificationManager: NotificationManager;
  private analyticsManager: AnalyticsManager;
  private storageManager: StorageManager;

  // State
  private isInitialized: boolean = false;

  constructor() {
    this.themeManager = new ThemeManager();
    this.localizationManager = new LocalizationManager();
    this.notificationManager = new NotificationManager();
    this.analyticsManager = new AnalyticsManager();
    this.storageManager = new StorageManager();
  }

  /**
   * Initialize the application (facade hides all setup details)
   */
  initialize(): void {
    console.log('\n🚀 Initializing Application...');

    // Load saved config
    const savedConfig = this.storageManager.load<AppConfig>('appConfig');

    if (savedConfig) {
      this.themeManager.setTheme(savedConfig.theme);
      this.localizationManager.setLanguage(savedConfig.language);
      console.log('✓ Loaded saved configuration');
    } else {
      // Set defaults
      this.themeManager.setTheme('modern');
      this.localizationManager.setLanguage('en');
      console.log('✓ Applied default configuration');
    }

    // Apply theme CSS
    this.themeManager.applyThemeCss();

    // Track initialization
    this.analyticsManager.trackEvent('app_initialized', {
      theme: this.themeManager.getCurrentTheme(),
      language: this.localizationManager.getCurrentLanguage(),
    });

    this.isInitialized = true;
    console.log('✓ Application ready\n');
  }

  /**
   * Simple method: Change theme (hides complexity)
   */
  changeTheme(theme: ThemeType): void {
    if (!this.isInitialized) {
      this.notificationManager.notify('App not initialized', 'error');
      return;
    }

    if (this.themeManager.setTheme(theme)) {
      this.themeManager.applyThemeCss();
      this.notificationManager.notify(`Theme changed to ${theme}`, 'success');
      this.analyticsManager.trackEvent('theme_changed', { theme });
      this.saveConfiguration();
    }
  }

  /**
   * Simple method: Switch language (hides complexity)
   */
  switchLanguage(language: LanguageType): void {
    if (!this.isInitialized) {
      this.notificationManager.notify('App not initialized', 'error');
      return;
    }

    if (this.localizationManager.setLanguage(language)) {
      this.notificationManager.notify(`Language switched to ${language}`, 'success');
      this.analyticsManager.trackEvent('language_switched', { language });
      this.saveConfiguration();
    }
  }

  /**
   * Simple method: Show notification (hides complexity)
   */
  showNotification(message: string, level: NotificationLevel = 'info'): void {
    this.notificationManager.notify(message, level);
    this.analyticsManager.trackEvent('notification_shown', { message, level });
  }

  /**
   * Simple method: Get translated text
   */
  t(key: string): string {
    return this.localizationManager.getTranslation(key);
  }

  /**
   * Simple method: Get current config
   */
  getConfig(): AppConfig {
    return {
      theme: this.themeManager.getCurrentTheme(),
      language: this.localizationManager.getCurrentLanguage(),
    };
  }

  /**
   * Simple method: Get all translations
   */
  getTranslations(): Localization {
    return this.localizationManager.getAllTranslations();
  }

  /**
   * Simple method: Get available themes
   */
  getAvailableThemes(): ThemeType[] {
    return this.themeManager.getAvailableThemes();
  }

  /**
   * Simple method: Reset app to defaults
   */
  resetConfiguration(): void {
    this.changeTheme('modern');
    this.switchLanguage('en');
    this.notificationManager.clearNotifications();
    this.storageManager.clear();
    this.showNotification('App reset to defaults', 'info');
  }

  /**
   * Save current configuration (internal helper)
   */
  private saveConfiguration(): void {
    this.storageManager.save('appConfig', this.getConfig());
  }

  /**
   * Get analytics data
   */
  getAnalytics() {
    return this.analyticsManager.getEvents();
  }

  /**
   * Get current notifications
   */
  getNotifications() {
    return this.notificationManager.getNotifications();
  }
}

// ====================================
// DEMO
// ====================================

export function demoFacadePattern() {
  console.log('\n🎭 FACADE PATTERN - Simplified API\n');

  // Create facade
  const app = new ApplicationFacade();

  // Client only calls simple facade methods - no knowledge of subsystems
  app.initialize();

  // Change theme - facade handles all internal coordination
  app.changeTheme('future');
  app.changeTheme('minimal');

  // Switch language - facade coordinates everything
  app.switchLanguage('th');
  app.switchLanguage('en');

  // Show notification - facade logs and tracks
  app.showNotification('Welcome to the app!', 'success');

  // Get translations easily
  console.log('📚 Current translations:');
  const translations = app.getTranslations();
  console.log('  Nav:', translations.nav);
  console.log('  Hero:', translations.hero);

  // Get simple config
  console.log('\n⚙️  Current configuration:', app.getConfig());

  // Reset with one call
  console.log('\n🔄 Resetting configuration...');
  app.resetConfiguration();

  console.log('\n📊 Final state:', app.getConfig());

  console.log(
    '\n✅ Facade Pattern Benefits:'
  );
  console.log(
    '  ✓ Complex subsystems hidden behind simple interface'
  );
  console.log(
    '  ✓ Clients only call what they need'
  );
  console.log(
    '  ✓ Decouples client from subsystem details'
  );
  console.log(
    '  ✓ Easier to modify internal implementation'
  );
  console.log(
    '  ✓ Single point of entry for coordinated operations'
  );
}
