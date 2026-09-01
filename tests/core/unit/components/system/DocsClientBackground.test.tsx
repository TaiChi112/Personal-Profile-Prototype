import { expect, test, describe, mock, afterEach } from 'bun:test';
import React from 'react';
import { render } from '@testing-library/react';
import { DocsClientBackground } from '../../../../../app/components/system/DocsClientBackground';

// Mock ParticleBackground
mock.module('../../../../../app/components/system/ParticleBackground', () => ({
  ParticleBackground: ({ isDark, styleName }: { isDark: boolean; styleName: string }) => (
    <div data-testid="mock-particle-bg" data-is-dark={String(isDark)} data-style={styleName}>
      Mocked Particles
    </div>
  )
}));

// Mock useThemeStore
const mockUseThemeStore = mock((selector: unknown) => {
  const state = { isDark: false, styleKey: 'modern' };
  return selector(state);
});

mock.module('../../../../../app/store/useThemeStore', () => ({
  useThemeStore: mockUseThemeStore
}));

describe('DocsClientBackground', () => {
  afterEach(() => {
    mockUseThemeStore.mockClear();
    mockUseThemeStore.mockImplementation((selector: unknown) => {
      const state = { isDark: false, styleKey: 'modern' };
      return selector(state);
    });
  });

  test('renders with light mode and default style', () => {
    const { getByTestId } = render(<DocsClientBackground />);
    const bg = getByTestId('mock-particle-bg');
    
    expect(bg).toHaveAttribute('data-is-dark', 'false');
    expect(bg).toHaveAttribute('data-style', 'Modern');
  });

  test('renders with dark mode and another style', () => {
    mockUseThemeStore.mockImplementation((selector: unknown) => {
      const state = { isDark: true, styleKey: 'minimal' };
      return selector(state);
    });

    const { getByTestId } = render(<DocsClientBackground />);
    const bg = getByTestId('mock-particle-bg');
    
    expect(bg).toHaveAttribute('data-is-dark', 'true');
    expect(bg).toHaveAttribute('data-style', 'Minimal');
  });
});
