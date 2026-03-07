import { test, expect } from '@playwright/test';
import { enterSandbox } from './helpers';

// All tests in this file use a 15s interval — needs extended timeout
test.describe('autoadvance toast', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			// 0.25 min = 15s interval
			localStorage.setItem('piano-settings', JSON.stringify({ intervalMin: 0.25 }));
		});
		await enterSandbox(page);
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

	test('countdown reaches zero and mood changes', async ({ page }) => {
		test.setTimeout(60_000);
		const moodBefore = await page.locator('.mood').textContent();
		await expect(page.locator('.toast')).toBeVisible({ timeout: 25_000 });
		await expect(page.locator('.mood')).not.toHaveText(moodBefore ?? '', { timeout: 20_000 });
		await expect(page.locator('.toast')).not.toBeVisible();
	});
});
