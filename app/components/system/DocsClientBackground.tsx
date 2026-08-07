'use client';

import { ParticleBackground } from './ParticleBackground';
import { useTheme } from '../../providers/ThemeProvider';
import { STYLES } from '../../models/theme/ThemeConfig';

export function DocsClientBackground() {
  const { isDark, styleKey } = useTheme();
  const currentStyle = STYLES[styleKey];
  
  return <ParticleBackground isDark={isDark} styleName={currentStyle.name} />;
}
