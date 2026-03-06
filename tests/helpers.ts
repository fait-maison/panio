import type { Page } from '@playwright/test';

export async function enterSandbox(page: Page) {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.getByRole('button', { name: 'Sandbox' }).click();
}
