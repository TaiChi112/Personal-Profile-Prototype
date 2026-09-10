import React from 'react';

interface RSCStreamingSkeletonProps {
  className?: string;
  rows?: number;
}

export default function RSCStreamingSkeleton({
  className = '',
  rows = 3,
}: RSCStreamingSkeletonProps) {
  return (
    <div 
      className={`w-full p-4 space-y-4 rounded-xl border border-gray-200 bg-white/50 shadow-sm dark:border-gray-800 dark:bg-gray-950/50 ${className}`}
      aria-busy="true"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i} 
            className="h-3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800"
            style={{ width: `${Math.max(60, 100 - (i * 10))}%` }}
          />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
