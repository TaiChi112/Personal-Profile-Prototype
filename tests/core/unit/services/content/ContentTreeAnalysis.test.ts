import { expect, test, describe } from 'bun:test';
import { analyzeContentTrees } from '../../../../../app/services/content/ContentTreeAnalysis';
import type { CompositeNode, LeafNode } from '../../../../../app/interfaces/content-tree';

describe('ContentTreeAnalysis', () => {
  test('should analyze empty trees correctly', () => {
    const result = analyzeContentTrees([]);
    expect(result.stats.total).toBe(0);
    expect(result.tags).toBeArray();
    expect(result.tags.length).toBe(0);
  });

  test('should count items and collect unique tags correctly', () => {
    const mockLeaf1: LeafNode = {
      type: 'item',
      name: 'file1.md',
      path: '/file1.md',
      data: {
        id: '1',
        title: 'Project 1',
        type: 'project',
        meta: ['React', 'TypeScript']
      }
    };

    const mockLeaf2: LeafNode = {
      type: 'item',
      name: 'file2.md',
      path: '/file2.md',
      data: {
        id: '2',
        title: 'Blog 1',
        type: 'blog',
        meta: ['TypeScript', 'Next.js']
      }
    };

    const mockTree: CompositeNode = {
      type: 'container',
      name: 'root',
      path: '/',
      children: [mockLeaf1, mockLeaf2]
    };

    const result = analyzeContentTrees([mockTree]);
    
    // Check Stats
    expect(result.stats.total).toBe(2);
    expect(result.stats.project).toBe(1);
    expect(result.stats.blog).toBe(1);
    expect(result.stats.article).toBe(0); 
    
    // Check Tags (Should be unique)
    expect(result.tags.length).toBe(3);
    expect(result.tags).toContain('React');
    expect(result.tags).toContain('TypeScript');
    expect(result.tags).toContain('Next.js');
  });
});
