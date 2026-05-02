'use client';

import { useEffect, useState } from 'react';
import type { TourStep } from '../../models/tour/Tour';

type TourHighlightProps = {
  isActive: boolean;
  step: TourStep | null;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function TourHighlight({ isActive, step }: TourHighlightProps) {
  const [rect, setRect] = useState<HighlightRect | null>(null);

  useEffect(() => {
    if (!isActive || !step?.highlightId) {
      setRect(null);
      return;
    }

    const selector = `[data-tour-highlight="${step.highlightId}"]`;
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const nextRect = element.getBoundingClientRect();
      setRect({
        top: nextRect.top + window.scrollY,
        left: nextRect.left + window.scrollX,
        width: nextRect.width,
        height: nextRect.height,
      });
    };

    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [isActive, step?.highlightId]);

  if (!isActive || !step) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1px]" />
      {rect && (
        <>
          <div
            className="absolute rounded-2xl ring-2 ring-cyan-400 shadow-[0_0_0_8px_rgba(34,211,238,0.18),0_0_40px_rgba(34,211,238,0.35)] animate-pulse"
            style={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
            }}
          />
          <div
            className="absolute max-w-xs rounded-2xl border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-2xl"
            style={{
              top: rect.top + rect.height + 16,
              left: rect.left,
            }}
          >
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Live Tour</div>
            {step.label ? <div className="mt-1 text-base font-semibold">{step.label}</div> : null}
            {step.description ? <p className="mt-2 text-sm text-slate-200">{step.description}</p> : null}
            {step.hint ? <p className="mt-2 text-xs text-slate-400">{step.hint}</p> : null}
          </div>
        </>
      )}
    </div>
  );
}
