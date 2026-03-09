# E2E Test Expansion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add e2e coverage for in-card exercise settings and landscape phone viewport layout.

**Architecture:** Two additions — a new `describe` block appended to `tests/ambiance-card.spec.ts` (in-card settings, 6 tests), and a new `tests/ux.spec.ts` (viewport layout, 3 tests). No production code changes needed.

**Tech Stack:** Playwright, TypeScript. All tests use the `enterSandbox` helper from `tests/helpers.ts`.

---

## Context: Key facts

- **Gear button:** `aria-label="Exercise settings"` (English, set via `t('settings.exercise')`)
- **Panel element:** `.exercise-settings` — closed = `max-height: 0; overflow: hidden`, open = `.exercise-settings.open` (max-height: 600px)
- **Interval options** inside the in-card panel: `15s`, `1 min`, `3 min`, `5 min`, `10 min` — `type="single"` ToggleGroup → items use `role="radio"`
- **Mood/Mode/Key/Difficulty** pools: `type="multiple"` ToggleGroup → items have implicit `role="button"`
- **Lock pattern:** when a pool has 1 item, `data-lock-active` is set on the ToggleGroup.Root. CSS rule `[data-lock-active] [data-state='on'] { pointer-events: none }` prevents deselection.
- **Mode text** rendered as `t('mode.Dorian').toUpperCase()` → `'DORIAN'` in English locale
- **Key text** rendered as-is in `.badge .key`
- **localStorage keys:** `piano-settings` (JSON), `piano-locale` (string)
- **Default settings** spread-merged on load — any key you set in `piano-settings` overrides the default for that key only

---

## Task 1: In-card settings tests

**Files:**

- Modify: `tests/ambiance-card.spec.ts` (append at end of file)

### Step 1: Write the new describe block

Append to the bottom of `tests/ambiance-card.spec.ts`:

```ts
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
		// When open, the interval radio buttons inside become visible
		await expect(page.getByRole('radio', { name: '15s' })).toBeVisible();
	});

	test('gear button closes the settings panel on second click', async ({ page }) => {
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		await expect(page.getByRole('radio', { name: '15s' })).toBeVisible();
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		await expect(page.getByRole('radio', { name: '15s' })).not.toBeVisible();
	});

	test('changing interval in-card persists to localStorage', async ({ page }) => {
		await page.getByRole('button', { name: 'Exercise settings' }).click();
		await page.getByRole('radio', { name: '15s' }).click();
		const raw = await page.evaluate(() => localStorage.getItem('piano-settings'));
		const saved = JSON.parse(raw!);
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
		const saved = JSON.parse(raw!);
		expect(saved.moodPool).toEqual(['bright']);
	});
});
```

**Note on tests 4 and 5:** These have their own `addInitScript` call inside the test body. `addInitScript` in Playwright accumulates — scripts run in registration order. The `beforeEach` script removes `piano-settings`, but scripts registered _inside_ the test run after it (registration order matters for `page.goto`, not call order). To avoid the `beforeEach` wipe conflicting, these tests call `enterSandbox(page)` themselves after registering their script — which re-navigates with the new init script active. The `beforeEach` also calls `enterSandbox`, so the flow is: `beforeEach` navigates (with empty settings), then the test registers its own script and navigates again (now with restricted pool). This works correctly.

**Note on test 6:** Playwright's `.click()` respects `pointer-events: none` by default (it checks actionability). The `.catch(() => {})` handles the case where Playwright throws because the element is non-interactable — then we verify localStorage was not changed. Using `force: false` is the default but is explicit here for clarity.

### Step 2: Run the tests

```bash
pnpm run test:e2e -- --grep "in-card exercise settings"
```

Expected: all 6 tests pass. If a test fails:

- **Gear button tests fail:** check the `aria-label` of the gear button in `AmbianceCard.svelte` — it uses `t('settings.exercise')` which is `"Exercise settings"` in English.
- **Pool constraint tests fail:** the `beforeEach` `removeItem` and the in-test `setItem` are racing. Recheck the note above about `addInitScript` ordering.
- **Lock pattern test fails:** check that `data-lock-active` is correctly bound when `moodPool.length === 1` in `AmbianceCard.svelte`.

### Step 3: Run full svelte-check

```bash
pnpm run check
```

Expected: no type errors.

### Step 4: Commit

```bash
git add tests/ambiance-card.spec.ts
git commit -m "✅ e2e: test in-card exercise settings (gear toggle, interval, pool constraints, lock)"
```

---

## Task 2: Landscape phone viewport tests

**Files:**

- Create: `tests/ux.spec.ts`

### Step 1: Create the test file

```ts
import { test, expect } from '@playwright/test';

const LANDSCAPE_PHONE = { width: 667, height: 375 }; // iPhone SE landscape

test.describe('landscape phone viewport', () => {
	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem('piano-locale', 'en');
			localStorage.removeItem('piano-settings');
		});
		await page.setViewportSize(LANDSCAPE_PHONE);
		await page.goto('/sandbox', { waitUntil: 'networkidle' });
	});

	test('AmbianceCard is fully within the viewport vertically', async ({ page }) => {
		const box = await page.locator('.ambiance-card').boundingBox();
		expect(box).not.toBeNull();
		// Card bottom edge must not exceed viewport height
		expect(box!.y + box!.height).toBeLessThanOrEqual(LANDSCAPE_PHONE.height);
	});

	test('keyboard wrapper is visible without vertical scrolling', async ({ page }) => {
		const box = await page.locator('.keyboard-wrapper').boundingBox();
		expect(box).not.toBeNull();
		// Top edge of keyboard must be within the viewport (reachable without scrolling)
		expect(box!.y).toBeLessThan(LANDSCAPE_PHONE.height);
	});

	test('page has no vertical overflow', async ({ page }) => {
		const hasOverflow = await page.evaluate(
			() => document.documentElement.scrollHeight > window.innerHeight
		);
		expect(hasOverflow).toBe(false);
	});
});
```

### Step 2: Run the tests

```bash
pnpm run test:e2e -- --grep "landscape phone viewport"
```

Expected: all 3 tests pass. If a test fails:

- **Card not fully visible:** the `.ambiance-card` has a `min-width: 460px` which at 667px wide is within bounds, but vertically the card + keyboard may be too tall. The media query `@media (max-height: 500px)` in `sandbox/+page.svelte` and `AmbianceCard.svelte` is what compresses layout for landscape. If this test fails, there's a real layout bug to fix.
- **Keyboard not visible:** the keyboard might be pushed below the fold. Same root cause as above.
- **Page overflows:** same — the overflow test is the aggregate check.

### Step 3: Run full svelte-check

```bash
pnpm run check
```

Expected: no type errors (no production code changed).

### Step 4: Commit

```bash
git add tests/ux.spec.ts
git commit -m "✅ e2e: test landscape phone viewport (card and keyboard fully visible)"
```

---

## Final verification

Run the complete e2e suite to confirm no regressions:

```bash
pnpm run test:e2e
```

Expected: all tests pass (previously 26 + 9 new = 35 total).
