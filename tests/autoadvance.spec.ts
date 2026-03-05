import { test, expect } from '@playwright/test';

// All tests in this file use a 15s interval — needs extended timeout
test.describe('autoadvance toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      // 0.25 min = 15s interval
      localStorage.setItem('piano-settings', JSON.stringify({ intervalMin: 0.25 }));
    });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('toast appears after interval expires', async ({ page }) => {
    test.setTimeout(40_000);
    await expect(page.locator('.toast')).toBeVisible({ timeout: 30_000 });
  });

  test('toast shows countdown and snooze button', async ({ page }) => {
    test.setTimeout(40_000);
    await expect(page.locator('.toast')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.countdown')).toBeVisible();
    await expect(page.locator('.snooze')).toBeVisible();
  });

  test('snooze button dismisses the toast', async ({ page }) => {
    test.setTimeout(40_000);
    await expect(page.locator('.toast')).toBeVisible({ timeout: 30_000 });
    await page.locator('.snooze').click();
    await expect(page.locator('.toast')).not.toBeVisible();
  });

  test('countdown reaches zero and mode changes', async ({ page }) => {
    test.setTimeout(60_000);
    const modeBefore = await page.locator('.mode').textContent();
    await expect(page.locator('.toast')).toBeVisible({ timeout: 25_000 });
    // Wait for 5s countdown to expire and new ambiance to load
    await expect(page.locator('.mode')).not.toHaveText(modeBefore ?? '', { timeout: 20_000 });
    await expect(page.locator('.toast')).not.toBeVisible();
  });
});
