# Mood-Driven Rhythmic Ambiances — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the texture system with mood-driven generation where a mood is picked first, then compatible mode, rhythm, and progression are selected to ensure coherent ambiances.

**Architecture:** New `rhythms.ts` and `moods.ts` data modules feed into a rewritten `generateAmbiance()` that works top-down from mood. The `Ambiance` interface gains a `mood` field and swaps `texture` for `rhythm`. Settings gain a `moodPool` array. AmbianceCard displays mood as a new top line.

**Tech Stack:** SvelteKit 2 + Svelte 5 runes, TypeScript, tonal.js, vitest, Playwright

**Worktree:** `.worktrees/mood-driven-rhythms` (branch: `feature/mood-driven-rhythms`)

**Design doc:** `docs/plans/2026-03-07-mood-driven-rhythms-design.md`

---

### Task 1: Create rhythms data module

**Files:**

- Create: `src/lib/music/rhythms.ts`

**Step 1: Create the rhythms module**

```ts
export const RHYTHMS = [
	'waltz',
	'march',
	'bossa',
	'shuffle',
	'ballad',
	'rubato',
	'ostinato',
	'tango',
	'lullaby',
	'stride',
	'reggae',
	'blues',
	'funk',
	'bolero',
	'polka',
	'funeral-march',
	'minimalist',
	'nocturne',
	'fanfare',
	'barcarolle',
	'flamenco',
	'tarantella',
	'samba'
] as const;

export type Rhythm = (typeof RHYTHMS)[number];
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/lib/music/rhythms.ts
git commit -m "feat: add rhythms data module (23 rhythmic patterns)"
```

---

### Task 2: Create moods data module

**Files:**

- Create: `src/lib/music/moods.ts`

**Step 1: Create the moods module**

```ts
import type { Rhythm } from './rhythms';

export interface MoodInfo {
	name: string;
	modes: string[];
	rhythms: Rhythm[];
}

export const MOODS: MoodInfo[] = [
	{
		name: 'tense',
		modes: ['Phrygian', 'Locrian', 'Harmonic Minor'],
		rhythms: ['ostinato', 'tango', 'tarantella', 'flamenco']
	},
	{
		name: 'dark',
		modes: ['Phrygian', 'Locrian', 'Minor'],
		rhythms: ['funeral-march', 'nocturne', 'minimalist', 'ostinato']
	},
	{
		name: 'melancholic',
		modes: ['Dorian', 'Minor', 'Harmonic Minor'],
		rhythms: ['ballad', 'nocturne', 'waltz', 'blues', 'barcarolle']
	},
	{
		name: 'bright',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		rhythms: ['march', 'samba', 'polka', 'stride', 'fanfare']
	},
	{
		name: 'romantic',
		modes: ['Lydian', 'Dorian', 'Major'],
		rhythms: ['waltz', 'bossa', 'bolero', 'ballad', 'barcarolle']
	},
	{
		name: 'heroic',
		modes: ['Mixolydian', 'Major', 'Dorian'],
		rhythms: ['march', 'fanfare', 'ostinato', 'stride']
	},
	{
		name: 'playful',
		modes: ['Major', 'Mixolydian', 'Lydian'],
		rhythms: ['polka', 'shuffle', 'stride', 'reggae', 'samba', 'funk']
	},
	{
		name: 'mysterious',
		modes: ['Lydian', 'Phrygian', 'Locrian'],
		rhythms: ['rubato', 'minimalist', 'nocturne', 'barcarolle']
	},
	{
		name: 'dramatic',
		modes: ['Harmonic Minor', 'Phrygian', 'Minor'],
		rhythms: ['tango', 'flamenco', 'bolero', 'funeral-march']
	},
	{
		name: 'pastoral',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		rhythms: ['waltz', 'lullaby', 'ballad', 'reggae']
	}
];

export const ALL_MOOD_NAMES = MOODS.map((m) => m.name);
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/lib/music/moods.ts
git commit -m "feat: add moods data module (10 mood categories with mode/rhythm maps)"
```

---

### Task 3: Rewrite generator with mood-driven logic + tests

**Files:**

- Create: `src/lib/music/generator.test.ts`
- Modify: `src/lib/music/generator.ts`

**Step 1: Write failing tests for the new generator**

Create `src/lib/music/generator.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { generateAmbiance } from './generator';
import { MOODS, ALL_MOOD_NAMES } from './moods';
import { ALL_MODE_NAMES } from './modes';

describe('generateAmbiance', () => {
	it('returns an ambiance with all required fields', () => {
		const a = generateAmbiance(ALL_MODE_NAMES, ['C'], ALL_MOOD_NAMES, ['simple']);
		expect(a.mood).toBeDefined();
		expect(a.mood.name).toBeTruthy();
		expect(a.mode).toBeDefined();
		expect(a.mode.name).toBeTruthy();
		expect(a.key).toBe('C');
		expect(a.rhythm).toBeTruthy();
		expect(a.progression).toHaveLength(4);
	});

	it('picks a mode compatible with the chosen mood', () => {
		for (let i = 0; i < 20; i++) {
			const a = generateAmbiance(ALL_MODE_NAMES, ['C'], ALL_MOOD_NAMES, ['simple']);
			const mood = MOODS.find((m) => m.name === a.mood.name)!;
			expect(mood.modes).toContain(a.mode.name);
		}
	});

	it('picks a rhythm compatible with the chosen mood', () => {
		for (let i = 0; i < 20; i++) {
			const a = generateAmbiance(ALL_MODE_NAMES, ['C'], ALL_MOOD_NAMES, ['simple']);
			const mood = MOODS.find((m) => m.name === a.mood.name)!;
			expect(mood.rhythms).toContain(a.rhythm);
		}
	});

	it('respects mode pool filter', () => {
		for (let i = 0; i < 20; i++) {
			const a = generateAmbiance(['Major'], ['C'], ALL_MOOD_NAMES, ['simple']);
			expect(a.mode.name).toBe('Major');
		}
	});

	it('respects mood pool filter', () => {
		for (let i = 0; i < 20; i++) {
			const a = generateAmbiance(ALL_MODE_NAMES, ['C'], ['tense'], ['simple']);
			expect(a.mood.name).toBe('tense');
		}
	});

	it('avoids repeating the previous mood when possible', () => {
		const prev = generateAmbiance(ALL_MODE_NAMES, ['C', 'D', 'E'], ALL_MOOD_NAMES, ['simple']);
		let diffCount = 0;
		for (let i = 0; i < 20; i++) {
			const next = generateAmbiance(
				ALL_MODE_NAMES,
				['C', 'D', 'E'],
				ALL_MOOD_NAMES,
				['simple'],
				prev
			);
			if (next.mood.name !== prev.mood.name) diffCount++;
		}
		expect(diffCount).toBeGreaterThan(0);
	});

	it('falls back gracefully when mood/mode pools have no overlap', () => {
		// Only Locrian mode + only 'bright' mood (which wants Major/Lydian/Mixolydian)
		// Should still produce a valid ambiance via fallback
		const a = generateAmbiance(['Locrian'], ['C'], ['bright'], ['simple']);
		expect(a.mood).toBeDefined();
		expect(a.mode).toBeDefined();
		expect(a.rhythm).toBeTruthy();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm run test -- src/lib/music/generator.test.ts`
Expected: FAIL — current `generateAmbiance` has wrong signature and returns `texture` not `rhythm`

**Step 3: Rewrite generator.ts**

Replace the full contents of `src/lib/music/generator.ts` with:

```ts
import { MODES, KEYS, type ModeInfo } from './modes';
import { MOODS, type MoodInfo } from './moods';
import type { RomanProgression, Difficulty } from './progressions';
import { pickProgression } from './progressions';

export interface Ambiance {
	mood: MoodInfo;
	mode: ModeInfo;
	key: string;
	rhythm: string;
	progression: RomanProgression;
}

function pickRandom<T>(arr: T[], exclude?: T): T {
	const candidates = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
	const pool = candidates.length > 0 ? candidates : arr;
	return pool[Math.floor(Math.random() * pool.length)];
}

export function generateAmbiance(
	modePool: string[],
	keyPool: string[],
	moodPool: string[],
	difficultyPool: Difficulty[],
	previous?: Ambiance
): Ambiance {
	const resolvedKeys = keyPool.length > 0 ? keyPool : KEYS;
	const resolvedDifficulties =
		difficultyPool.length > 0 ? difficultyPool : (['simple'] as Difficulty[]);

	// 1. Filter moods by user's mood pool
	const availableMoods = MOODS.filter((m) => moodPool.includes(m.name));
	const resolvedMoods = availableMoods.length > 0 ? availableMoods : MOODS;

	// 2. Find moods that have at least one compatible mode in the user's mode pool
	const resolvedModeNames = modePool.length > 0 ? modePool : MODES.map((m) => m.name);
	const compatibleMoods = resolvedMoods.filter((mood) =>
		mood.modes.some((m) => resolvedModeNames.includes(m))
	);

	// Fallback: if no mood is compatible with mode pool, use all resolved moods
	const finalMoods = compatibleMoods.length > 0 ? compatibleMoods : resolvedMoods;

	// 3. Pick a mood (avoid repeating previous)
	const prevMoodName = previous?.mood.name;
	const mood = pickRandom(
		finalMoods,
		prevMoodName ? finalMoods.find((m) => m.name === prevMoodName) : undefined
	);

	// 4. Pick a mode from intersection of mood.modes and user's mode pool
	const moodModes = MODES.filter(
		(m) => mood.modes.includes(m.name) && resolvedModeNames.includes(m.name)
	);
	const resolvedMoodModes =
		moodModes.length > 0 ? moodModes : MODES.filter((m) => resolvedModeNames.includes(m.name));
	const mode = pickRandom(
		resolvedMoodModes,
		previous?.mode.name ? resolvedMoodModes.find((m) => m.name === previous.mode.name) : undefined
	);

	// 5. Pick a rhythm from mood's compatible rhythms
	const rhythm = pickRandom([...mood.rhythms], previous?.rhythm);

	// 6. Pick key and progression (unchanged logic)
	const key = pickRandom(resolvedKeys, previous?.key);
	const difficulty = pickRandom(resolvedDifficulties);
	const progression = pickProgression(mode.name, difficulty, previous?.progression);

	return { mood, mode, key, rhythm, progression };
}
```

**Step 4: Run tests**

Run: `pnpm run test -- src/lib/music/generator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/music/generator.ts src/lib/music/generator.test.ts
git commit -m "feat: mood-driven ambiance generation with tests"
```

---

### Task 4: Update settings, ambiance store, and scale test fixtures

**Files:**

- Modify: `src/lib/stores/settings.svelte.ts`
- Modify: `src/lib/stores/ambiance.svelte.ts`
- Modify: `src/lib/music/scale.test.ts`

**Step 1: Add moodPool to Settings**

In `src/lib/stores/settings.svelte.ts`:

Add import:

```ts
import { ALL_MOOD_NAMES } from '$lib/music/moods';
```

Add `moodPool: string[];` to the `Settings` interface (after `keyPool`).

Add `moodPool: ALL_MOOD_NAMES,` to `DEFAULT_SETTINGS` (after `keyPool`).

**Step 2: Update ambiance store to pass moodPool**

In `src/lib/stores/ambiance.svelte.ts`, update both `generateAmbiance` calls to pass `s.moodPool`:

```ts
let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.moodPool,
		settings.value.difficultyPool
	)
);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.modePool, s.keyPool, s.moodPool, s.difficultyPool, _current);
	}
};
```

**Step 3: Update scale.test.ts fixtures**

In `src/lib/music/scale.test.ts`:

Add import:

```ts
import { MOODS } from './moods';
```

Replace every `texture: ''` with `mood: MOODS[0], rhythm: ''` (lines 21, 29, 37, 44, 55).

Example — line 21:

```ts
const notes = getScaleNotes({
	mode: mode('Major'),
	key: 'C',
	mood: MOODS[0],
	rhythm: '',
	progression: []
});
```

**Step 4: Run all unit tests**

Run: `pnpm run test`
Expected: PASS (all 60 existing + 7 new generator tests)

**Step 5: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/stores/settings.svelte.ts src/lib/stores/ambiance.svelte.ts src/lib/music/scale.test.ts
git commit -m "feat: wire moodPool through settings and ambiance store"
```

---

### Task 5: Update i18n — remove textures, add rhythms and moods

**Files:**

- Modify: `src/lib/i18n.svelte.ts`

**Step 1: In the `en` dictionary**

Remove all 14 `texture.*` keys (lines 72-85). Replace with:

```ts
		// rhythms
		'rhythm.waltz': 'waltz',
		'rhythm.march': 'march',
		'rhythm.bossa': 'bossa nova',
		'rhythm.shuffle': 'shuffle',
		'rhythm.ballad': 'ballad',
		'rhythm.rubato': 'rubato',
		'rhythm.ostinato': 'ostinato',
		'rhythm.tango': 'tango',
		'rhythm.lullaby': 'lullaby',
		'rhythm.stride': 'stride',
		'rhythm.reggae': 'reggae',
		'rhythm.blues': 'blues',
		'rhythm.funk': 'funk',
		'rhythm.bolero': 'bolero',
		'rhythm.polka': 'polka',
		'rhythm.funeral-march': 'funeral march',
		'rhythm.minimalist': 'minimalist',
		'rhythm.nocturne': 'nocturne',
		'rhythm.fanfare': 'fanfare',
		'rhythm.barcarolle': 'barcarolle',
		'rhythm.flamenco': 'flamenco',
		'rhythm.tarantella': 'tarantella',
		'rhythm.samba': 'samba',
		// ambiance moods (distinct from mode mood descriptions like 'mood.Bright, safe')
		'ambianceMood.tense': 'tense',
		'ambianceMood.dark': 'dark',
		'ambianceMood.melancholic': 'melancholic',
		'ambianceMood.bright': 'bright',
		'ambianceMood.romantic': 'romantic',
		'ambianceMood.heroic': 'heroic',
		'ambianceMood.playful': 'playful',
		'ambianceMood.mysterious': 'mysterious',
		'ambianceMood.dramatic': 'dramatic',
		'ambianceMood.pastoral': 'pastoral',
		'settings.moods': 'Moods',
```

**Step 2: In the `fr` dictionary**

Remove all 14 `texture.*` keys (lines 146-159). Replace with:

```ts
		'rhythm.waltz': 'valse',
		'rhythm.march': 'marche',
		'rhythm.bossa': 'bossa nova',
		'rhythm.shuffle': 'shuffle',
		'rhythm.ballad': 'ballade',
		'rhythm.rubato': 'rubato',
		'rhythm.ostinato': 'ostinato',
		'rhythm.tango': 'tango',
		'rhythm.lullaby': 'berceuse',
		'rhythm.stride': 'stride',
		'rhythm.reggae': 'reggae',
		'rhythm.blues': 'blues',
		'rhythm.funk': 'funk',
		'rhythm.bolero': 'boléro',
		'rhythm.polka': 'polka',
		'rhythm.funeral-march': 'marche funèbre',
		'rhythm.minimalist': 'minimaliste',
		'rhythm.nocturne': 'nocturne',
		'rhythm.fanfare': 'fanfare',
		'rhythm.barcarolle': 'barcarolle',
		'rhythm.flamenco': 'flamenco',
		'rhythm.tarantella': 'tarentelle',
		'rhythm.samba': 'samba',
		'ambianceMood.tense': 'tendu',
		'ambianceMood.dark': 'sombre',
		'ambianceMood.melancholic': 'mélancolique',
		'ambianceMood.bright': 'lumineux',
		'ambianceMood.romantic': 'romantique',
		'ambianceMood.heroic': 'héroïque',
		'ambianceMood.playful': 'enjoué',
		'ambianceMood.mysterious': 'mystérieux',
		'ambianceMood.dramatic': 'dramatique',
		'ambianceMood.pastoral': 'pastoral',
		'settings.moods': 'Ambiances',
```

**Step 3: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/lib/i18n.svelte.ts
git commit -m "feat: replace texture i18n with rhythm and ambiance mood translations"
```

---

### Task 6: Update AmbianceCard — mood line, rhythm display, mood pool setting

**Files:**

- Modify: `src/lib/components/AmbianceCard.svelte`

**Step 1: Add mood import**

In the `<script>` block, add:

```ts
import { ALL_MOOD_NAMES } from '$lib/music/moods';
```

**Step 2: Add mood label above the badge**

In the template, before the `<Tooltip.Provider>` block (around line 102), insert:

```svelte
<div class="mood-label">{t('ambianceMood.' + ambiance.mood.name).toUpperCase()}</div>
```

**Step 3: Replace texture display with rhythm**

Change line 114 from:

```svelte
<div class="texture">{t('texture.' + ambiance.texture)}</div>
```

to:

```svelte
<div class="rhythm">{t('rhythm.' + ambiance.rhythm)}</div>
```

**Step 4: Add mood pool ToggleGroup in settings snippet**

In the `{#snippet settingsContent()}` block, add a new section **after** the interval section and **before** the difficulty section:

```svelte
<div class="settings-section">
	<h4>{t('settings.moods')}</h4>
	<ToggleGroup.Root
		type="multiple"
		value={settings.value.moodPool}
		onValueChange={(v) => v.length > 0 && settings.update((s) => ({ ...s, moodPool: v }))}
		variant="outline"
		class="w-full flex-wrap"
		data-lock-active={settings.value.moodPool.length === 1 ? '' : undefined}
	>
		{#each ALL_MOOD_NAMES as mood}
			<ToggleGroup.Item value={mood}>{t('ambianceMood.' + mood)}</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
```

**Step 5: Update CSS**

Rename `.texture` to `.rhythm` (keep same styles). Add `.mood-label`:

```css
.mood-label {
	font-size: 0.75rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	color: var(--text-muted);
}

.rhythm {
	font-size: 1rem;
	color: var(--text-muted);
	font-style: italic;
	letter-spacing: 0.02em;
}
```

Delete the old `.texture` CSS rule.

**Step 6: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 7: Commit**

```bash
git add src/lib/components/AmbianceCard.svelte
git commit -m "feat: display mood and rhythm in AmbianceCard with mood pool setting"
```

---

### Task 7: Delete textures.ts

**Files:**

- Delete: `src/lib/music/textures.ts`

**Step 1: Delete the file**

```bash
rm src/lib/music/textures.ts
```

**Step 2: Verify no remaining references**

Run: `grep -r "textures" src/ --include="*.ts" --include="*.svelte"`
Expected: No matches (or only the design doc)

**Step 3: Run check + tests**

Run: `pnpm run check && pnpm run test`
Expected: PASS

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete textures.ts (replaced by rhythms + moods)"
```

---

### Task 8: Update e2e tests

**Files:**

- Modify: `tests/ambiance-card.spec.ts`

**Step 1: Update test selectors**

Change the test on line 13:

- Rename from `'shows key, mode, texture and chord chips on load'` to `'shows mood, key, mode, rhythm and chord chips on load'`
- Change `page.locator('.texture')` to `page.locator('.rhythm')`
- Add: `await expect(page.locator('.mood-label')).toBeVisible();`

**Step 2: Run e2e tests**

Run: `pnpm run test:e2e`
Expected: PASS

**Step 3: Commit**

```bash
git add tests/ambiance-card.spec.ts
git commit -m "test: update e2e tests for mood + rhythm selectors"
```

---

### Task 9: Update documentation

**Files:**

- Modify: `CLAUDE.md`
- Modify: `DESIGN.md`

**Step 1: Update CLAUDE.md project structure**

In the project structure section, replace the `textures.ts` line with:

```
│   │   ├── rhythms.ts          # rhythm definitions (23 rhythmic patterns)
│   │   ├── moods.ts            # mood definitions with mode/rhythm compatibility
```

Update `generator.ts` comment to: `# mood-driven ambiance generator`

Update `ambiance.svelte.ts` comment to: `# current mood + mode + key + rhythm`

**Step 2: Update DESIGN.md ambiance badge section**

Update the badge layout to show the new hierarchy:

```
        TENSE
     D  ·  PHRYGIAN
       ostinato
```

Update line 2 of the badge description: rhythm replaces texture.

**Step 3: Final verification**

Run: `pnpm run check && pnpm run test && pnpm run test:e2e`
Expected: ALL PASS

**Step 4: Commit**

```bash
git add CLAUDE.md DESIGN.md
git commit -m "docs: update CLAUDE.md and DESIGN.md for mood-driven rhythms"
```
