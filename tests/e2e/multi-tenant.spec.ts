import { test, expect } from '@playwright/test';

test.describe('Multi-tenant Application', () => {
  test('tenant A can login and see tenant A data', async ({ page }) => {
    await page.goto('https://tenant-a.example.com/login');
    await page.fill('input[name="username"]', 'user_a');
    await page.fill('input[name="password"]', 'password_a');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('https://tenant-a.example.com/dashboard');
    await expect(page.locator('text=Welcome, user_a')).toBeVisible();
    await expect(page.locator('text=Tenant A Data')).toBeVisible();
  });

  test('tenant B can login and see tenant B data', async ({ page }) => {
    await page.goto('https://tenant-b.example.com/login');
    await page.fill('input[name="username"]', 'user_b');
    await page.fill('input[name="password"]', 'password_b');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('https://tenant-b.example.com/dashboard');
    await expect(page.locator('text=Welcome, user_b')).toBeVisible();
    await expect(page.locator('text=Tenant B Data')).toBeVisible();
  });
});
