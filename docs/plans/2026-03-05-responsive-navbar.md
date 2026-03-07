# Responsive Layout + Navbar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a navbar with app branding and make the app usable on a 360px phone in portrait.

**Architecture:** Add a `Navbar.svelte` component in `+layout.svelte` (app-wide). Move settings gear into the navbar. Add CSS media queries for mobile breakpoints. Auto-scroll keyboard to middle C.

**Tech Stack:** SvelteKit, shadcn-svelte (Button, Separator, Sheet), Tailwind v4, CSS media queries.

---

### Task 1: Update i18n — rename app title + add nav labels

**Files:**

- Modify: `src/lib/i18n.svelte.ts`

**Step 1: Update translations**

In both `en` and `fr` translation objects:

```ts
// en:
'app.title': 'Panio',
'nav.sandbox': 'Sandbox',

// fr:
'app.title': 'Panio',
'nav.sandbox': 'Bac à sable',
```

Change `'app.title': 'improv piano'` → `'app.title': 'Panio'` in `en`.
Change `'app.title': "piano d'impro"` → `'app.title': 'Panio'` in `fr`.
Add `'nav.sandbox'` key to both.

**Step 2: Update HTML title**

In `src/app.html`, add a `<title>` tag inside `<head>`:

```html
<title>Panio</title>
```

**Step 3: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 4: Commit**

```
feat: rename app title to Panio + add nav i18n keys
```

---

### Task 2: Create Navbar component

**Files:**

- Create: `src/lib/components/Navbar.svelte`

**Step 1: Create the component**

The navbar has three sections: logo left, nav center, gear right.
The gear button triggers the settings Sheet — it needs to accept an `onGearClick` prop
since the Sheet state will be managed by the parent.

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { t } from '$lib/i18n.svelte';
	import Settings from '@lucide/svelte/icons/settings';

	let { onGearClick = () => {} }: { onGearClick?: () => void } = $props();
</script>

<nav class="navbar">
	<span class="logo">{t('app.title')}</span>
	<div class="nav-items">
		<span class="nav-item active">{t('nav.sandbox')}</span>
	</div>
	<Button
		variant="ghost"
		size="icon"
		class="gear"
		onclick={onGearClick}
		aria-label={t('settings.title')}
	>
		<Settings size={20} />
	</Button>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--sp-4);
		background: var(--surface);
		border-bottom: 1px solid var(--border-subtle);
		z-index: var(--z-drawer);
	}

	.logo {
		font-size: 1.1rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		color: var(--text);
	}

	.nav-items {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}

	.nav-item {
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.nav-item.active {
		color: var(--text);
		font-weight: 700;
	}
</style>
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```
feat: add Navbar component with Panio branding
```

---

### Task 3: Refactor SettingsPanel — extract Sheet trigger

**Files:**

- Modify: `src/lib/components/SettingsPanel.svelte`

**Step 1: Add `open` prop to SettingsPanel**

The Sheet should be controlled externally via an `open` binding so the Navbar gear button
can open it. Remove the floating gear button from SettingsPanel.

Replace the `<script>` and template:

In the `<script>` block, add:

```ts
let { open = $bindable(false) }: { open?: boolean } = $props();
```

Change `<Sheet.Root>` to use the `bind:open` prop:

```svelte
<Sheet.Root bind:open>
```

Remove the `<Sheet.Trigger>` block entirely (the gear button SVG and its wrapper).

**Step 2: Remove the floating gear CSS**

Delete these CSS rules from the `<style>` block:

- `:global(.gear-btn)` (the entire rule)
- `:global(.gear-btn:hover)` (the entire rule)

**Step 3: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 4: Commit**

```
refactor: externalize SettingsPanel open state, remove floating gear
```

---

### Task 4: Wire Navbar + SettingsPanel in layout

**Files:**

- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+page.svelte`

**Step 1: Update +layout.svelte**

Add the Navbar and SettingsPanel to the layout. Wire the gear click to toggle the sheet.

```svelte
<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import '../app.css';

	let settingsOpen = $state(false);
</script>

<Navbar onGearClick={() => (settingsOpen = !settingsOpen)} />
<Toaster />
<slot />
<SettingsPanel bind:open={settingsOpen} />
```

**Step 2: Update +page.svelte**

- Remove the `<h1 class="app-title">` line
- Remove the `import SettingsPanel` and `<SettingsPanel />` usage
- Update `<main>` padding to account for navbar height (48px):

Change the `main` style from:

```css
padding: var(--sp-8) 0 6rem;
```

to:

```css
padding: calc(48px + var(--sp-4)) 0 6rem;
```

Delete the `.app-title` CSS rule.

**Step 3: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 4: Run tests**

Run: `pnpm run test`
Expected: PASS (unit tests don't test layout)

**Step 5: Commit**

```
feat: wire Navbar + SettingsPanel in layout, remove floating gear
```

---

### Task 5: Make AmbianceCard responsive

**Files:**

- Modify: `src/lib/components/AmbianceCard.svelte`

**Step 1: Remove min-width and add responsive styles**

In the `<style>` block, change the `.ambiance-card` rule:

Replace:

```css
:global(.ambiance-card) {
	overflow: hidden;
	gap: 0;
	padding: 0;
	box-shadow: var(--shadow-card);
	min-width: 430px;
}
```

With:

```css
:global(.ambiance-card) {
	overflow: hidden;
	gap: 0;
	padding: 0;
	box-shadow: var(--shadow-card);
	min-width: 430px;
}

@media (max-width: 480px) {
	:global(.ambiance-card) {
		min-width: unset;
		width: calc(100vw - 2rem);
	}

	.key {
		font-size: 1.25rem;
	}
	.mode {
		font-size: 1.4rem;
	}
	.separator {
		font-size: 1rem;
	}
	.texture {
		font-size: 0.875rem;
	}

	.card-content {
		padding: var(--sp-6) var(--sp-4) var(--sp-4);
	}
}
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```
fix: make AmbianceCard responsive for mobile viewports
```

---

### Task 6: Make page layout responsive

**Files:**

- Modify: `src/routes/+page.svelte`

**Step 1: Add mobile media query to main**

Add after the existing `main` CSS rule:

```css
@media (max-width: 480px) {
	main {
		padding: calc(48px + var(--sp-2)) var(--sp-2) 5rem;
		gap: var(--sp-4);
	}
}
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```
fix: reduce page padding and gap on mobile
```

---

### Task 7: Auto-scroll keyboard to middle C

**Files:**

- Modify: `src/lib/components/PianoKeyboard.svelte`

**Step 1: Add container ref and scroll logic**

In the `<script>` block, add:

```ts
import { tick } from 'svelte';

let scrollContainer = $state<HTMLDivElement | null>(null);
```

Add an `$effect` to scroll to middle C (MIDI 60) after keys render:

```ts
$effect(() => {
	// Re-run when scale changes (which means WHITE_W changed)
	WHITE_W;
	tick().then(() => {
		if (!scrollContainer) return;
		// Middle C is MIDI 60 — count white keys from MIDI_START to 60
		let whitesBefore = 0;
		for (let m = MIDI_START; m < 60; m++) {
			if (!BLACK_KEY_POSITIONS.has(m % 12)) whitesBefore++;
		}
		const targetLeft = whitesBefore * (WHITE_W + GAP);
		const center = targetLeft - scrollContainer.clientWidth / 2 + WHITE_W / 2;
		scrollContainer.scrollLeft = Math.max(0, center);
	});
});
```

**Step 2: Bind the container ref**

Change the `<div class="keyboard-scroll">` to:

```svelte
<div class="keyboard-scroll" bind:this={scrollContainer}>
```

**Step 3: Remove justify-content center**

In the `.keyboard-scroll` CSS rule, remove `justify-content: center;` — this prevents
scroll from working when the keyboard is wider than the container (flexbox centers the
overflow, making left side unreachable).

**Step 4: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 5: Run tests**

Run: `pnpm run test`
Expected: PASS

**Step 6: Commit**

```
feat: auto-scroll keyboard to center on middle C
```

---

### Task 8: Final verification + build

**Step 1: Run full check**

Run: `pnpm run check`
Expected: PASS

**Step 2: Run unit tests**

Run: `pnpm run test`
Expected: PASS

**Step 3: Run build**

Run: `pnpm run build`
Expected: PASS — `build/` contains `index.html`

**Step 4: Commit all remaining changes (if any)**

```
chore: responsive navbar + mobile layout complete
```
