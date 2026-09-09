import { expect, test, describe } from 'bun:test';
import { getBlogsTree, getArticlesTree } from '../../../../../app/services/content/ContentTreeSetup';
import type { Blog, Article } from '../../../../../app/data/content';

describe('ContentTreeSetup', () => {
  const mockBlogs: Blog[] = [
    {
      id: 'blog-1',
      slug: 'blog-1',
      title: 'Personal Blog',
      summary: 'Summary 1',
      date: '2024-01-01',
      category: 'Personal'
    }
  ];

  const mockArticles: Article[] = [
    {
      id: 'article-1',
      slug: 'article-1',
      title: 'React Article',
      excerpt: 'Excerpt 1',
      publishedAt: '2024-01-01',
      tags: ['React'],
      readTime: '5 min',
      content: '',
      author: { name: 'Rawin', avatar: '' }
    }
  ];

  describe('getBlogsTree', () => {
    test('should build blog tree correctly', async () => {
      const tree = await getBlogsTree(mockArticles, mockBlogs);
      
      expect(tree.type).toBe('container');
      expect(tree.id).toBe('blog-root');
      expect(tree.title).toBe('My Writings');
      expect(tree.children.length).toBeGreaterThan(0);
    });
  });

  describe('getArticlesTree', () => {
    test('should build articles tree correctly', async () => {
      const tree = await getArticlesTree(mockArticles, mockBlogs);
      
      expect(tree.type).toBe('container');
      expect(tree.id).toBe('art-root');
      expect(tree.title).toBe('Knowledge Base');
      expect(tree.children.length).toBeGreaterThan(0);
    });
  });
});
