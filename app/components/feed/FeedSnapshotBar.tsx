'use client';

import { ChevronDown, DownloadCloud, RotateCw, Save } from 'lucide-react';
import type { FeedSnapshotBarLabels, FeedStyleContract } from '../../interfaces/feed';

type FeedSnapshotBarProps = {
  currentStyle: FeedStyleContract;
  labels: FeedSnapshotBarLabels;
  snapshotName: string;
  onSnapshotNameChange: (value: string) => void;
  onSaveSnapshot: () => void;
  showSnapshots: boolean;
  onToggleSnapshots: () => void;
  snapshotNames: string[];
  onLoadSnapshot: (name: string) => void;
};

export function FeedSnapshotBar({
  currentStyle,
  labels,
  snapshotName,
  onSnapshotNameChange,
  onSaveSnapshot,
  showSnapshots,
  onToggleSnapshots,
  snapshotNames,
  onLoadSnapshot,
}: FeedSnapshotBarProps) {
  return (
    <div className={`mb-6 p-4 rounded-xl flex flex-wrap items-center gap-4 transition-all ${currentStyle.name === 'Future' ? 'bg-cyan-900/20 border border-cyan-500/30' : 'bg-gray-200/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
        <Save size={16} /> {labels.title}
      </div>
      <div className="flex gap-2 relative">
        <input
          type="text"
          placeholder={labels.placeholder}
          value={snapshotName}
          onChange={(e) => onSnapshotNameChange(e.target.value)}
          className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 md:w-48"
        />
        <button
          onClick={onSaveSnapshot}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
        >
          <Save size={12} /> {labels.saveButton}
        </button>
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <div className="relative">
          <button
            onClick={onToggleSnapshots}
            className="px-3 py-1 bg-white dark:bg-gray-800 hover:bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded flex items-center gap-1 transition-colors"
          >
            <DownloadCloud size={14} /> {labels.loadButton} <ChevronDown size={12} />
          </button>
          {showSnapshots ? (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95">
              {snapshotNames.length === 0 ? (
                <div className="px-4 py-2 text-xs text-gray-400 italic text-center">{labels.emptyText}</div>
              ) : (
                snapshotNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => onLoadSnapshot(name)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group"
                  >
                    <span>{name}</span>
                    <RotateCw size={12} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
