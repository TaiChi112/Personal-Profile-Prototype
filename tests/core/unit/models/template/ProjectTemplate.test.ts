import { expect, test, describe } from 'bun:test';
import { ProjectTemplate } from '../../../../../app/models/template/ProjectTemplate';
import type { UnifiedContentItem } from '../../../../../app/interfaces/content-tree';

describe('ProjectTemplate', () => {
  const originalItem: UnifiedContentItem = {
    id: 'original-1',
    type: 'project',
    title: 'Original Project',
    description: 'This is an original project',
    date: '2020-01-01',
    meta: ['TypeScript', 'React'],
    decorations: ['popular']
  };

  test('should clone an item with a new ID, title, date, and decorations', () => {
    const template = new ProjectTemplate(originalItem);
    const clonedItem = template.clone();

    // Check modified fields
    expect(clonedItem.id).toStartWith('proj-copy-');
    expect(clonedItem.id).not.toBe(originalItem.id);
    expect(clonedItem.title).toBe('Original Project (Clone)');
    expect(clonedItem.decorations).toEqual(['new']);
    
    // Check deep cloned fields
    expect(clonedItem.description).toBe(originalItem.description);
    expect(clonedItem.meta).toEqual(originalItem.meta);
    expect(clonedItem.meta).not.toBe(originalItem.meta); // Reference check to ensure deep copy
  });
});
