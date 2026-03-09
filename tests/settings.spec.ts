import { test, expect, type Page } from '@playwright/test';
import { enterSandbox, goToSettings } from './helpers';

async function getKeyboardWidth(page: Page): Promise<number> {
	const style = await page.locator('.keyboard').getAttribute('style');
	const match = style?.match(/width:\s*([\d.]+)px/);
	return match ? parseFloat(match[1]) : 0;
}

test.describe('settings page', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			if (!sessionStorage.getItem('_e2e_init')) {
				localStorage.removeItem('piano-settings');
				sessionStorage.setItem('_e2e_init', '1');
			}
		});
	});

	test('settings page renders all setting groups', async ({ page }) => {
		await goToSettings(page);
		await expect(page.getByText('Settings', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Language')).toBeVisible();
		await expect(page.getByText('Keyboard size')).toBeVisible();
		await expect(page.getByText('Display scales')).toBeVisible();
		await expect(page.getByText('Chord notation')).toBeVisible();
		await expect(page.getByText('Select MIDI device')).toBeVisible();
	});

	test('switching to large keyboard size widens the keyboard', async ({ page }) => {
		await enterSandbox(page);
		const widthM = await getKeyboardWidth(page);
		await goToSettings(page);
		await page.getByRole('radio', { name: 'L', exact: true }).click();
		await enterSandbox(page);
		expect(await getKeyboardWidth(page)).toBeGreaterThan(widthM);
	});

	test('turning hint mode off removes in-scale keys', async ({ page }) => {
		await enterSandbox(page);
		await expect(page.locator('.key.in-scale').first()).toBeVisible();
		await goToSettings(page);
		await page.getByRole('radio', { name: 'Off', exact: true }).click();
		await enterSandbox(page);
		await expect(page.locator('.key.in-scale')).toHaveCount(0);
	});

	test('turning hint mode back on restores in-scale keys', async ({ page }) => {
		await goToSettings(page);
		await page.getByRole('radio', { name: 'Off', exact: true }).click();
		await page.getByRole('radio', { name: 'On', exact: true }).click();
		await enterSandbox(page);
		await expect(page.locator('.key.in-scale').first()).toBeVisible();
	});

	test('switching to roman numeral notation changes chord chip text', async ({ page }) => {
		await enterSandbox(page);
		const chordBefore = await page.locator('.chord').first().textContent();
		await goToSettings(page);
		await page.getByRole('radio', { name: 'Roman numerals', exact: true }).click();
		await enterSandbox(page);
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
		await enterSandbox(page);
		expect(await getKeyboardWidth(page)).toBe(987);
	});
});

test.describe('sidebar navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
		});
	});

	test('hamburger button opens the sidebar', async ({ page }) => {
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Menu' }).click();
		await expect(page.locator('.sections')).toBeVisible();
	});

	test('Escape closes the sidebar', async ({ page }) => {
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Menu' }).click();
		await expect(page.locator('.sections')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.locator('.sections')).not.toBeVisible();
	});

	test('sidebar has Settings link that navigates to /settings', async ({ page }) => {
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Menu' }).click();
		await page.getByText('Settings', { exact: true }).click();
		await expect(page).toHaveURL('/settings');
	});

	test('MIDI status badge links to /settings', async ({ page }) => {
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Menu' }).click();
		await page.locator('a.midi-status').click();
		await expect(page).toHaveURL('/settings');
	});
});
