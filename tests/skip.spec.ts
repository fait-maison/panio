import { test, expect } from '@playwright/test';
import { enterSandbox } from './helpers';

test.describe('skip button', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			localStorage.removeItem('piano-settings');
		});
		await enterSandbox(page);
	});

	test('changes the mood after skip', async ({ page }) => {
		const moodBefore = await page.locator('.mood').textContent();
		await page.getByRole('button', { name: 'Next ambiance' }).click();
		await expect(page.locator('.mood')).not.toHaveText(moodBefore ?? '');
	});

	test('changes the key after skip', async ({ page }) => {
		const keyBefore = await page.locator('.badge .key').textContent();
		await page.getByRole('button', { name: 'Next ambiance' }).click();
		await expect(page.locator('.badge .key')).not.toHaveText(keyBefore ?? '');
	});

	test('clears chord-active state after skip', async ({ page }) => {
		await page.locator('.chord').first().focus();
		await expect(page.locator('.keyboard')).toHaveClass(/chord-active/);
		await page.getByRole('button', { name: 'Next ambiance' }).click();
		await expect(page.locator('.keyboard')).not.toHaveClass(/chord-active/);
	});
});
