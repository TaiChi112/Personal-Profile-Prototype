import { source } from '@/app/lib/source';
import { prisma } from '@/app/lib/prisma';

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

  public async semanticSearchDocs(query: string) {
    try {
      if (!query) {
        return [];
      }

      // Mock embedding the query
      const mockEmbedding = `[${Array(1536).fill(0.01).join(',')}]`;

      // Use prisma.$queryRaw with <-> operator to search DocumentEmbedding table
      const results = await prisma.$queryRaw`
        SELECT id, content
        FROM "DocumentEmbedding"
        ORDER BY embedding <-> ${mockEmbedding}::vector
        LIMIT 5;
      `;

      return results;
    } catch (error) {
      console.error('Failed to perform semantic search:', error);
      return [
        {
          id: 'mock-1',
          content: 'This is a mock semantic search result.',
        },
      ];
    }
  }
}
