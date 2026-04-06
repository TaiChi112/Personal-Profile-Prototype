'use client';

import type { ReactNode } from 'react';
import { FeedSearchFilterControls } from './FeedSearchFilterControls';
import { FeedSnapshotBar } from './FeedSnapshotBar';
import { ContentLayoutFactory, LayoutSwitcher, type LayoutType } from '../layout/ContentLayouts';
import { SectionBanner } from '../section/SectionPrimitives';
import type { FeedItem, FeedLayoutType, FeedStyleContract } from '../../interfaces/feed';
import type { SectionTitleStyle } from '../../types/section-style';
import { composeFeedItems } from '../../services/feed/FeedCompositionService';
import { useFeedController } from '../../services/feed/useFeedController';

type NotifyLevel = 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR';

type UnifiedFeedSectionLabels = {
  sections: {
    feed: string;
    feedDesc: string;
  };
  actions: {
    snapshotPlaceholder: string;
    snapshotSave: string;
    snapshotLoad: string;
    search: string;
    filterBy: string;
    view: string;
  };
};

type FeedSectionStyle = FeedStyleContract & SectionTitleStyle;

type UnifiedFeedSectionProps<TProject, TBlog, TVideo, TPodcast> = {
  currentStyle: FeedSectionStyle;
  labels: UnifiedFeedSectionLabels;
  projects: TProject[];
  blogs: TBlog[];
  videos: TVideo[];
  podcasts: TPodcast[];
  adaptProject: (item: TProject) => FeedItem;
  adaptBlog: (item: TBlog) => FeedItem;
  adaptVideo: (item: TVideo) => FeedItem;
  adaptPodcast: (item: TPodcast) => FeedItem;
  notify: (message: string, level: NotifyLevel) => void;
  renderItem: (item: FeedItem, layout: LayoutType, style: FeedSectionStyle, labels: UnifiedFeedSectionLabels) => ReactNode;
};

export function UnifiedFeedSection<TProject, TBlog, TVideo, TPodcast>({
  currentStyle,
  labels,
  projects,
  blogs,
  videos,
  podcasts,
  adaptProject,
  adaptBlog,
  adaptVideo,
  adaptPodcast,
  notify,
  renderItem,
}: UnifiedFeedSectionProps<TProject, TBlog, TVideo, TPodcast>) {
  const allItems = composeFeedItems({
    projects,
    blogs,
    videos,
    podcasts,
    adaptProject,
    adaptBlog,
    adaptVideo,
    adaptPodcast,
  });

  const {
    layout,
    setLayout,
    searchQuery,
    setSearchQuery,
    filterType,
    filterTypes,
    selectFilterType,
    currentSortLabel,
    sortOptions,
    selectSortByKey,
    snapshotName,
    setSnapshotName,
    showSnapshots,
    setShowSnapshots,
    snapshotNames,
    saveSnapshot,
    loadSnapshot,
    sortedItems,
  } = useFeedController({ allItems, notify });

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <SectionBanner
        title={labels.sections.feed}
        description={labels.sections.feedDesc}
        currentStyle={currentStyle}
        className="md:items-end"
        rightSlot={(
          <div className="mt-4 md:mt-0">
            <LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} labels={labels} />
          </div>
        )}
      />
      <FeedSnapshotBar
        currentStyle={currentStyle}
        labels={{
          title: 'Workspace Snapshots',
          placeholder: labels.actions.snapshotPlaceholder,
          saveButton: labels.actions.snapshotSave,
          loadButton: labels.actions.snapshotLoad,
          emptyText: 'No saved snapshots',
        }}
        snapshotName={snapshotName}
        onSnapshotNameChange={setSnapshotName}
        onSaveSnapshot={saveSnapshot}
        showSnapshots={showSnapshots}
        onToggleSnapshots={() => setShowSnapshots(!showSnapshots)}
        snapshotNames={snapshotNames}
        onLoadSnapshot={loadSnapshot}
      />
      <FeedSearchFilterControls
        currentStyle={currentStyle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentSortLabel={currentSortLabel}
        sortOptions={sortOptions}
        onSortSelect={selectSortByKey}
        filterType={filterType}
        filterTypes={filterTypes}
        onFilterSelect={selectFilterType}
        searchPlaceholder={labels.actions.search}
        filterByLabel={labels.actions.filterBy}
      />
      <ContentLayoutFactory
        layout={layout}
        items={sortedItems}
        renderItem={renderItem}
        getDate={(item) => item.date}
        currentStyle={currentStyle}
        labels={labels}
      />
    </div>
  );
}
