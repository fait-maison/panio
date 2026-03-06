import { test, expect, type Page } from '@playwright/test';

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
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('hamburger button opens the settings panel', async ({ page }) => {
    await openSettings(page);
    await expect(page.getByText('Settings')).toBeVisible();
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
    // Default: showHints = true
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
    // Roman numerals always start with I, V, i, v, or b (borrowed) — never an uppercase note letter
    expect(chordAfter?.trim()).toMatch(/^[IVivb°]/);
  });

});

test.describe('settings persistence', () => {
  test('saved keyboard size is applied on page load', async ({ page }) => {
    // Pre-set localStorage before any navigation — initScript runs before every load
    await page.addInitScript(() => {
      localStorage.setItem('piano-locale', 'en');
      localStorage.setItem('piano-settings', JSON.stringify({ keyboardSize: 's' }));
    });
    await page.goto('/', { waitUntil: 'networkidle' });
    const width = await getKeyboardWidth(page);
    // S size = 52 * (round(28 * 0.65) + 1) - 1 = 987; M size = 1507
    expect(width).toBe(987);
    // Reload should also apply the same saved setting
    await page.reload({ waitUntil: 'networkidle' });
    expect(await getKeyboardWidth(page)).toBe(987);
  });
});
