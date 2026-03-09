# Rhythm Display Enhancements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish the rhythm feature with accurate compound-time BPM display, beat grid sustain visualization, beat separators, resize-responsive notation, safe duration fallback, and a "Practice" button that bridges to sandbox.

**Architecture:** All changes are isolated to two route pages (`rhythm/+page.svelte`, `rhythm/[name]/+page.svelte`), the ambiance store, the i18n file, and the sandbox page. No new dependencies. The beat grid gains computed cell classes. A `ResizeObserver` drives reactive re-render. The ambiance store gains a `lockRhythm()` method that sandboxes can use via a URL param.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, VexFlow 3.0.9 (bundled), shadcn-svelte

---

### Task 1: Compound time BPM display

**Context:** The scheduler uses a 16th-note grid. For 6/8 and 12/8 patterns, `totalSteps = 12` or `24` instead of 16, so the scheduler BPM is multiplied by 1.5 to maintain the right feel. E.g. barcarolle `bpm: 108` sounds like `♩. = 72`. The list card and detail page header both show the raw `pattern.bpm`, which is misleading for musicians.

**Files:**

- Modify: `src/routes/rhythm/+page.svelte`
- Modify: `src/routes/rhythm/[name]/+page.svelte`

**Step 1: Add `musicalBpm` helper to the list page**

In `src/routes/rhythm/+page.svelte`, inside `<script lang="ts">`, add:

```ts
function musicalBpm(bpm: number, ts: [number, number]): { value: number; unit: string } {
	// Compound time (6/8, 12/8): scheduler bpm = 1.5 × dotted-quarter bpm
	if (ts[1] === 8) return { value: Math.round(bpm / 1.5), unit: '♩.' };
	return { value: bpm, unit: '♩' };
}
```

**Step 2: Update the list card meta display**

Find the card-meta span in `src/routes/rhythm/+page.svelte`:

```svelte
<span class="card-meta">{pattern.style} · ♩ = {pattern.bpm}</span>
```

Replace with:

```svelte
{@const mb = musicalBpm(pattern.bpm, pattern.timeSignature)}
<span class="card-meta">{pattern.style} · {mb.unit} = {mb.value}</span>
```

**Step 3: Add same helper + update eyebrow in detail page**

In `src/routes/rhythm/[name]/+page.svelte`, add the exact same `musicalBpm` function to `<script lang="ts">`.

Then find the eyebrow paragraph in the `{#if pattern !== null}` block:

```svelte
<p class="eyebrow">{pattern.style} · {pattern.timeSignature[0]}/{pattern.timeSignature[1]}</p>
```

Replace with:

```svelte
{@const mb = musicalBpm(pattern.bpm, pattern.timeSignature)}
<p class="eyebrow">
	{pattern.style} · {pattern.timeSignature[0]}/{pattern.timeSignature[1]} · {mb.unit} = {mb.value}
</p>
```

**Step 4: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

Expected: `0 ERRORS 3 WARNINGS` (the 3 warnings are pre-existing shadcn-svelte internals).

**Step 5: Visual verify**

Navigate to `/rhythm` — barcarolle shows `♩. = 72`, tarantella shows `♩. = 126`, shuffle shows `♩. = 108`. All 4/4 patterns show `♩ = <bpm>`.

**Step 6: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add src/routes/rhythm/+page.svelte "src/routes/rhythm/[name]/+page.svelte"
git commit -m "🎵 fix: show musical tempo (♩. for compound time) on rhythm pages"
```

---

### Task 2: Beat grid sustain visualization

**Context:** The beat grid currently shows dots only at note-start steps. A note lasting 8 steps looks identical to a 2-step note — you can't see syncopation or sustain. We'll shade "held" cells a lighter tint of the note's color.

**Files:**

- Modify: `src/routes/rhythm/[name]/+page.svelte`

**Step 1: Add sustain class to bass grid cells**

In the bass beat-grid `{#each}`, the cell currently has:

```svelte
class:bass-strong={pattern.bass.some((s) => s.step === i && s.velocity > 70)}
class:bass-weak={pattern.bass.some((s) => s.step === i && s.velocity <= 70)}
```

Add after those two lines:

```svelte
class:bass-sustain={pattern.bass.some((s) => i > s.step && i < s.step + s.duration)}
```

**Step 2: Add sustain class to chord grid cells**

In the chord beat-grid `{#each}`, after `class:chord-hit={...}`, add:

```svelte
class:chord-sustain={pattern.chords.some((s) => i > s.step && i < s.step + s.duration)}
```

**Step 3: Add CSS for sustain cells**

In the `<style>` block, after `.chord-track .cell.chord-hit`:

```css
.cell.bass-sustain {
	background: color-mix(in srgb, #cc2936 20%, transparent);
}
.chord-track .cell.chord-sustain {
	background: color-mix(in srgb, #1d4ed8 20%, transparent);
}
```

**Step 4: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

Expected: `0 ERRORS`.

**Step 5: Visual verify**

Navigate to `/rhythm/ballad` — bass has two long holds (8-step = half note); the 7 cells after each red dot should appear in a faint red tint. Navigate to `/rhythm/reggae` — chord sustains should be light blue after each blue dot.

**Step 6: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add "src/routes/rhythm/[name]/+page.svelte"
git commit -m "🎵 feat: show note sustain in beat grid"
```

---

### Task 3: Beat separators on the grid

**Context:** All 16 (or 12 or 24) cells look equally spaced. There's no visual cue for where beats fall. A vertical divider every N steps makes the rhythmic structure immediately readable — especially for syncopated patterns like reggae and samba.

Beat size in 16th-note steps:

- Simple time (denominator 4): quarter note = 4 steps (e.g. 4/4 → 4 steps/beat, 3/4 → 4 steps/beat, 2/4 → 4 steps/beat)
- Compound time (denominator 8): dotted quarter = 6 steps (e.g. 6/8 → 6 steps/beat, 12/8 → 6 steps/beat)

**Files:**

- Modify: `src/routes/rhythm/[name]/+page.svelte`

**Step 1: Add `beatSteps` derived value**

In `<script lang="ts">`, after the `steps` declaration:

```ts
const beatSteps = $derived(
	pattern ? (pattern.timeSignature[1] === 8 ? 6 : 16 / pattern.timeSignature[1]) : 4
);
```

**Step 2: Add `beat-start` class to bass grid cells**

In the bass beat-grid `{#each}`, add:

```svelte
class:beat-start={i > 0 && i % beatSteps === 0}
```

**Step 3: Add same class to chord grid cells**

Same addition in the chord beat-grid `{#each}`:

```svelte
class:beat-start={i > 0 && i % beatSteps === 0}
```

**Step 4: Add CSS**

In the `<style>` block, after `.cell` base rule:

```css
.cell.beat-start {
	box-shadow: inset 3px 0 0 color-mix(in srgb, var(--text) 22%, transparent);
}
```

`inset` ensures the shadow draws inside the cell and doesn't affect the grid layout or gap.

**Step 5: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

**Step 6: Visual verify**

- `/rhythm/tango` → 4 groups of 4 cells
- `/rhythm/waltz` → 3 groups of 4 cells
- `/rhythm/march` → 2 groups of 4 cells
- `/rhythm/barcarolle` → 2 groups of 6 cells

**Step 7: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add "src/routes/rhythm/[name]/+page.svelte"
git commit -m "🎵 feat: add beat separators to rhythm grid"
```

---

### Task 4: Window resize re-render for VexFlow

**Context:** `renderNotation()` reads `container.clientWidth` at render time. Rotating a phone or resizing the browser window leaves the staff clipped or too narrow. We add a `ResizeObserver` that updates a reactive width value, which the existing render `$effect` depends on.

**Files:**

- Modify: `src/routes/rhythm/[name]/+page.svelte`

**Step 1: Add reactive width state**

In `<script lang="ts">`, after `let bpm = $state(120);`:

```ts
let _notationWidth = $state(0);
```

**Step 2: Add ResizeObserver effect**

After the existing `$effect(() => { if (pattern) bpm = pattern.bpm; })`, add:

```ts
$effect(() => {
	if (typeof document === 'undefined') return;
	const el = document.getElementById('vf-notation');
	if (!el) return;
	const ro = new ResizeObserver((entries) => {
		_notationWidth = entries[0]?.contentRect.width ?? el.clientWidth;
	});
	ro.observe(el);
	return () => ro.disconnect();
});
```

**Step 3: Make the render effect depend on width**

Find the existing render `$effect`:

```ts
$effect(() => {
	const pat = pattern;
	const key = selectedKey;
	if (!pat) return;
```

Add `_notationWidth` as a tracked dependency (one line after `const key = selectedKey;`):

```ts
$effect(() => {
	const pat = pattern;
	const key = selectedKey;
	void _notationWidth; // reactive dep — re-renders on container resize
	if (!pat) return;
```

**Step 4: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

**Step 5: Visual verify**

Open `/rhythm/tango`, resize the browser window — the staff should reflow to fit the new width without clipping or leaving empty space.

**Step 6: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add "src/routes/rhythm/[name]/+page.svelte"
git commit -m "🎵 fix: re-render VexFlow notation on container resize"
```

---

### Task 5: `dur()` fallback safety

**Context:** `dur(n)` maps 16th-note step counts to VexFlow duration strings. Unknown counts (e.g. 5, 7, 9, 10) silently return `'16'`, which would produce wrong total tick counts and a runtime VexFlow voice error. We add `24` (whole bar in 12/8) to the map and log a clear error for anything unmapped.

**Files:**

- Modify: `src/routes/rhythm/[name]/+page.svelte`

**Step 1: Replace the `dur()` function**

Find:

```ts
function dur(n: number): string {
	const m: Record<number, string> = {
		1: '16',
		2: '8',
		3: '8d',
		4: 'q',
		6: 'qd',
		8: 'h',
		12: 'hd',
		16: 'w'
	};
	return m[n] ?? '16';
}
```

Replace with:

```ts
function dur(n: number): string {
	const m: Record<number, string> = {
		1: '16',
		2: '8',
		3: '8d',
		4: 'q',
		6: 'qd',
		8: 'h',
		12: 'hd',
		16: 'w',
		24: 'w' // full bar in 12/8 (4 dotted-quarter beats); VexFlow has no 'wd', treat as whole
	};
	const result = m[n];
	if (!result) {
		console.error(
			`[rhythm notation] unmapped duration: ${n} steps — defaulting to 16th. Extend dur() map.`
		);
		return '16';
	}
	return result;
}
```

Note: VexFlow 3 does not have a dotted-whole duration. `24` steps (whole bar in 12/8) is an edge case that no current pattern uses; the `w` fallback is better than a silent `16`.

**Step 2: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

**Step 3: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add "src/routes/rhythm/[name]/+page.svelte"
git commit -m "🎵 fix: warn on unmapped VexFlow duration, add 24-step entry"
```

---

### Task 6: "Practice this rhythm" bridge to sandbox

**Context:** The rhythm detail page is currently informational + playback only. We add a "Practice" button that navigates to `/sandbox?rhythm=<name>`. On arrival, the sandbox reads the param and calls `ambiance.lockRhythm()`, which overrides the current ambiance's rhythm and preserves it on auto-advance (until the sandbox is left).

The ambiance store (`src/lib/stores/ambiance.svelte.ts`) is very minimal — `_current` state + `next()` method. We add a `_lockedRhythm` state and a `lockRhythm()` method.

**Files:**

- Modify: `src/lib/stores/ambiance.svelte.ts`
- Modify: `src/routes/sandbox/+page.svelte`
- Modify: `src/routes/rhythm/[name]/+page.svelte`
- Modify: `src/lib/i18n.svelte.ts`

**Step 1: Add `lockRhythm` to ambiance store**

The current `ambiance.svelte.ts` is:

```ts
import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';

let _current = $state<Ambiance>(
	generateAmbiance(...)
);

export const ambiance = {
	get current() { return _current; },
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.moodPool, s.modePool, s.keyPool, s.difficultyPool, _current);
	}
};
```

Replace with (add `_lockedRhythm` state and update `next()` and add `lockRhythm()`):

```ts
import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';
import type { Rhythm } from '$lib/music/rhythms';

let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.moodPool,
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.difficultyPool
	)
);
let _lockedRhythm = $state<Rhythm | null>(null);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.moodPool, s.modePool, s.keyPool, s.difficultyPool, _current);
		if (_lockedRhythm) _current = { ..._current, rhythm: _lockedRhythm };
	},
	lockRhythm(rhythm: Rhythm | null): void {
		_lockedRhythm = rhythm;
		if (rhythm) _current = { ..._current, rhythm };
	}
};
```

**Step 2: Read the sandbox page's onMount/onDestroy to understand existing lifecycle**

The sandbox page already has `onMount` (wake lock) and `onDestroy` (wake lock release). We'll extend both.

**Step 3: Add URL param handling to sandbox page**

In `src/routes/sandbox/+page.svelte`, add to imports at top of `<script lang="ts">`:

```ts
import { page } from '$app/stores';
import { RHYTHM_PATTERNS } from '$lib/music/rhythmPatterns';
import type { Rhythm } from '$lib/music/rhythms';
```

In `onMount`, after `void requestWakeLock();`, add:

```ts
const rhythmParam = $page.url.searchParams.get('rhythm') as Rhythm | null;
if (rhythmParam && RHYTHM_PATTERNS[rhythmParam] !== undefined) {
	ambiance.lockRhythm(rhythmParam);
}
```

In `onDestroy`, before the closing `}` of the `if (typeof document !== 'undefined')` guard, add:

```ts
ambiance.lockRhythm(null);
```

**Step 4: Add "Practice" button to rhythm detail page**

In `src/routes/rhythm/[name]/+page.svelte`, in the `{#if pattern !== null}` block, after `<p class="desc">{pattern.description}</p>` and before the `<section class="notation-section">`, add:

```svelte
<a class="practice-btn" href="/sandbox?rhythm={name}">{t('rhythm.practice')}</a>
```

Add CSS in the `<style>` block:

```css
.practice-btn {
	display: inline-block;
	padding: 0.5rem 1.25rem;
	background: var(--text);
	color: #fff;
	border-radius: var(--radius-card);
	font-size: 0.75rem;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	text-decoration: none;
	transition: background var(--dur-base);
	align-self: flex-start;
}
.practice-btn:hover {
	background: #cc2936;
}
```

**Step 5: Add i18n keys**

In `src/lib/i18n.svelte.ts`, in the `en` translations object, after `'rhythm.backToAll'`:

```ts
'rhythm.practice': 'Practice'
```

In the `fr` translations object, after `'rhythm.backToAll'`:

```ts
'rhythm.practice': 'Pratiquer'
```

**Step 6: Run check**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training && pnpm run check
```

Expected: `0 ERRORS`.

**Step 7: Visual verify**

1. Navigate to `/rhythm/tango` — "Practice" button appears below description
2. Click it → lands on `/sandbox?rhythm=tango`
3. The ambiance card should show `TANGO` as rhythm
4. Click "skip" (next ambiance) — rhythm stays `TANGO`
5. Navigate away from sandbox, then back to sandbox without the param — rhythm is no longer locked

**Step 8: Commit**

```bash
cd /home/mania/perso/piano/.worktrees/rhythm-training
git add src/lib/stores/ambiance.svelte.ts src/routes/sandbox/+page.svelte "src/routes/rhythm/[name]/+page.svelte" src/lib/i18n.svelte.ts
git commit -m "🎵 feat: practice button bridges rhythm detail → sandbox with locked rhythm"
```

---

## Verification checklist

After all tasks:

```bash
pnpm run check   # 0 errors
pnpm run test    # all unit tests pass
```

Visual spot-check:

- [ ] `/rhythm` list: barcarolle shows `♩. = 72`, tango shows `♩ = 118`
- [ ] `/rhythm/ballad`: long red sustain cells visible in bass grid
- [ ] `/rhythm/tango`: vertical beat separators every 4 cells
- [ ] `/rhythm/barcarolle`: vertical beat separators every 6 cells
- [ ] Resize browser on any rhythm detail page → notation reflows
- [ ] `/rhythm/tango` → Practice → sandbox shows Tango rhythm → skip → still Tango
