'use client';

import { Award, Flame, Globe, Lock, Star, Zap } from 'lucide-react';
import { UnifiedFeedItemView } from './UnifiedFeedItemView';
import type { FeedItem, FeedLayoutType, FeedStyleContract } from '../../interfaces/feed';

type FeedDecoration = 'new' | 'featured' | 'sponsor' | 'hot' | 'popular';

type FeedItemLabels = {
  actions: {
    locked: string;
    unlock: string;
  };
};

type FeedItemCardStyle = FeedStyleContract & {
  getLockedOverlayClass: () => string;
};

type DecoratedFeedItemProps = Readonly<{
  item: FeedItem;
  currentLayout: FeedLayoutType;
  style: FeedItemCardStyle;
  onOpenTitle: (itemTitle: string) => void;
}>;

type FeedItemCardProps = Readonly<{
  item: FeedItem;
  currentLayout: FeedLayoutType;
  style: FeedItemCardStyle;
  labels: FeedItemLabels;
  isAdmin: boolean;
  onOpenTitle: (itemTitle: string) => void;
  onRequestUnlock: () => void;
}>;

function getDecoratorStyle(type: FeedDecoration): string {
  switch (type) {
    case 'new':
      return 'bg-emerald-500 text-white shadow-emerald-500/30';
    case 'featured':
      return 'bg-amber-400 text-amber-900 shadow-amber-400/30';
    case 'hot':
      return 'bg-rose-500 text-white shadow-rose-500/30';
    case 'sponsor':
      return 'bg-indigo-500 text-white shadow-indigo-500/30';
    case 'popular':
      return 'bg-blue-500 text-white shadow-blue-500/30';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getDecoratorIcon(type: FeedDecoration) {
  switch (type) {
    case 'featured':
      return <Star size={10} fill="currentColor" />;
    case 'hot':
      return <Flame size={10} />;
    case 'sponsor':
      return <Award size={10} />;
    case 'new':
      return <Zap size={10} />;
    case 'popular':
      return <Globe size={10} />;
    default:
      return null;
  }
}

function DecoratedFeedItem({ item, currentLayout, style, onOpenTitle }: DecoratedFeedItemProps) {
  const decorations = (item.decorations ?? []) as FeedDecoration[];

  if (decorations.length === 0) {
    return <UnifiedFeedItemView item={item} currentLayout={currentLayout} style={style} onOpenTitle={onOpenTitle} />;
  }

  return (
    <div className="relative group h-full">
      <UnifiedFeedItemView item={item} currentLayout={currentLayout} style={style} onOpenTitle={onOpenTitle} />
      <div className="absolute -top-2 -right-1 flex flex-col items-end gap-1 z-10 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1">
        {decorations.map((decoration) => (
          <span
            key={decoration}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wider shadow-sm ${getDecoratorStyle(decoration)} ${style.name === 'Future' ? 'clip-path-slant' : 'rounded-full'} ${style.name === 'Minimal' ? 'border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white' : ''}`}
          >
            {getDecoratorIcon(decoration)} {decoration}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeedItemCard({
  item,
  currentLayout,
  style,
  labels,
  isAdmin,
  onOpenTitle,
  onRequestUnlock,
}: FeedItemCardProps) {
  if (!item.isLocked || isAdmin) {
    return (
      <DecoratedFeedItem item={item} currentLayout={currentLayout} style={style} onOpenTitle={onOpenTitle} />
    );
  }

  return (
    <div className={`${style.getCardClass()} h-full min-h-50 overflow-hidden group`}>
      <div className="p-6 opacity-20 blur-sm select-none pointer-events-none filter grayscale">
        <div className="h-6 w-3/4 bg-gray-400 rounded mb-4"></div>
        <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-4/6 bg-gray-300 rounded"></div>
      </div>
      <div className={style.getLockedOverlayClass()}>
        <div className={`p-4 rounded-full mb-3 ${style.name === 'Future' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-100 text-gray-600'}`}>
          <Lock size={24} />
        </div>
        <h3 className="text-lg font-bold mb-1">{labels.actions.locked}</h3>
        <p className="text-sm opacity-70 mb-4 max-w-50">This content is restricted to users signed in with Google.</p>
        <button onClick={onRequestUnlock} className={style.getButtonClass('primary')}>
          {labels.actions.unlock}
        </button>
      </div>
    </div>
  );
}
