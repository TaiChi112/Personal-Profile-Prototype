import { source } from '@/app/lib/source';

export class SearchService {
  public async searchDocs(query: string) {
    try {
      if (!query) {
        return [];
      }

      const pages = source.getPages();
      const lowerQuery = query.toLowerCase();

      return pages.filter((page) => {
        const titleMatch = page.data.title?.toLowerCase().includes(lowerQuery);
        const descriptionMatch = page.data.description?.toLowerCase().includes(lowerQuery);
        return titleMatch || descriptionMatch;
      });
    } catch (error) {
      console.error('Failed to search docs:', error);
      return [];
    }
  }
}
