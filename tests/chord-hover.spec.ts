import { test, expect } from '@playwright/test';

test.describe('chord hover focus mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('keyboard has no chord-active class on load', async ({ page }) => {
    const keyboard = page.locator('.keyboard');
    await expect(keyboard).not.toHaveClass(/chord-active/);
  });

  test('hovering a chord chip adds chord-active to keyboard', async ({ page }) => {
    await page.locator('.chord').first().click();
    await expect(page.locator('.keyboard')).toHaveClass(/chord-active/);
  });

  test('hovering a chord chip marks at least one key as in-chord', async ({ page }) => {
    await page.locator('.chord').first().click();
    await expect(page.locator('.key.in-chord').first()).toBeAttached();
  });

  test('leaving the progression row removes chord-active', async ({ page }) => {
    await page.locator('.chord').first().click();
    await page.click('h1.app-title');
    await expect(page.locator('.keyboard')).not.toHaveClass(/chord-active/);
  });
});
