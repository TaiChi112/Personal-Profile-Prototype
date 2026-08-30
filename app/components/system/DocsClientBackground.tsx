'use client';

import { ParticleBackground } from './ParticleBackground';
import { useThemeStore } from '../../store/useThemeStore';
import { STYLES } from '../../models/theme/ThemeConfig';

export function DocsClientBackground() {
  const isDark = useThemeStore((s) => s.isDark);
  const styleKey = useThemeStore((s) => s.styleKey);
  const currentStyle = STYLES[styleKey];
  
  return <ParticleBackground isDark={isDark} styleName={currentStyle.name} />;
}
