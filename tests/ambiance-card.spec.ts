import { test, expect } from '@playwright/test';
import { enterSandbox } from './helpers';

test.describe('ambiance card', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      localStorage.removeItem('piano-settings');
    });
    await enterSandbox(page);
  });

  test('shows key, mode, texture and chord chips on load', async ({ page }) => {
    await expect(page.locator('.badge .key')).toBeVisible();
    await expect(page.locator('.mode')).toBeVisible();
    await expect(page.locator('.texture')).toBeVisible();
    await expect(page.locator('.chord').first()).toBeVisible();
  });

  test('displays exactly 4 chord chips', async ({ page }) => {
    await expect(page.locator('.chord')).toHaveCount(4);
  });

  test('key and mode contain non-empty text', async ({ page }) => {
    const key = await page.locator('.badge .key').textContent();
    const mode = await page.locator('.mode').textContent();
    expect(key?.trim().length).toBeGreaterThan(0);
    expect(mode?.trim().length).toBeGreaterThan(0);
  });

  test('first chord chip has tonic class', async ({ page }) => {
    await expect(page.locator('.chord.tonic')).toBeVisible();
  });
});
