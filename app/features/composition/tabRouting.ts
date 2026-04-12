export const TAB_IDS = [
  'home',
  'feed',
  'projects',
  'articles',
  'blog',
  'docs',
  'podcast',
  'dashboard',
  'resume',
  'contact',
] as const;

export type TabId = (typeof TAB_IDS)[number];

const TAB_PATH_MAP: Record<TabId, string> = {
  home: '/',
  feed: '/feed',
  projects: '/projects',
  articles: '/articles',
  blog: '/blog',
  docs: '/docs',
  podcast: '/podcast',
  dashboard: '/analytics',
  resume: '/resume',
  contact: '/contact',
};

export function isTabId(value: string): value is TabId {
  return (TAB_IDS as readonly string[]).includes(value);
}

export function normalizeTabId(value?: string | null): TabId {
  if (!value) {
    return 'home';
  }

  if (value === 'analytics') {
    return 'dashboard';
  }

  if (isTabId(value)) {
    return value;
  }

  return 'home';
}

export function getPathFromTab(tab: string): string {
  return TAB_PATH_MAP[normalizeTabId(tab)];
}
