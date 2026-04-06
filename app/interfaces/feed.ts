export type FeedLayoutType = 'grid' | 'list' | 'timeline';

export type FeedFilterType = 'all' | 'project' | 'blog' | 'video' | 'article' | 'podcast';

export interface FeedItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc' | 'podcast';
  title: string;
  description: string;
  date: string;
  meta: string[];
  decorations?: Array<'new' | 'featured' | 'sponsor' | 'hot' | 'popular'>;
  isLocked?: boolean;
}

export interface FeedStyleContract {
  name: string;
  getCardClass: () => string;
  getBadgeClass: () => string;
  getButtonClass: (type: 'primary' | 'secondary') => string;
}

export interface FeedSortOption {
  key: string;
  label: string;
}

export interface FeedSnapshotBarLabels {
  title: string;
  placeholder: string;
  saveButton: string;
  loadButton: string;
  emptyText: string;
}

export interface FeedViewState {
  layout: FeedLayoutType;
  searchQuery: string;
  filterType: FeedFilterType;
  sortLabel: string;
}

export interface FeedSortStrategy<T extends FeedItem = FeedItem> {
  label: string;
  sort: (items: T[]) => T[];
}

export interface FeedFilterRequest {
  query: string;
  typeFilter: FeedFilterType;
  tags: string[];
}
