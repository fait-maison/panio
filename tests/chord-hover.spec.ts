import { test, expect } from '@playwright/test';

test.describe('chord hover focus mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('keyboard has no chord-active class on load', async ({ page }) => {
    const keyboard = page.locator('.keyboard');
    await expect(keyboard).not.toHaveClass(/chord-active/);
  });

  test('hovering a chord chip adds chord-active to keyboard', async ({ page }) => {
    await page.locator('.chord').first().focus();
    await expect(page.locator('.keyboard')).toHaveClass(/chord-active/);
  });

  test('hovering a chord chip marks at least one key as in-chord', async ({ page }) => {
    await page.locator('.chord').first().focus();
    await expect(page.locator('.key.in-chord').first()).toBeVisible();
  });

  test('leaving the progression row removes chord-active', async ({ page }) => {
    await page.locator('.chord').first().focus();
    await page.locator('.chord').first().blur();
    await expect(page.locator('.keyboard')).not.toHaveClass(/chord-active/);
  });
});
