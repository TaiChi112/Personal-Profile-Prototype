export type DecorationType = 'new' | 'featured' | 'sponsor' | 'hot' | 'popular';

export interface UnifiedContentItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc' | 'podcast';
  slug?: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  meta: string[];
  actionLink?: string;
  decorations?: DecorationType[];
  isLocked?: boolean;
}

export type ComponentType = 'container' | 'item';
export type LayoutStyleType = 'grid' | 'list' | 'timeline' | 'column' | 'row';

export interface LayoutNode {
  id: string;
  type: ComponentType;
}

export interface LeafNode extends LayoutNode {
  type: 'item';
  data: UnifiedContentItem;
}

export interface CompositeNode extends LayoutNode {
  type: 'container';
  layoutStyle: LayoutStyleType;
  children: Array<LayoutNode | CompositeNode | LeafNode>;
  title?: string;
  colSpan?: number;
  data?: UnifiedContentItem;
}
