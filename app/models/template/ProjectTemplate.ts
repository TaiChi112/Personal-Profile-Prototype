import type { UnifiedContentItem } from '../../interfaces/content-tree';

export interface Prototype<T> {
  clone(): T;
}

export class ProjectTemplate implements Prototype<UnifiedContentItem> {
  constructor(private readonly data: UnifiedContentItem) {}

  clone(): UnifiedContentItem {
    const cloned = JSON.parse(JSON.stringify(this.data));
    const timestamp = Date.now();
    cloned.id = `proj-copy-${timestamp}`;
    cloned.title = `${this.data.title} (Clone)`;
    cloned.date = new Date().toISOString().split('T')[0];
    cloned.decorations = ['new'];
    return cloned;
  }
}
