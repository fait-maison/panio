import { test, expect } from '@playwright/test';

test.describe('About page', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			localStorage.removeItem('piano-settings');
		});
	});

	test('renders hero, story, and contribute sections', async ({ page }) => {
		await page.goto('/about', { waitUntil: 'networkidle' });

		// Hero
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();

		// Pull-quote
		const pullQuote = page.locator('.pull-quote');
		await expect(pullQuote).toBeVisible();

		// Contribute section
		const contribute = page.locator('.about-me');
		await expect(contribute).toBeVisible();
	});

	test('is accessible from sidebar', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		// Open sidebar
		await page.getByLabel('Menu').click();

		// Click About link
		const aboutLink = page.getByRole('button', { name: /about/i });
		await expect(aboutLink).toBeVisible();
		await aboutLink.click();

		// Should navigate to /about
		await page.waitForURL('**/about');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('GitHub link opens in new tab', async ({ page }) => {
		await page.goto('/about', { waitUntil: 'networkidle' });

		const link = page.locator('a[href*="github.com"]');
		await expect(link).toHaveAttribute('target', '_blank');
		await expect(link).toHaveAttribute('rel', /noopener/);
	});
});
