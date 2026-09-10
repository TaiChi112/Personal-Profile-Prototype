import { test, expect } from '@playwright/test';

test('has title Interactive Resume', async ({ page }) => {
  await page.goto('/en/resume/interactive');
  
  // Verify the heading "Interactive Resume" is visible on the page.
  await expect(page.getByRole('heading', { name: 'Interactive Resume' })).toBeVisible();
});
