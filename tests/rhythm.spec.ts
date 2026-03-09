import { test, expect } from '@playwright/test';

// ── Sidebar navigation ────────────────────────────────────────────────────────

test.describe('sidebar rhythm navigation', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
		});
	});

	test('sidebar has a Rhythm & Texture exercise button', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.getByRole('button', { name: 'Menu' }).click();
		await expect(page.getByRole('button', { name: /rhythm/i })).toBeVisible();
	});

	test('clicking Rhythm & Texture navigates to /rhythm', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await page.getByRole('button', { name: 'Menu' }).click();
		await page.getByRole('button', { name: /rhythm/i }).click();
		await expect(page).toHaveURL('/rhythm');
	});
});

// ── /rhythm list page ─────────────────────────────────────────────────────────

test.describe('/rhythm list page', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
		});
		await page.goto('/rhythm', { waitUntil: 'networkidle' });
	});

	test('shows "tango" card text', async ({ page }) => {
		await expect(page.getByText('tango')).toBeVisible();
	});

	test('shows exactly 8 active (non-coming-soon) rhythm cards', async ({ page }) => {
		// Active cards are <a class="card"> (links), coming-soon are <div class="card coming-soon">
		const activeCards = page.locator('a.card');
		await expect(activeCards).toHaveCount(8);
	});

	test('clicking tango card navigates to /rhythm/tango', async ({ page }) => {
		await page.locator('a.card').filter({ hasText: 'tango' }).click();
		await expect(page).toHaveURL('/rhythm/tango');
	});
});

// ── /rhythm/tango detail page ─────────────────────────────────────────────────

test.describe('/rhythm/tango detail page', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
		});
		await page.goto('/rhythm/tango', { waitUntil: 'networkidle' });
	});

	test('renders the #vf-notation container', async ({ page }) => {
		await expect(page.locator('#vf-notation')).toBeVisible();
	});

	test('renders cells with class .cell.bass-strong', async ({ page }) => {
		await expect(page.locator('.cell.bass-strong').first()).toBeVisible();
	});

	test('renders cells with class .cell.chord-hit', async ({ page }) => {
		await expect(page.locator('.cell.chord-hit').first()).toBeVisible();
	});

	test('has a Play button', async ({ page }) => {
		await expect(page.locator('.play-btn')).toBeVisible();
		await expect(page.locator('.play-btn')).toHaveText('Play');
	});

	test('key selector shows C as default', async ({ page }) => {
		// Select.Trigger renders the current value — look for the trigger button showing "C"
		const trigger = page.locator('button.key-trigger');
		await expect(trigger).toContainText('C');
	});

	test('back link navigates to /rhythm', async ({ page }) => {
		await page.locator('a.back-link').click();
		await expect(page).toHaveURL('/rhythm');
	});

	test('Play button text changes to Stop after click', async ({ page }) => {
		const btn = page.locator('.play-btn');
		await expect(btn).toHaveText('Play');
		await btn.click();
		await expect(btn).toHaveText('Stop');
	});

	test('changing key to D updates SVG content in #vf-notation', async ({ page }) => {
		// Capture initial SVG content
		const svgBefore = await page.locator('#vf-notation svg').innerHTML();

		// Open the key selector and pick D
		await page.locator('button.key-trigger').click();
		await page.getByRole('option', { name: 'D', exact: true }).click();

		// Wait for VexFlow to re-render
		await page.waitForFunction(
			(before) => {
				const svg = document.querySelector('#vf-notation svg');
				return svg && svg.innerHTML !== before;
			},
			svgBefore,
			{ timeout: 3000 }
		);

		const svgAfter = await page.locator('#vf-notation svg').innerHTML();
		expect(svgAfter).not.toEqual(svgBefore);
	});
});
