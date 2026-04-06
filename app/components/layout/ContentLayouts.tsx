'use client';

import type { ReactNode } from 'react';
import { Clock, LayoutGrid, List } from 'lucide-react';
import type { FeedLayoutType } from '../../interfaces/feed';

export type LayoutType = FeedLayoutType;

type GenericLayoutProps<T, TStyle, TLabels> = {
  items: T[];
  renderItem: (item: T, layout: LayoutType, style: TStyle, labels: TLabels) => ReactNode;
  getDate?: (item: T) => string;
  currentStyle: TStyle & { name: string };
  labels: TLabels;
};

const GridLayout = <T, TStyle, TLabels>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T, TStyle, TLabels>) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map((item, index) => (
      <div key={index} className="h-full">
        {renderItem(item, 'grid', currentStyle, labels)}
      </div>
    ))}
  </div>
);

const ListLayout = <T, TStyle, TLabels>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T, TStyle, TLabels>) => (
  <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
    {items.map((item, index) => (
      <div key={index} className="w-full">
        {renderItem(item, 'list', currentStyle, labels)}
      </div>
    ))}
  </div>
);

const TimelineLayout = <T, TStyle extends { name: string }, TLabels>({ items, renderItem, getDate, currentStyle, labels }: GenericLayoutProps<T, TStyle, TLabels>) => (
  <div className={`max-w-3xl mx-auto border-l-2 ${currentStyle.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-4 md:ml-8 pl-8 py-4 space-y-12`}>
    {items.map((item, index) => (
      <div key={index} className="relative">
        <div className={`absolute -left-10.25 top-0 h-5 w-5 rounded-full border-4 ${currentStyle.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />
        {getDate ? (
          <span className={`absolute -top-7 left-0 text-xs font-bold px-2 py-1 rounded ${currentStyle.name === 'Future' ? 'text-cyan-400 bg-black' : 'text-gray-500 bg-gray-100'}`}>
            {getDate(item)}
          </span>
        ) : null}
        {renderItem(item, 'timeline', currentStyle, labels)}
      </div>
    ))}
  </div>
);

export const ContentLayoutFactory = <T, TStyle extends { name: string }, TLabels>({
  layout,
  items,
  renderItem,
  getDate,
  currentStyle,
  labels,
}: { layout: LayoutType } & GenericLayoutProps<T, TStyle, TLabels>) => {
  if (layout === 'list') {
    return <ListLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} labels={labels} />;
  }

  if (layout === 'timeline') {
    return <TimelineLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} labels={labels} />;
  }

  return <GridLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} labels={labels} />;
};

type LayoutSwitcherProps = {
  current: LayoutType;
  onChange: (layout: LayoutType) => void;
  currentStyle: { name: string };
  labels: { actions: { view: string } };
};

export function LayoutSwitcher({ current, onChange, currentStyle, labels }: LayoutSwitcherProps) {
  return (
    <div className={`flex p-1 rounded-lg border ${currentStyle.name === 'Future' ? 'border-cyan-500/30 bg-black/50' : 'border-gray-200 bg-gray-100'} inline-flex mb-6`}>
      {['grid', 'list', 'timeline'].map((layout) => (
        <button
          key={layout}
          onClick={() => onChange(layout as LayoutType)}
          className={`p-2 rounded-md transition-all ${current === layout ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400 shadow-sm' : 'bg-white text-blue-600 shadow') : 'text-gray-400 hover:text-gray-600'}`}
          title={labels.actions.view}
        >
          {layout === 'grid' ? <LayoutGrid size={18} /> : layout === 'list' ? <List size={18} /> : <Clock size={18} />}
        </button>
      ))}
    </div>
  );
}
