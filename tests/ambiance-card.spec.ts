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

	test('shows mood, key, mode, rhythm and chord chips on load', async ({ page }) => {
		await expect(page.locator('.mood')).toBeVisible();
		await expect(page.locator('.badge .key')).toBeVisible();
		await expect(page.locator('.mode')).toBeVisible();
		await expect(page.locator('.rhythm')).toBeVisible();
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

test.describe('in-card exercise settings', () => {
	// All tests run at 1280×720 (default) — at <860px wide the collapsible is replaced
	// by a bottom sheet; we test the collapsible only.
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			localStorage.removeItem('piano-settings');
		});
		await enterSandbox(page);
	});

	test('gear button opens the settings panel', async ({ page }) => {
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		// When open, the interval radio buttons inside the collapsible become visible
		const panel = page.locator('.exercise-settings');
		await expect(panel.getByRole('radio', { name: '15s' })).toBeVisible();
	});

	test('gear button closes the settings panel on second click', async ({ page }) => {
		const panel = page.locator('.exercise-settings');
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		await expect(panel.getByRole('radio', { name: '15s' })).toBeVisible();
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		// Panel collapses via max-height:0 — check the open class is removed
		await expect(panel).not.toHaveClass(/open/);
	});

	test('changing interval in-card persists to localStorage', async ({ page }) => {
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		const panel = page.locator('.exercise-settings');
		await panel.getByRole('radio', { name: '15s' }).click();
		const raw = await page.evaluate(() => localStorage.getItem('piano-settings'));
		const saved = JSON.parse(raw ?? '{}');
		expect(saved.intervalMin).toBe(0.25);
	});

	test('restricting mode pool to one mode constrains ambiance after skip', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-settings', JSON.stringify({ modePool: ['Dorian'] }));
		});
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Next ambiance' }).click();
		await expect(page.locator('.mode')).toHaveText('DORIAN');
	});

	test('restricting key pool to one key constrains ambiance after skip', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-settings', JSON.stringify({ keyPool: ['C'] }));
		});
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Next ambiance' }).click();
		await expect(page.locator('.badge .key')).toHaveText('C');
	});

	test('lock pattern prevents deselecting the last mood in the pool', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-settings', JSON.stringify({ moodPool: ['bright'] }));
		});
		await enterSandbox(page);
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		// The 'Bright' mood button should be the only active one (data-state="on")
		// pointer-events: none prevents clicking it when it's the last one
		await page
			.getByRole('button', { name: 'Bright' })
			.click({ force: false })
			.catch(() => {});
		// Pool must still have exactly 1 item
		const raw = await page.evaluate(() => localStorage.getItem('piano-settings'));
		const saved = JSON.parse(raw ?? '{}');
		expect(saved.moodPool).toEqual(['bright']);
	});
});
