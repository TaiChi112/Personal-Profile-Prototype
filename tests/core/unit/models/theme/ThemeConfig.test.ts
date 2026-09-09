import { expect, test, describe } from 'bun:test';
import { getInitialThemePreference, STYLES, FONTS, LOCALES } from '../../../../../app/models/theme/ThemeConfig';
import { THEME_STYLE_DATA } from '../../../../../app/models/theme/ThemeData';

describe('ThemeConfig', () => {
  describe('StyleFactory', () => {
    test('getButtonClass should return correct variants', () => {
      const modernStyle = STYLES['modern'];
      expect(modernStyle).toBeDefined();
      
      const modernData = THEME_STYLE_DATA['modern'];
      
      expect(modernStyle.getButtonClass('primary')).toBe(modernData.buttonClasses.primary);
      expect(modernStyle.getButtonClass('secondary')).toBe(modernData.buttonClasses.secondary);
      expect(modernStyle.getButtonClass('text')).toBe(modernData.buttonClasses.text);
      expect(modernStyle.getButtonClass()).toBe(modernData.buttonClasses.secondary); // default fallback
    });

    test('getToastClass should return correct variant based on type', () => {
      const modernStyle = STYLES['modern'];
      const modernData = THEME_STYLE_DATA['modern'];

      expect(modernStyle.getToastClass('SUCCESS')).toBe(modernData.toastClasses.success);
      expect(modernStyle.getToastClass('ERROR')).toBe(modernData.toastClasses.default);
      expect(modernStyle.getToastClass('INFO')).toBe(modernData.toastClasses.default);
    });
  });

  describe('Factories Map', () => {
    test('LOCALES map should be correctly instantiated', () => {
      expect(LOCALES['en']).toBeDefined();
      expect(LOCALES['en'].code).toBe('EN');
      expect(LOCALES['en'].getLabels()).toBeTypeOf('object');
    });

    test('FONTS map should be correctly instantiated', () => {
      expect(FONTS['sans']).toBeDefined();
      expect(FONTS['sans'].name).toBe('Sans');
      expect(FONTS['sans'].getFontClass()).toBeTypeOf('string');
    });
  });

  describe('getInitialThemePreference', () => {
    test('should return default preferences in non-browser environment', () => {
      const prefs = getInitialThemePreference();
      expect(prefs.dark).toBe(false); // Because window is undefined in typical CLI runner
      expect(prefs.style).toBe('modern');
      expect(prefs.font).toBe('sans');
      expect(prefs.lang).toBe('en');
    });
  });
});
