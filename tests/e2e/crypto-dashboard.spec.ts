import { test, expect } from '@playwright/test';

test.describe('Crypto Dashboard UX', () => {
  test('validates layout and number formatting', async ({ page }) => {
    // Navigate to the target page
    await page.goto('http://localhost:3001/projects/crypto');

    // 1. Check for the title 'Crypto Dashboard'
    // Using a broad text selector and getting the first match to ensure it exists and is visible
    await expect(page.getByText('Crypto Dashboard').first()).toBeVisible();

    // 2. Check if the Portfolio and Ledger panels are visible
    await expect(page.getByText('Portfolio').first()).toBeVisible();
    await expect(page.getByText('Ledger').first()).toBeVisible();

    // Give the application a moment to finish rendering dynamic data
    // waitForLoadState('networkidle') waits until there are no network connections for at least 500 ms
    await page.waitForLoadState('networkidle');

    // 3. Verify that there are no elements containing text like '-1.6195984417051255%'
    // We consider any number with 5 or more decimal places as an unformatted float.
    const unformattedFloatRegex = /-?\d+\.\d{5,}%?/;
    
    // Check the text content of the entire page body
    const pageText = await page.locator('body').innerText();
    const hasUnformattedFloat = unformattedFloatRegex.test(pageText);
    
    expect(
      hasUnformattedFloat, 
      `Found unformatted float in page text: ${pageText.match(unformattedFloatRegex)?.[0]}`
    ).toBeFalsy();

    // Additionally, verify via locator to act as a strict QA gatekeeper
    const unformattedElements = page.getByText(unformattedFloatRegex);
    await expect(unformattedElements).toHaveCount(0, {
      message: 'Elements with unformatted floating point numbers should not exist in the DOM'
    });
  });
});
