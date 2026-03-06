import { test, expect, type Page } from '@playwright/test';
import { enterSandbox } from './helpers';

async function getKeyboardWidth(page: Page): Promise<number> {
  const style = await page.locator('.keyboard').getAttribute('style');
  const match = style?.match(/width:\s*([\d.]+)px/);
  return match ? parseFloat(match[1]) : 0;
}

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.locator('.sections')).toBeVisible();
}

test.describe('settings panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      localStorage.removeItem('piano-settings');
    });
    await enterSandbox(page);
  });

  test('hamburger button opens the settings panel', async ({ page }) => {
    await openSettings(page);
    await expect(page.getByText('Settings', { exact: true }).first()).toBeVisible();
  });

  test('Escape closes the settings panel', async ({ page }) => {
    await openSettings(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('.sections')).not.toBeVisible();
  });

  test('switching to large keyboard size widens the keyboard', async ({ page }) => {
    const widthM = await getKeyboardWidth(page);
    await openSettings(page);
    await page.getByRole('radio', { name: 'L', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.sections')).not.toBeVisible();
    expect(await getKeyboardWidth(page)).toBeGreaterThan(widthM);
  });

  test('turning hint mode off removes in-scale keys', async ({ page }) => {
    await expect(page.locator('.key.in-scale').first()).toBeVisible();
    await openSettings(page);
    await page.getByRole('radio', { name: 'Off', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.sections')).not.toBeVisible();
    await expect(page.locator('.key.in-scale')).toHaveCount(0);
  });

  test('turning hint mode back on restores in-scale keys', async ({ page }) => {
    await openSettings(page);
    await page.getByRole('radio', { name: 'Off', exact: true }).click();
    await expect(page.locator('.key.in-scale')).toHaveCount(0);
    await page.getByRole('radio', { name: 'On', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.sections')).not.toBeVisible();
    await expect(page.locator('.key.in-scale').first()).toBeVisible();
  });

  test('switching to roman numeral notation changes chord chip text', async ({ page }) => {
    const chordBefore = await page.locator('.chord').first().textContent();
    await openSettings(page);
    await page.getByRole('radio', { name: 'Roman numerals', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.sections')).not.toBeVisible();
    const chordAfter = await page.locator('.chord').first().textContent();
    expect(chordAfter).not.toEqual(chordBefore);
    expect(chordAfter?.trim()).toMatch(/^[IVivb°]/);
  });

});

test.describe('settings persistence', () => {
  test('saved keyboard size is applied on page load', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      localStorage.setItem('piano-settings', JSON.stringify({ keyboardSize: 's' }));
    });
    await enterSandbox(page);
    const width = await getKeyboardWidth(page);
    expect(width).toBe(987);
    // Reload takes us back to landing — need to enter sandbox again
    await enterSandbox(page);
    expect(await getKeyboardWidth(page)).toBe(987);
  });
});
