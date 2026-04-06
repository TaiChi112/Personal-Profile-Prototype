import type { FeedFilterRequest, FeedItem } from '../../interfaces/feed';

abstract class FeedFilterHandler {
  protected next: FeedFilterHandler | null = null;

  setNext(handler: FeedFilterHandler): FeedFilterHandler {
    this.next = handler;
    return handler;
  }

  handle(item: FeedItem, request: FeedFilterRequest): boolean {
    if (this.next) {
      return this.next.handle(item, request);
    }
    return true;
  }
}

class SearchFilter extends FeedFilterHandler {
  handle(item: FeedItem, request: FeedFilterRequest): boolean {
    if (request.query) {
      const query = request.query.toLowerCase();
      const matches = item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      if (!matches) return false;
    }
    return super.handle(item, request);
  }
}

class TypeFilter extends FeedFilterHandler {
  handle(item: FeedItem, request: FeedFilterRequest): boolean {
    if (request.typeFilter !== 'all' && item.type !== request.typeFilter) {
      return false;
    }
    return super.handle(item, request);
  }
}

class TagFilter extends FeedFilterHandler {
  handle(item: FeedItem, request: FeedFilterRequest): boolean {
    if (request.tags.length > 0) {
      const hasTag = item.meta.some((tag) => request.tags.includes(tag));
      if (!hasTag) return false;
    }
    return super.handle(item, request);
  }
}

export function createFeedFilterChain(): FeedFilterHandler {
  const typeFilter = new TypeFilter();
  const searchFilter = new SearchFilter();
  const tagFilter = new TagFilter();

  typeFilter.setNext(searchFilter).setNext(tagFilter);
  return typeFilter;
}
