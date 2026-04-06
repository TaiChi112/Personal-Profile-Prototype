'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, PlayCircle, SkipBack, SkipForward, StopCircle, X } from 'lucide-react';

type TourStepLike = {
  targetId?: string;
  label?: string;
};

type TourIteratorLike<T> = {
  next: () => T | null;
  prev: () => T | null;
  hasNext: () => boolean;
  hasPrev: () => boolean;
  current: () => T;
};

type TourControlsStyle = {
  getTourOverlayClass: () => string;
};

type TourControlsLabels = {
  actions: {
    tourSpeed: string;
    tourPrev: string;
    tourPause: string;
    tourPlay: string;
    tourNext: string;
    tourEnd: string;
  };
};

type TourControlsProps<TStep extends TourStepLike> = {
  iterator: TourIteratorLike<TStep>;
  isActive: boolean;
  onStop: () => void;
  onExecuteStep: (step: TStep) => void;
  style: TourControlsStyle;
  labels: TourControlsLabels;
};

export function TourControls<TStep extends TourStepLike>({
  iterator,
  isActive,
  onStop,
  onExecuteStep,
  style,
  labels,
}: TourControlsProps<TStep>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isActive) {
      interval = setInterval(() => {
        const nextStep = iterator.next();
        if (nextStep) {
          onExecuteStep(nextStep);
        } else {
          setIsPlaying(false);
        }
      }, 3000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isActive, iterator, onExecuteStep, speed]);

  if (!isActive) return null;

  const currentStep = iterator.current();

  return (
    <div className={style.getTourOverlayClass()}>
      <div className="flex items-center gap-2 pr-4 border-r border-gray-300 dark:border-gray-600">
        <span className="text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-2">
          <PlayCircle size={14} className="text-green-500" /> Live Tour
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
          className="px-2 py-1 text-xs font-bold border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 w-12"
          title={labels.actions.tourSpeed}
        >
          {speed}x
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            const previous = iterator.prev();
            if (previous) onExecuteStep(previous);
          }}
          disabled={!iterator.hasPrev()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 transition-colors"
          title={labels.actions.tourPrev}
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-2 rounded transition-all ${isPlaying ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          title={isPlaying ? labels.actions.tourPause : labels.actions.tourPlay}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="text-sm font-bold min-w-30 text-center truncate px-2">{currentStep.label || currentStep.targetId}</div>
        <button
          onClick={() => {
            setIsPlaying(false);
            const next = iterator.next();
            if (next) onExecuteStep(next);
            else onStop();
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          title={labels.actions.tourNext}
        >
          {iterator.hasNext() ? <SkipForward size={20} /> : <StopCircle size={20} className="text-red-500" />}
        </button>
      </div>
      <button
        onClick={() => {
          setIsPlaying(false);
          onStop();
        }}
        className="ml-4 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors"
        title={labels.actions.tourEnd}
      >
        <X size={16} />
      </button>
      {isPlaying ? <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: '100%', transition: `width ${3000 / speed}ms linear` }}></div> : null}
    </div>
  );
}
