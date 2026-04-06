'use client';

import { Calendar } from 'lucide-react';
import type { FeedItem, FeedLayoutType, FeedStyleContract } from '../../interfaces/feed';

type UnifiedFeedItemViewProps = {
  item: FeedItem;
  currentLayout: FeedLayoutType;
  style: FeedStyleContract;
  onOpenTitle: (itemTitle: string) => void;
};

export function UnifiedFeedItemView({ item, currentLayout, style, onOpenTitle }: UnifiedFeedItemViewProps) {
  const isList = currentLayout === 'list';

  return (
    <div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row items-center' : 'flex-col'}`}>
      <div className={`${isList ? 'w-48 h-32' : 'h-48'} bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 relative overflow-hidden`}>
        <span className="text-gray-400 font-medium opacity-50">{item.type.toUpperCase()}</span>
        <div className={`absolute top-2 right-2 ${style.getBadgeClass()}`}>{item.type}</div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-xs text-gray-400 mb-2 space-x-2">
          <Calendar size={12} />
          <span>{item.date}</span>
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}
          onClick={() => onOpenTitle(item.title)}
        >
          {item.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{item.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {item.meta.slice(0, 3).map((tag, i) => (
            <span key={i} className={style.getBadgeClass()}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
