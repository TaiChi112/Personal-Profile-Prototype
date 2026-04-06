import type { UnifiedContentItem } from '../../interfaces/content-tree';
import { ProjectTemplate } from './ProjectTemplate';

export class ProjectTemplateRegistry {
  private templates: Map<string, ProjectTemplate> = new Map();

  register(key: string, item: UnifiedContentItem) {
    this.templates.set(key, new ProjectTemplate(item));
  }

  get(key: string): ProjectTemplate | undefined {
    return this.templates.get(key);
  }

  getAllKeys(): string[] {
    return Array.from(this.templates.keys());
  }
}
