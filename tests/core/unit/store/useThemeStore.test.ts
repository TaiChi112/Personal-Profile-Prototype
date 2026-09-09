import { expect, test, describe, beforeEach } from 'bun:test';
import { useThemeStore } from '../../../../app/store/useThemeStore';

describe('useThemeStore', () => {
  // Reset store before each test to ensure isolation
  beforeEach(() => {
    useThemeStore.setState({
      isDark: false,
      styleKey: 'modern',
      fontKey: 'sans',
      langKey: 'en',
    });
  });

  test('should initialize with default state', () => {
    const state = useThemeStore.getState();
    expect(state.isDark).toBe(false);
    expect(state.styleKey).toBe('modern');
    expect(state.fontKey).toBe('sans');
    expect(state.langKey).toBe('en');
  });

  test('should update isDark', () => {
    useThemeStore.getState().setIsDark(true);
    expect(useThemeStore.getState().isDark).toBe(true);
  });

  test('should toggle isDark correctly', () => {
    const toggle = useThemeStore.getState().toggleDark;
    toggle();
    expect(useThemeStore.getState().isDark).toBe(true);
    toggle();
    expect(useThemeStore.getState().isDark).toBe(false);
  });

  test('should update styleKey', () => {
    useThemeStore.getState().setStyleKey('minimal');
    expect(useThemeStore.getState().styleKey).toBe('minimal');
  });

  test('should update fontKey', () => {
    useThemeStore.getState().setFontKey('serif');
    expect(useThemeStore.getState().fontKey).toBe('serif');
  });

  test('should update langKey', () => {
    useThemeStore.getState().setLangKey('th');
    expect(useThemeStore.getState().langKey).toBe('th');
  });
});
