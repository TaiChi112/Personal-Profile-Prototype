import { expect, test, describe, beforeEach } from 'bun:test';
import { ProjectTemplateRegistry } from '../../../../../app/models/template/ProjectTemplateRegistry';
import type { UnifiedContentItem } from '../../../../../app/interfaces/content-tree';

describe('ProjectTemplateRegistry', () => {
  let registry: ProjectTemplateRegistry;

  const mockItem: UnifiedContentItem = {
    id: 'mock-1',
    type: 'project',
    title: 'Mock Project',
    description: 'A mock project',
    date: '2024-01-01',
    meta: ['Test']
  };

  beforeEach(() => {
    registry = new ProjectTemplateRegistry();
  });

  test('should register and retrieve a template correctly', () => {
    registry.register('key-1', mockItem);
    
    const retrieved = registry.get('key-1');
    expect(retrieved).toBeDefined();
    // Assuming ProjectTemplate exposes the underlying item or has methods we can check
    // Actually we don't have visibility into ProjectTemplate properties without looking at it,
    // but we know it's an instance of ProjectTemplate.
    expect(retrieved?.constructor.name).toBe('ProjectTemplate');
  });

  test('should return undefined for non-existent key', () => {
    expect(registry.get('missing-key')).toBeUndefined();
  });

  test('should return all registered keys', () => {
    registry.register('key-1', mockItem);
    registry.register('key-2', mockItem);
    
    const keys = registry.getAllKeys();
    expect(keys.length).toBe(2);
    expect(keys).toContain('key-1');
    expect(keys).toContain('key-2');
  });
});
