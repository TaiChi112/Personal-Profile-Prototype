import type { FeedItem, FeedSortStrategy } from '../../interfaces/feed';

export class DateSortStrategy implements FeedSortStrategy<FeedItem> {
  label = 'Date (Newest)';

  sort(items: FeedItem[]): FeedItem[] {
    return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export class TitleSortStrategy implements FeedSortStrategy<FeedItem> {
  label = 'Title (A-Z)';

  sort(items: FeedItem[]): FeedItem[] {
    return [...items].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class LengthSortStrategy implements FeedSortStrategy<FeedItem> {
  label = 'Length (Longest)';

  sort(items: FeedItem[]): FeedItem[] {
    return [...items].sort((a, b) => b.description.length - a.description.length);
  }
}

export const FEED_SORT_STRATEGIES: FeedSortStrategy<FeedItem>[] = [
  new DateSortStrategy(),
  new TitleSortStrategy(),
  new LengthSortStrategy(),
];
