# Settings Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move global settings from the sidebar Sheet into a dedicated `/settings` route, turning the sidebar into navigation-only.

**Architecture:** Create a new SvelteKit route at `/settings` containing the 4 global settings (language, keyboard size, hints, notation) plus MIDI status. Rename `SettingsPanel.svelte` to `SidebarNav.svelte`, strip out settings controls, add a "Settings" nav link. Update layout imports and e2e tests.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, shadcn-svelte ToggleGroup, Playwright e2e

---

### Task 1: Create the `/settings` page

**Files:**

- Create: `src/routes/settings/+page.svelte`

**Step 1: Create the settings page**

Create `src/routes/settings/+page.svelte` with the 4 global settings (language, keyboard size, hints, progression notation) and MIDI status. Style it consistently with the about page (centered, `max-width: 520px`).

```svelte
<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { settings } from '$lib/stores/settings.svelte';
	import type { KeyboardSize, ProgressionNotation } from '$lib/stores/settings.svelte';
	import { t, locale, type Locale } from '$lib/i18n.svelte';
	import MidiStatus from '$lib/components/MidiStatus.svelte';

	const KEYBOARD_SIZES: { value: KeyboardSize; label: string }[] = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' }
	];
</script>

<main class="settings-page">
	<div class="hero">
		<h1>{t('settings.title')}</h1>
	</div>

	<div class="settings-content">
		<section>
			<h3>{t('settings.language')}</h3>
			<ToggleGroup.Root
				type="single"
				value={locale.value}
				onValueChange={(v: string) => v && locale.set(v as Locale)}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="fr">FR</ToggleGroup.Item>
				<ToggleGroup.Item value="en">EN</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<section>
			<h3>{t('settings.keyboardSize')}</h3>
			<ToggleGroup.Root
				type="single"
				value={settings.value.keyboardSize}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, keyboardSize: v as KeyboardSize }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				{#each KEYBOARD_SIZES as size}
					<ToggleGroup.Item value={size.value}>{size.label}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
		</section>

		<section>
			<h3>{t('settings.hints')}</h3>
			<ToggleGroup.Root
				type="single"
				value={settings.value.showHints ? 'on' : 'off'}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, showHints: v === 'on' }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="on">{t('settings.hints.on')}</ToggleGroup.Item>
				<ToggleGroup.Item value="off">{t('settings.hints.off')}</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<section>
			<h3>{t('settings.progressionNotation')}</h3>
			<ToggleGroup.Root
				type="single"
				value={settings.value.progressionNotation}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, progressionNotation: v as ProgressionNotation }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="chord">{t('settings.notation.chord')}</ToggleGroup.Item>
				<ToggleGroup.Item value="roman">{t('settings.notation.roman')}</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<hr class="divider" />

		<section class="midi-section">
			<MidiStatus />
		</section>
	</div>
</main>
```

Style the page to match the about page layout:

- `.settings-page`: `display: flex; flex-direction: column; min-height: 100dvh;`
- `.hero`: centered, `padding: 80px var(--sp-6) var(--sp-6);` with the same `h1` font styling as about page
- `.settings-content`: `max-width: 520px; margin: 0 auto; padding: 0 var(--sp-6) 64px;` with `display: flex; flex-direction: column; gap: var(--sp-6);`
- `section`: `display: flex; flex-direction: column; gap: var(--sp-2);`
- `h3`: `font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted);`
- `.divider`: same as about page (`width: 60px; height: 2px; background: var(--border-subtle); margin: 0 auto; border: none;`)
- `.midi-section`: `display: flex; align-items: center; justify-content: center;`
- Responsive: at `max-width: 480px`, reduce hero padding to `60px var(--sp-4) var(--sp-4)` and content padding to `0 var(--sp-4) 48px`

**Step 2: Run check**

Run: `pnpm run check`
Expected: no errors

**Step 3: Manually verify in browser**

Run: `pnpm run dev` and navigate to `/settings`. Verify all 4 settings render with ToggleGroups and MIDI status shows at the bottom.

**Step 4: Commit**

```
feat: add /settings page with global settings and MIDI status
```

---

### Task 2: Rename SettingsPanel to SidebarNav and strip settings

**Files:**

- Rename: `src/lib/components/SettingsPanel.svelte` -> `src/lib/components/SidebarNav.svelte`
- Modify: `src/lib/components/SidebarNav.svelte` (remove settings, add Settings link)
- Modify: `src/routes/+layout.svelte` (update import)

**Step 1: Rename the file**

```bash
git mv src/lib/components/SettingsPanel.svelte src/lib/components/SidebarNav.svelte
```

**Step 2: Update the layout import**

In `src/routes/+layout.svelte`:

- Change `import SettingsPanel from '$lib/components/SettingsPanel.svelte'` to `import SidebarNav from '$lib/components/SidebarNav.svelte'`
- Change `<SettingsPanel bind:open={sidebarOpen} />` to `<SidebarNav bind:open={sidebarOpen} />`

**Step 3: Strip settings from SidebarNav**

In `src/lib/components/SidebarNav.svelte`:

Remove these imports (no longer needed):

- `* as ToggleGroup`
- `settings` store
- `KeyboardSize`, `ProgressionNotation` types

Remove the `KEYBOARD_SIZES` const.

Remove everything after the about link button and before the closing `</div>` of `.sections`:

- The `<hr class="sep">`
- The "Global settings" `<section>` header
- The language section
- The keyboard size section
- The hints section
- The progression notation section

Add a "Settings" link after the about link (same style as about link):

```svelte
<button
	class="about-link"
	class:active={$page.url.pathname === '/settings'}
	onclick={() => {
		void goto(resolve('/settings' as '/'));
		open = false;
	}}
>
	{t('sidebar.settings')}
</button>
```

Remove the `.sep` CSS rule (no longer used).

**Step 4: Run check**

Run: `pnpm run check`
Expected: no errors

**Step 5: Commit**

```
refactor: rename SettingsPanel to SidebarNav, move settings to /settings page
```

---

### Task 3: Update e2e tests

**Files:**

- Modify: `tests/settings.spec.ts`
- Modify: `tests/helpers.ts`

**Step 1: Add a `goToSettings` helper**

In `tests/helpers.ts`, add:

```ts
export async function goToSettings(page: Page) {
	await page.goto('/settings', { waitUntil: 'networkidle' });
}
```

**Step 2: Rewrite settings e2e tests**

Rewrite `tests/settings.spec.ts`. The settings are now on a dedicated page, not in the sidebar Sheet. The key changes:

- `openSettings` is replaced by navigating to `/settings`
- Settings changes are now on a separate page, so tests that check sandbox effects need to navigate back to `/sandbox` after changing settings
- The "hamburger opens settings panel" test becomes "settings page renders settings"
- The "Escape closes" test is removed (no Sheet to close)

```ts
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
			localStorage.removeItem('piano-settings');
		});
	});

	test('settings page renders all setting groups', async ({ page }) => {
		await goToSettings(page);
		await expect(page.getByText('Settings', { exact: true }).first()).toBeVisible();
		await expect(page.getByText('Language')).toBeVisible();
		await expect(page.getByText('Keyboard size')).toBeVisible();
		await expect(page.getByText('Display scales')).toBeVisible();
		await expect(page.getByText('Chord notation')).toBeVisible();
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
});
```

**Step 3: Run e2e tests**

Run: `pnpm run test:e2e`
Expected: all tests pass

**Step 4: Commit**

```
test: update e2e tests for settings page and sidebar navigation
```

---

### Task 4: Update docs

**Files:**

- Modify: `CLAUDE.md` (update project structure and component references)
- Modify: `README.md` (update project structure if it lists components)

**Step 1: Update CLAUDE.md**

In the project structure section:

- Change `SettingsPanel.svelte` to `SidebarNav.svelte` with updated comment: `# sidebar: exercise nav, about, settings link`
- Add `settings/+page.svelte` route: `# settings page: language, keyboard, hints, notation, MIDI`
- Update the `+layout.svelte` comment: `# app shell: Navbar, Toaster, SidebarNav`

In shadcn components in use, no changes needed (same components, different location).

**Step 2: Update README.md**

Update any reference to `SettingsPanel.svelte` to `SidebarNav.svelte` and add the `/settings` route.

**Step 3: Run `pnpm run check`**

Run: `pnpm run check`
Expected: no errors

**Step 4: Commit**

```
docs: update project structure for settings page migration
```
