describe('GraphQL Rate Limiting', () => {
  let mockRateLimiter: any;

  beforeEach(() => {
    // Mock a rate limiter function that allows 2 requests, then blocks
    let requests = 0;
    mockRateLimiter = jest.fn(async (userId: string) => {
      requests++;
      if (requests > 2) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      return true;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow requests within the rate limit', async () => {
    const result1 = await mockRateLimiter('user_1');
    const result2 = await mockRateLimiter('user_1');
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(mockRateLimiter).toHaveBeenCalledTimes(2);
  });

  it('should throw an error when the rate limit is exceeded', async () => {
    await mockRateLimiter('user_1');
    await mockRateLimiter('user_1');
    
    await expect(mockRateLimiter('user_1')).rejects.toThrow('Rate limit exceeded. Please try again later.');
    expect(mockRateLimiter).toHaveBeenCalledTimes(3);
  });

  it('should track rate limits independently for different users', async () => {
    const userRequests: Record<string, number> = {};
    const multiUserRateLimiter = jest.fn(async (userId: string) => {
      if (!userRequests[userId]) {
        userRequests[userId] = 0;
      }
      userRequests[userId]++;
      
      if (userRequests[userId] > 2) {
        throw new Error('Rate limit exceeded.');
      }
      return true;
    });

    // User 1 makes 2 requests (reaches limit)
    await multiUserRateLimiter('user_1');
    await multiUserRateLimiter('user_1');
    
    // User 2 makes 2 requests (reaches limit)
    await multiUserRateLimiter('user_2');
    await multiUserRateLimiter('user_2');
    
    // User 1 exceeds limit
    await expect(multiUserRateLimiter('user_1')).rejects.toThrow('Rate limit exceeded.');
    
    // User 2 exceeds limit
    await expect(multiUserRateLimiter('user_2')).rejects.toThrow('Rate limit exceeded.');
  });
});
