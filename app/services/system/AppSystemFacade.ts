import type { FontKey, LocaleKey, StyleKey, ThemePreference } from '../../models/theme/ThemeConfig';

type NotifyLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

type NotifyFn = (message: string, level: NotifyLevel) => void;

type SystemInitCallbacks = {
  setDark: (val: boolean) => void;
  setStyle: (val: StyleKey) => void;
  setFont: (val: FontKey) => void;
  setAdmin: (val: boolean) => void;
  setLang: (val: LocaleKey) => void;
};

export class AuthManager {
  static async checkSession() {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        return false;
      }

      const session = (await response.json()) as { user?: unknown } | null;
      return Boolean(session?.user);
    } catch {
      return false;
    }
  }
}

export class AnalyticsSystem {
  static init() {
    console.log('[System] Analytics Initialized');
  }

  static trackEvent(event: string) {
    console.log(`[Analytics] ${event}`);
  }
}

export class AppSystemFacade {
  static async initializeSystem(
    callbacks: SystemInitCallbacks,
    notify: NotifyFn,
    getInitialThemePreference: () => ThemePreference,
  ) {
    notify('Initializing System...', 'INFO');
    AnalyticsSystem.init();
    AnalyticsSystem.trackEvent('App Launched');
    const themePrefs = getInitialThemePreference();
    callbacks.setDark(themePrefs.dark);
    callbacks.setStyle(themePrefs.style);
    callbacks.setFont(themePrefs.font);
    const isAdmin = await AuthManager.checkSession();
    callbacks.setAdmin(isAdmin);
    callbacks.setLang(themePrefs.lang);
    setTimeout(() => {
      notify('System Ready', 'SUCCESS');
    }, 800);
  }
}
