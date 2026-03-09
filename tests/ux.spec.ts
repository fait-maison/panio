import { test, expect } from '@playwright/test';
import { enterSandbox } from './helpers';

const LANDSCAPE_PHONE = { width: 667, height: 375 }; // iPhone SE landscape

test.describe('landscape phone viewport', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			localStorage.removeItem('piano-settings');
		});
		await page.setViewportSize(LANDSCAPE_PHONE);
		await enterSandbox(page);
	});

	test('AmbianceCard is fully within the viewport vertically', async ({ page }) => {
		const box = await page.locator('.ambiance-card').boundingBox();
		expect(box).not.toBeNull();
		const b = box as NonNullable<typeof box>;
		// Card top edge must not be above the viewport
		expect(b.y).toBeGreaterThanOrEqual(0);
		// Card bottom edge must not exceed viewport height
		expect(b.y + b.height).toBeLessThanOrEqual(LANDSCAPE_PHONE.height);
	});

	test('keyboard wrapper is visible without vertical scrolling', async ({ page }) => {
		const box = await page.locator('.keyboard-wrapper').boundingBox();
		expect(box).not.toBeNull();
		const b = box as NonNullable<typeof box>;
		// Top edge of keyboard must be within the viewport (reachable without scrolling)
		expect(b.y).toBeLessThan(LANDSCAPE_PHONE.height);
	});

	test('page has no vertical overflow', async ({ page }) => {
		const hasOverflow = await page.evaluate(
			() => document.documentElement.scrollHeight > window.innerHeight
		);
		expect(hasOverflow).toBe(false);
	});
});
