import { expect, test, describe, mock, beforeEach } from 'bun:test';
import { fetchAllKeystaticData } from '../../../../app/lib/content-fetcher';

// 1. Mock Keystatic Reader
const mockBlogsAll = mock(() => Promise.resolve([]));
const mockArticlesAll = mock(() => Promise.resolve([]));
const mockProjectsAll = mock(() => Promise.resolve([]));

mock.module('../../../../app/lib/keystatic', () => ({
  reader: {
    collections: {
      blogs: { all: mockBlogsAll },
      articles: { all: mockArticlesAll },
      projects: { all: mockProjectsAll },
    }
  }
}));

// Removed mock.module for ContentTreeSetup to prevent bleeding into ContentTreeSetup.test.ts

describe('content-fetcher', () => {
  beforeEach(() => {
    mockBlogsAll.mockReset();
    mockArticlesAll.mockReset();
    mockProjectsAll.mockReset();
    
    // Setup default happy path
    mockBlogsAll.mockResolvedValue([]);
    mockArticlesAll.mockResolvedValue([]);
    mockProjectsAll.mockResolvedValue([]);
  });

  test('should fetch and map empty collections correctly', async () => {
    const data = await fetchAllKeystaticData();
    
    expect(data.projectsList).toBeArray();
    expect(data.projectsList.length).toBe(0);
    expect(data.blogsList).toBeArray();
    expect(data.blogsList.length).toBe(0);
    expect(data.blogsTree.id).toBe('blog-root');
    expect(data.articlesTree.id).toBe('art-root'); // Updated to use real id from ContentTreeSetup
    
    expect(mockBlogsAll).toHaveBeenCalledTimes(1);
  });

  test('should correctly map raw project data to Project type', async () => {
    mockProjectsAll.mockResolvedValueOnce([
      {
        slug: 'test-project',
        entry: {
          title: 'Test Project',
          summary: 'A test project',
          date: '2023-01-01',
          category: 'Web',
          githubUrl: 'https://github.com/test',
          featured: true,
          techStack: ['React', 'Bun']
        }
      }
    ] as never[]);

    const data = await fetchAllKeystaticData();
    
    expect(data.projectsList.length).toBe(1);
    const p = data.projectsList[0];
    
    expect(p.id).toBe('test-project');
    expect(p.slug).toBe('test-project');
    expect(p.title).toBe('Test Project');
    expect(p.description).toBe('A test project');
    expect(p.category).toBe('Web');
    expect(p.githubUrl).toBe('https://github.com/test');
    expect(p.repoUrl).toBeUndefined(); // internalAppRoute was omitted
    expect(p.featured).toBe(true);
    expect(p.techStack).toEqual(['React', 'Bun']);
  });

  test('should fallback to defaults when fields are missing', async () => {
    mockProjectsAll.mockResolvedValueOnce([
      {
        slug: 'minimal-project',
        entry: {} // Everything missing
      }
    ] as never[]);

    const data = await fetchAllKeystaticData();
    const p = data.projectsList[0];
    
    expect(p.title).toBe('');
    expect(p.category).toBe('Web');
    expect(p.featured).toBe(false);
    expect(p.techStack).toEqual([]);
  });
});
