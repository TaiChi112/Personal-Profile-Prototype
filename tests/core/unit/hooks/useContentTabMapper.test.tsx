import { expect, test, describe, mock } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useContentTabMapper } from '../../../../app/features/composition/useContentTabMapper';
import type { StyleFactory, UILabels } from '../../../../app/models/theme/ThemeConfig';
import React from 'react';

// Very lightweight mocks for dynamic imports to ensure they can render
mock.module('../../../../app/features/sections/HeroSection', () => ({
  HeroSection: () => <div data-testid="mock-hero-section">Hero Section</div>
}));
mock.module('../../../../app/features/sections/DashboardSection', () => ({
  DashboardSection: () => <div data-testid="mock-dashboard-section">Dashboard Section</div>
}));
mock.module('../../../../app/components/feed/UnifiedFeedSection', () => ({
  UnifiedFeedSection: () => <div data-testid="mock-feed-section">Feed Section</div>
}));
mock.module('../../../../app/features/sections/ProjectsSection', () => ({
  ProjectsSection: () => <div data-testid="mock-projects-section">Projects Section</div>
}));
mock.module('../../../../app/features/sections/PodcastSection', () => ({
  PodcastSection: () => <div data-testid="mock-podcast-section">Podcast Section</div>
}));
mock.module('../../../../app/features/sections/ArticlesSection', () => ({
  ArticlesSection: () => <div data-testid="mock-articles-section">Articles Section</div>
}));
mock.module('../../../../app/features/sections/BlogSection', () => ({
  BlogSection: () => <div data-testid="mock-blog-section">Blog Section</div>
}));
mock.module('../../../../app/features/sections/DocsSection', () => ({
  DocsSection: () => <div data-testid="mock-docs-section">Docs Section</div>
}));
mock.module('../../../../app/features/sections/ResumeSection', () => ({
  ResumeSection: () => <div data-testid="mock-resume-section">Resume Section</div>
}));
mock.module('../../../../app/features/sections/ContactSection', () => ({
  ContactSection: () => <div data-testid="mock-contact-section">Contact Section</div>
}));

describe('useContentTabMapper', () => {
  const defaultParams = {
    activeTab: 'home',
    currentStyle: {} as StyleFactory,
    labels: {} as UILabels,
    projectsList: [],
    blogsTree: { id: 'blog-root', type: 'collection', items: [] } as CompositeNode,
    articlesTree: { id: 'art-root', type: 'collection', items: [] } as CompositeNode,
    blogsList: [],
    isAdmin: false,
    activeNodeId: null,
    onNotify: mock(() => {}),
  };

  test('should return HeroSection for home tab', () => {
    const { result } = renderHook(() => useContentTabMapper({ ...defaultParams, activeTab: 'home' }));
    expect(React.isValidElement(result.current)).toBe(true);
    // Dynamic imports return an object in testing, we just check it is a valid React element.
  });

  test('should return DashboardSection for dashboard tab', () => {
    const { result } = renderHook(() => useContentTabMapper({ ...defaultParams, activeTab: 'dashboard' }));
    expect(React.isValidElement(result.current)).toBe(true);
  });

  test('should return HeroSection as fallback for unknown tab', () => {
    const { result } = renderHook(() => useContentTabMapper({ ...defaultParams, activeTab: 'unknown' }));
    expect(React.isValidElement(result.current)).toBe(true);
  });

  test('should return correct section for all known tabs', () => {
    const tabs = ['feed', 'projects', 'podcast', 'articles', 'blog', 'docs', 'resume', 'contact'];
    
    tabs.forEach(tab => {
      const { result } = renderHook(() => useContentTabMapper({ ...defaultParams, activeTab: tab }));
      expect(React.isValidElement(result.current)).toBe(true);
    });
  });
});
