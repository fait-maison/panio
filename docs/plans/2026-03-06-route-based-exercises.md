# Route-Based Exercise Navigation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Each exercise gets its own URL route so refreshing preserves the current view.

**Architecture:** Replace in-memory `exercise` store with SvelteKit file-based routing. Landing page at `/`, sandbox at `/sandbox`. Sidebar navigation uses `goto()` + `$page.url.pathname` for active state.

**Tech Stack:** SvelteKit 2 file-based routing, `$app/navigation` (`goto`), `$app/stores` (`page`)

---

### Task 1: Create sandbox route

**Files:**

- Create: `src/routes/sandbox/+page.svelte`

**Step 1: Create the sandbox page**

Extract the exercise view from `src/routes/+page.svelte` (lines 52-71) into a new route file. Move all sandbox-specific imports and logic.

```svelte
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';

	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';

	function skipAmbiance() {
		ambiance.next();
		timer.restart();
	}

	let hoveredChordNotes = $state<Set<number>>(new Set());
	let hoveredChordRoot = $state<number | null>(null);
	$effect(() => {
		ambiance.current;
		hoveredChordNotes = new Set();
		hoveredChordRoot = null;
	});

	onMount(() => midi.init());
	onDestroy(() => midi.destroy());
</script>

<main class="exercise">
	<div class="content">
		<AmbianceCard
			ambiance={ambiance.current}
			{timer}
			onChordHover={(notes, root) => {
				hoveredChordNotes = notes;
				hoveredChordRoot = root;
			}}
			onSkip={skipAmbiance}
		/>
	</div>
	<PianoKeyboard
		ambiance={ambiance.current}
		pressedNotes={midi.pressedNotes}
		hoverNotes={hoveredChordNotes}
		hoverRootNote={hoveredChordRoot}
	/>
</main>

<AutoadvanceToast {timer} onSnooze={() => timer.snooze()} />
```

Copy the exercise-view styles from `src/routes/+page.svelte` (lines 169-209: `.exercise`, `.content`, and their media queries).

**Step 2: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/sandbox/+page.svelte
git commit -m "feat: add /sandbox route with exercise view"
```

---

### Task 2: Trim landing page

**Files:**

- Modify: `src/routes/+page.svelte`

**Step 1: Remove exercise view, keep only landing page**

Remove the `{:else}` branch (lines 52-72), all sandbox-specific imports (`AmbianceCard`, `PianoKeyboard`, `AutoadvanceToast`, `ambiance`, `timer`, `midi`), and related logic (`skipAmbiance`, `hoveredChordNotes`, `hoveredChordRoot`, `onMount`, `onDestroy`).

Remove the `exercise` store import and the `{#if exercise.current === null}` / `{/if}` wrapper — the landing page markup is now unconditional.

Remove exercise-view styles (`.exercise`, `.content` and their media queries).

**Step 2: Convert active exercise cards to links**

Replace the button-based card with an `<a>` tag for active exercises, keep `<button disabled>` for inactive ones:

```svelte
<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { EXERCISES } from '$lib/exercises';
</script>

<main class="landing">
	<div class="hero">
		<h1>{t('landing.title')}</h1>
		<p>{t('landing.subtitle')}</p>
	</div>
	<div class="exercise-grid">
		{#each EXERCISES as ex}
			{#if ex.active}
				<a href="/{ex.key}" class="exercise-card">
					<span class="exercise-name">{t('exercise.' + ex.key)}</span>
					<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
				</a>
			{:else}
				<div class="exercise-card disabled">
					<span class="exercise-name">{t('exercise.' + ex.key)}</span>
					<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
					<span class="badge-soon">{t('badge.soon')}</span>
				</div>
			{/if}
		{/each}
	</div>
</main>
```

Keep all landing-page styles. Remove `.exercise` and `.content` style blocks.

**Step 3: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "refactor: trim landing page, link active exercises to routes"
```

---

### Task 3: Update sidebar navigation

**Files:**

- Modify: `src/lib/components/SettingsPanel.svelte`

**Step 1: Replace exercise store with URL-based navigation**

Replace `exercise` store import with SvelteKit navigation:

```svelte
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	// ... keep other imports, remove exercise store import
</script>
```

Update exercise list item active state (line 35):

```svelte
class:active={ex.active && $page.url.pathname === '/' + ex.key}
```

Update button onclick (line 41):

```svelte
onclick={() => {
	goto('/' + ex.key);
	open = false;
}}
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/components/SettingsPanel.svelte
git commit -m "refactor: sidebar uses goto() for exercise navigation"
```

---

### Task 4: Delete exercise store

**Files:**

- Delete: `src/lib/stores/exercise.svelte.ts`

**Step 1: Verify no remaining imports**

Run: `grep -r "exercise.svelte" src/`
Expected: no results (all references removed in tasks 2 and 3)

**Step 2: Delete the file**

```bash
rm src/lib/stores/exercise.svelte.ts
```

**Step 3: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove exercise store, URL is the state"
```

---

### Task 5: Update E2E test helper

**Files:**

- Modify: `tests/helpers.ts`

**Step 1: Update `enterSandbox` to navigate directly**

The helper currently clicks the Sandbox button on the landing page. Change it to navigate directly to `/sandbox`:

```ts
import type { Page } from '@playwright/test';

export async function enterSandbox(page: Page) {
	await page.goto('/sandbox', { waitUntil: 'networkidle' });
}
```

**Step 2: Run E2E tests**

Run: `pnpm run test:e2e`
Expected: all tests pass

**Step 3: Commit**

```bash
git add tests/helpers.ts
git commit -m "test: update enterSandbox helper to use /sandbox route"
```

---

### Task 6: Update CLAUDE.md project structure

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Update project structure section**

Update the routes section to reflect new structure:

```
src/
├── routes/
│   ├── +layout.svelte        # app shell: Navbar, Toaster, SettingsPanel
│   ├── +page.svelte           # landing page: exercise grid
│   └── sandbox/+page.svelte   # sandbox exercise: AmbianceCard + PianoKeyboard
```

Remove `exercise.svelte.ts` from stores listing.

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update project structure for route-based exercises"
```
