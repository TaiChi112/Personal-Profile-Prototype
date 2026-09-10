import { test, expect } from '@playwright/test';

test('search API returns 200 OK', async ({ request }) => {
  const response = await request.get('/api/search');
  expect(response.status()).toBe(200);
});
