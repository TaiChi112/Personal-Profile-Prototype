export class MockPersistedQueryCache {
  private cache = new Map<string, string>();

  async get(key: string): Promise<string | undefined> {
    return this.cache.get(key);
  }

  async set(key: string, value: string, options?: { ttl?: number | null }): Promise<void> {
    this.cache.set(key, value);
    // Note: TTL is ignored in this simple mock implementation
  }

  async delete(key: string): Promise<boolean | void> {
    return this.cache.delete(key);
  }
}

export const persistedQueryCache = new MockPersistedQueryCache();
