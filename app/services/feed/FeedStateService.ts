import type {
  FeedFilterRequest,
  FeedItem,
  FeedSortOption,
  FeedSortStrategy,
  FeedViewState,
} from '../../interfaces/feed';
import { createFeedFilterChain } from '../../models/feed/FeedFilter';
import { FeedStateCaretaker, FeedStateMemento } from '../../models/feed/FeedState';

export function saveFeedSnapshot(
  caretaker: FeedStateCaretaker,
  name: string,
  state: FeedViewState,
  notify: (message: string, level: 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR') => void,
): boolean {
  if (!name.trim()) return false;
  caretaker.saveSnapshot(name, new FeedStateMemento(state));
  notify(`Snapshot "${name}" saved!`, 'SUCCESS');
  return true;
}

export function loadFeedSnapshot(
  caretaker: FeedStateCaretaker,
  name: string,
): FeedViewState | null {
  const memento = caretaker.getSnapshot(name);
  if (!memento) return null;
  return memento.getState();
}

export function selectFeedSortStrategy(
  sortStrategies: FeedSortStrategy<FeedItem>[],
  sortKey: string,
): FeedSortStrategy<FeedItem> | null {
  return sortStrategies.find((entry) => entry.label === sortKey) ?? null;
}

export function toFeedSortOptions(sortStrategies: FeedSortStrategy<FeedItem>[]): FeedSortOption[] {
  return sortStrategies.map((strategy) => ({ key: strategy.label, label: strategy.label }));
}

export function filterAndSortFeedItems(
  items: FeedItem[],
  request: FeedFilterRequest,
  strategy: FeedSortStrategy<FeedItem>,
): FeedItem[] {
  const chain = createFeedFilterChain();
  const filteredItems = items.filter((item) => chain.handle(item, request));
  return strategy.sort(filteredItems);
}
