'use client';

import type { ReactNode } from 'react';
import type { SectionTitleStyle } from '../../types/section-style';

type SectionHeaderProps = {
  title: string;
  description?: string;
  currentStyle: SectionTitleStyle;
};

export function SectionHeader({ title, description, currentStyle }: SectionHeaderProps) {
  return (
    <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className={currentStyle.getSectionTitleClass()}>{title}</h2>
      {description ? <p className="text-gray-500 mt-2">{description}</p> : null}
    </div>
  );
}

type SectionBannerProps = {
  title: string;
  description?: string;
  currentStyle: SectionTitleStyle;
  rightSlot?: ReactNode;
  className?: string;
};

export function SectionBanner({ title, description, currentStyle, rightSlot, className = '' }: SectionBannerProps) {
  return (
    <div className={`mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 flex justify-between items-center gap-4 ${className}`.trim()}>
      <div>
        <h2 className={currentStyle.getSectionTitleClass()}>{title}</h2>
        {description ? <p className="text-gray-500 mt-2">{description}</p> : null}
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </div>
  );
}

type ContentSectionShellProps = {
  title: string;
  description: string;
  currentStyle: SectionTitleStyle;
  children: ReactNode;
};

export function ContentSectionShell({ title, description, currentStyle, children }: ContentSectionShellProps) {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <SectionHeader title={title} description={description} currentStyle={currentStyle} />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
