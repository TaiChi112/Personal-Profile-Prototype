'use client';

import { ArrowUpDown, ChevronDown, Filter, Search } from 'lucide-react';
import type { FeedFilterType, FeedSortOption, FeedStyleContract } from '../../interfaces/feed';

type FeedSearchFilterControlsProps = {
  currentStyle: FeedStyleContract;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  currentSortLabel: string;
  sortOptions: FeedSortOption[];
  onSortSelect: (sortKey: string) => void;
  filterType: FeedFilterType;
  filterTypes: FeedFilterType[];
  onFilterSelect: (filter: FeedFilterType) => void;
  searchPlaceholder: string;
  filterByLabel: string;
};

export function FeedSearchFilterControls({
  currentStyle,
  searchQuery,
  onSearchChange,
  currentSortLabel,
  sortOptions,
  onSortSelect,
  filterType,
  filterTypes,
  onFilterSelect,
  searchPlaceholder,
  filterByLabel,
}: FeedSearchFilterControlsProps) {
  return (
    <div className={`mb-8 p-4 rounded-xl ${currentStyle.name === 'Future' ? 'bg-slate-800/50 border border-cyan-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative group">
          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentStyle.getButtonClass('secondary')}`}>
            <ArrowUpDown size={16} />
            <span>{currentSortLabel}</span>
            <ChevronDown size={16} />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10 p-1">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onSortSelect(option.key)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full overflow-x-auto">
        <Filter size={18} className="text-gray-500" />
        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{filterByLabel}:</span>
        {filterTypes.map((type) => (
          <button
            key={type}
            onClick={() => onFilterSelect(type)}
            className={`px-3 py-1.5 rounded-md text-sm capitalize transition-all ${filterType === type ? currentStyle.getButtonClass('primary') : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
