import type { CompositeNode, LayoutNode, LeafNode, UnifiedContentItem } from '../../interfaces/content-tree';

type ContentTypeKey = 'project' | 'blog' | 'article' | 'video' | 'doc' | 'podcast';

type ContentStats = Record<ContentTypeKey | 'total', number>;

interface ContentTreeVisitor {
  visitLeaf(leaf: LeafNode): void;
  visitComposite(composite: CompositeNode): void;
}

function traverse(node: LayoutNode | CompositeNode | LeafNode, visitor: ContentTreeVisitor): void {
  if (node.type === 'item') {
    visitor.visitLeaf(node as LeafNode);
    return;
  }

  if (node.type === 'container') {
    const composite = node as CompositeNode;
    visitor.visitComposite(composite);
    composite.children.forEach((child) => traverse(child, visitor));
  }
}

class MetricsVisitor implements ContentTreeVisitor {
  counts: ContentStats = {
    project: 0,
    blog: 0,
    article: 0,
    video: 0,
    doc: 0,
    podcast: 0,
    total: 0,
  };

  visitLeaf(leaf: LeafNode): void {
    this.countItem(leaf.data);
  }

  visitComposite(composite: CompositeNode): void {
    if (composite.data) this.countItem(composite.data);
  }

  private countItem(item: UnifiedContentItem): void {
    if (this.counts[item.type] !== undefined) {
      this.counts[item.type] += 1;
      this.counts.total += 1;
    }
  }
}

class TagsVisitor implements ContentTreeVisitor {
  tags = new Set<string>();

  visitLeaf(leaf: LeafNode): void {
    leaf.data.meta?.forEach((tag) => this.tags.add(tag));
  }

  visitComposite(composite: CompositeNode): void {
    composite.data?.meta?.forEach((tag) => this.tags.add(tag));
  }
}

export function analyzeContentTrees(trees: CompositeNode[]): { stats: ContentStats; tags: string[] } {
  const metricsVisitor = new MetricsVisitor();
  const tagsVisitor = new TagsVisitor();

  trees.forEach((tree) => {
    traverse(tree, metricsVisitor);
    traverse(tree, tagsVisitor);
  });

  return { stats: metricsVisitor.counts, tags: Array.from(tagsVisitor.tags) };
}
