import type { Page } from '@playwright/test';

export async function enterSandbox(page: Page) {
	await page.goto('/sandbox', { waitUntil: 'networkidle' });
}

export async function goToSettings(page: Page) {
	await page.goto('/settings', { waitUntil: 'networkidle' });
}
