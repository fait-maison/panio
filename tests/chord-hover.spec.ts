import { test, expect } from '@playwright/test';
import { enterSandbox } from './helpers';

test.describe('chord hover focus mode', () => {
  test.beforeEach(async ({ page }) => {
    await enterSandbox(page);
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

  test('hovering a chord chip marks exactly one key as is-chord-root', async ({ page }) => {
    await page.locator('.chord').first().focus();
    const roots = page.locator('.key.is-chord-root');
    await expect(roots.first()).toBeVisible();
    const rootCount = await roots.count();
    const chordCount = await page.locator('.key.in-chord').count();
    expect(rootCount).toBeLessThan(chordCount);
  });
});
