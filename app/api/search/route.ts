import { source } from '@/app/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const { GET } = createSearchAPI('advanced', {
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    structuredData: page.data.exports?.structuredData || { headings: [], contents: [{ content: page.data.description || "" }] },
    id: page.url,
    url: page.url,
  })),
});
