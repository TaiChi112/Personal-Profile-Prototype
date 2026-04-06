'use client';

import { useMemo, useState } from 'react';
import type {
  FeedFilterType,
  FeedItem,
  FeedLayoutType,
  FeedSortOption,
} from '../../interfaces/feed';
import { FeedStateCaretaker } from '../../models/feed/FeedState';
import { FEED_SORT_STRATEGIES } from '../../models/feed/FeedSort';
import { composeFeedFilterRequest, composeFeedViewState } from './FeedCompositionService';
import {
  filterAndSortFeedItems,
  loadFeedSnapshot,
  saveFeedSnapshot,
  selectFeedSortStrategy,
  toFeedSortOptions,
} from './FeedStateService';

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type UseFeedControllerParams = {
  allItems: FeedItem[];
  notify: (message: string, level: NotifyLevel) => void;
};

const feedCaretaker = new FeedStateCaretaker();

export function useFeedController({ allItems, notify }: UseFeedControllerParams) {
  const [layout, setLayout] = useState<FeedLayoutType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FeedFilterType>('all');
  const [currentSortStrategy, setCurrentSortStrategy] = useState(FEED_SORT_STRATEGIES[0]);
  const [snapshotName, setSnapshotName] = useState('');
  const [showSnapshots, setShowSnapshots] = useState(false);

  const filterTypes: FeedFilterType[] = ['all', 'project', 'blog', 'video', 'article', 'podcast'];

  const sortOptions: FeedSortOption[] = useMemo(() => toFeedSortOptions(FEED_SORT_STRATEGIES), []);

  const sortedItems = useMemo(
    () => filterAndSortFeedItems(allItems, composeFeedFilterRequest(searchQuery, filterType), currentSortStrategy),
    [allItems, searchQuery, filterType, currentSortStrategy],
  );

  const saveSnapshot = () => {
    const wasSaved = saveFeedSnapshot(
      feedCaretaker,
      snapshotName,
      composeFeedViewState(layout, searchQuery, filterType, currentSortStrategy.label),
      notify,
    );

    if (!wasSaved) return;
    setSnapshotName('');
    setShowSnapshots(false);
  };

  const loadSnapshot = (name: string) => {
    const state = loadFeedSnapshot(feedCaretaker, name);
    if (!state) return;

    setLayout(state.layout);
    setSearchQuery(state.searchQuery);
    setFilterType(state.filterType);

    const strategy = selectFeedSortStrategy(FEED_SORT_STRATEGIES, state.sortLabel);
    if (strategy) setCurrentSortStrategy(strategy);
    notify(`Restored workspace: ${name}`, 'SUCCESS');
    setShowSnapshots(false);
  };

  const selectSortByKey = (sortKey: string) => {
    const strategy = selectFeedSortStrategy(FEED_SORT_STRATEGIES, sortKey);
    if (!strategy) return;

    setCurrentSortStrategy(strategy);
    notify(`Sorted by ${strategy.label}`, 'INFO');
  };

  const selectFilterType = (type: FeedFilterType) => {
    setFilterType(type);
    notify(`Filtered by ${type}`, 'INFO');
  };

  return {
    layout,
    setLayout,
    searchQuery,
    setSearchQuery,
    filterType,
    filterTypes,
    selectFilterType,
    currentSortLabel: currentSortStrategy.label,
    sortOptions,
    selectSortByKey,
    snapshotName,
    setSnapshotName,
    showSnapshots,
    setShowSnapshots,
    snapshotNames: feedCaretaker.getSnapshotNames(),
    saveSnapshot,
    loadSnapshot,
    sortedItems,
  };
}
