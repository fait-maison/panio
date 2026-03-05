import { test, expect } from '@playwright/test';

test.describe('skip button', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      localStorage.removeItem('piano-settings');
    });
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('changes the mode after skip', async ({ page }) => {
    const modeBefore = await page.locator('.mode').textContent();
    await page.locator('.skip-btn').click();
    // Generator always excludes the previous mode — guaranteed to change
    await expect(page.locator('.mode')).not.toHaveText(modeBefore ?? '');
  });

  test('changes the key after skip', async ({ page }) => {
    const keyBefore = await page.locator('.badge .key').textContent();
    await page.locator('.skip-btn').click();
    // Generator always excludes the previous key — guaranteed to change
    await expect(page.locator('.badge .key')).not.toHaveText(keyBefore ?? '');
  });

  test('clears chord-active state after skip', async ({ page }) => {
    await page.locator('.chord').first().focus();
    await expect(page.locator('.keyboard')).toHaveClass(/chord-active/);
    await page.locator('.skip-btn').click();
    await expect(page.locator('.keyboard')).not.toHaveClass(/chord-active/);
  });
});
