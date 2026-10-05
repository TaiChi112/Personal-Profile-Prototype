import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { render } from '@testing-library/react';

// Mock dependencies
const mockFetchAllKeystaticData = mock();
mock.module('@/app/lib/content-fetcher', () => ({
  fetchAllKeystaticData: mockFetchAllKeystaticData,
}));

let lastRenderedProps: any = null;
mock.module('@/app/features/composition/PersonalWebsiteApp', () => ({
  PersonalWebsiteApp: (props: any) => {
    lastRenderedProps = props;
    return (
      <div data-testid="mock-personal-website-app">
        <span data-testid="initial-tab">{props.initialTab}</span>
        <span data-testid="project-param">{props.initialProjectParam}</span>
        <span data-testid="projects-count">{props.initialProjectsList?.length}</span>
      </div>
    );
  },
}));

import ProjectDetailPage from '@/app/projects/(micro-apps)/[projectParam]/page';

describe('ProjectDetailPage Micro-App [projectParam]', () => {
  const dummyKeystaticData = {
    projectsList: [{ slug: 'p1', title: 'Project 1' }],
    blogsTree: [{ id: 'b1', name: 'Blog Tree' }],
    articlesTree: [{ id: 'a1', name: 'Article Tree' }],
    blogsList: [{ slug: 'blog-1', title: 'My First Post' }],
  };

  beforeEach(() => {
    mockFetchAllKeystaticData.mockReset();
    mockFetchAllKeystaticData.mockResolvedValue(dummyKeystaticData);
    lastRenderedProps = null;
  });

  it('should resolve Promise params with string projectParam and pass props to PersonalWebsiteApp', async () => {
    const paramsPromise = Promise.resolve({ projectParam: 'tabata-timer' });
    const PageComponent = await ProjectDetailPage({ params: paramsPromise });

    const { getByTestId } = render(PageComponent);

    expect(mockFetchAllKeystaticData).toHaveBeenCalledTimes(1);
    expect(getByTestId('initial-tab').textContent).toBe('projects');
    expect(getByTestId('project-param').textContent).toBe('tabata-timer');
    expect(getByTestId('projects-count').textContent).toBe('1');

    expect(lastRenderedProps).toEqual({
      initialTab: 'projects',
      initialProjectParam: 'tabata-timer',
      initialProjectsList: dummyKeystaticData.projectsList,
      initialBlogsTree: dummyKeystaticData.blogsTree,
      initialArticlesTree: dummyKeystaticData.articlesTree,
      blogsList: dummyKeystaticData.blogsList,
    });
  });

  it('should handle array projectParam by selecting the first element', async () => {
    const paramsPromise = Promise.resolve({ projectParam: ['sort-viz', 'extra-slug'] as any });
    const PageComponent = await ProjectDetailPage({ params: paramsPromise });

    const { getByTestId } = render(PageComponent);

    expect(mockFetchAllKeystaticData).toHaveBeenCalledTimes(1);
    expect(getByTestId('project-param').textContent).toBe('sort-viz');
    expect(lastRenderedProps.initialProjectParam).toBe('sort-viz');
  });

  it('should propagate errors when fetchAllKeystaticData fails', async () => {
    mockFetchAllKeystaticData.mockRejectedValue(new Error('Keystatic fetch failed'));
    const paramsPromise = Promise.resolve({ projectParam: 'broken-app' });

    expect(ProjectDetailPage({ params: paramsPromise })).rejects.toThrow('Keystatic fetch failed');
  });
});
