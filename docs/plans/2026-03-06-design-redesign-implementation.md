# Design Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the Warm Editorial redesign — new visual identity, navigation architecture (landing page + hamburger sidebar), settings split, and sticky keyboard.

**Architecture:** 7 sequential tasks that build on each other. Start with foundations (font, tokens, layout), then refactor components top-down (navbar → card → keyboard → settings), then add new features (landing page, sidebar). Each task is independently committable.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), Tailwind v4, shadcn-svelte 1.x (Sheet, Card, ToggleGroup), DM Serif Display (Google Fonts), Lucide icons.

**Reference mockups:** `docs/mockups/A-final.html`, `A5-nav-hamburger.html`, `A6-settings-incard.html`, `A6-settings-bottomsheet.html`, `A7-keyboard-sticky.html`

**Reference design:** `docs/plans/2026-03-06-design-redesign.md`

---

### Task 1: Add DM Serif Display font + update design tokens

**Files:**
- Modify: `src/app.html:5` (add Google Fonts link)
- Modify: `src/app.css:7-84` (update tokens)

**Step 1: Add Google Fonts link to app.html**

In `src/app.html`, add inside `<head>` before `%sveltekit.head%`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" rel="stylesheet">
```

**Step 2: Update CSS tokens in `src/app.css`**

In `:root`, update these tokens:

```css
/* Replace --font with two font stacks */
--font: 'Inter', system-ui, sans-serif;
--font-display: 'DM Serif Display', Georgia, serif;

/* Update border color to warmer tone */
--border-key: #E8E0D4;
--border-subtle: #E8E0D4;

/* Update text-muted to warmer tone */
--text-muted: #8A8078;

/* Add new card tokens */
--shadow-card: 0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04);
--shadow-card-hover: 0 12px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06);
--radius-card: 14px;
```

**Step 3: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add src/app.html src/app.css
git commit -m "🎨 style: add DM Serif Display font + update design tokens"
```

---

### Task 2: Redesign Navbar (hamburger + logo, blends into background)

**Files:**
- Modify: `src/lib/components/Navbar.svelte` (full rewrite)
- Modify: `src/routes/+layout.svelte` (remove gear click, simplify)
- Modify: `src/lib/i18n.svelte.ts` (add new i18n keys)

**Step 1: Add i18n keys**

In `src/lib/i18n.svelte.ts`, add to both `en` and `fr` sections:

```ts
// en
'nav.menu': 'Menu',

// fr
'nav.menu': 'Menu',
```

**Step 2: Rewrite Navbar.svelte**

Replace the entire `Navbar.svelte` with:

```svelte
<script lang="ts">
  import { t } from '$lib/i18n.svelte';

  let { onMenuClick = () => {} }: { onMenuClick?: () => void } = $props();
</script>

<nav class="navbar">
  <div class="nav-left">
    <button class="hamburger" onclick={onMenuClick} aria-label={t('nav.menu')}>
      <span></span><span></span><span></span>
    </button>
    <span class="logo">{t('app.title')}</span>
  </div>
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    display: flex;
    align-items: center;
    padding: 0 var(--sp-4);
    background: var(--bg);
    z-index: var(--z-drawer);
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
  }

  .logo {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--text);
  }

  .hamburger {
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    border-radius: 8px;
    transition: background var(--dur-base);
  }

  .hamburger:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .hamburger span {
    display: block;
    width: 18px;
    height: 2px;
    background: var(--text);
    border-radius: 1px;
  }
</style>
```

**Step 3: Update +layout.svelte**

Replace `src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import Navbar from '$lib/components/Navbar.svelte';
  import SettingsPanel from '$lib/components/SettingsPanel.svelte';
  import '../app.css';

  let sidebarOpen = $state(false);
  let { children } = $props();
</script>

<Navbar onMenuClick={() => (sidebarOpen = !sidebarOpen)} />
<Toaster />
{@render children()}
<SettingsPanel bind:open={sidebarOpen} />
```

Note: SettingsPanel will be rewritten in Task 5 to become the sidebar. For now it keeps working as-is (side="right" sheet).

**Step 4: Run check + tests**

Run: `pnpm run check && pnpm run test`
Expected: 0 errors, all tests pass

**Step 5: Run e2e tests**

Run: `pnpm run test:e2e`
Expected: Some tests may fail if they rely on gear button or specific nav selectors. Fix any broken selectors (the gear button is gone from the navbar — it now lives in the sidebar).

**Step 6: Commit**

```bash
git add src/lib/components/Navbar.svelte src/routes/+layout.svelte src/lib/i18n.svelte.ts
git commit -m "🍔 refactor: redesign navbar with hamburger + logo"
```

---

### Task 3: Redesign AmbianceCard (lifted shadow, DM Serif, no border)

**Files:**
- Modify: `src/lib/components/AmbianceCard.svelte:106-228` (styles section)

**Step 1: Update AmbianceCard styles**

In `src/lib/components/AmbianceCard.svelte`, replace the `<style>` block. Key changes:

- `.ambiance-card`: remove `box-shadow: var(--shadow-card)` and `min-width: 430px`, replace with:
  ```css
  :global(.ambiance-card) {
    overflow: hidden;
    gap: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    min-width: 460px;
    transition: box-shadow 0.25s ease, transform 0.25s ease;
  }

  @media (hover: hover) {
    :global(.ambiance-card:hover) {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
  }
  ```

- `.key`: add `font-family: var(--font-display);`
- `.mode`: add `font-family: var(--font-display);`

**Step 2: Run check**

Run: `pnpm run check`
Expected: 0 errors

**Step 3: Visual verification**

Run: `pnpm run dev`
Verify: card has no border, lifted shadow, hover lift on desktop, DM Serif on mode name and key letter.

**Step 4: Commit**

```bash
git add src/lib/components/AmbianceCard.svelte
git commit -m "🎨 style: redesign ambiance card with lifted shadow + serif headings"
```

---

### Task 4: Redesign PianoKeyboard (sticky bottom, black key shadows)

**Files:**
- Modify: `src/lib/components/PianoKeyboard.svelte:128-205` (styles section)
- Modify: `src/routes/+page.svelte:44-61` (layout styles)

**Step 1: Update PianoKeyboard styles**

In `src/lib/components/PianoKeyboard.svelte`, update the `<style>` block:

- `.keyboard-scroll`: add `position: sticky; bottom: 0; padding-bottom: 48px;`
- `.black` (base style): change `background` to:
  ```css
  .black {
    width: var(--black-w);
    height: var(--black-h);
    background: linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 100%);
    z-index: 2;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  ```
- `.black.in-scale`: keep `background: var(--key-scale-black);` (overrides gradient)
- `.black.pressed`: add `box-shadow: 0 3px 6px rgba(29, 78, 216, 0.3);` to match blue glow

**Step 2: Update +page.svelte layout**

In `src/routes/+page.svelte`, update the `<style>` block for `main`:

```css
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100dvh;
  padding: 52px 0 0;
}
```

Remove the `gap` and bottom padding — the keyboard sticks to the bottom naturally. The card should be vertically centered in the remaining space. Add a wrapper or use flex alignment:

```css
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100dvh;
  padding-top: 52px;
}

/* Center the card in the space above keyboard */
main > :global(:first-child) {
  flex: 1;
  display: flex;
  align-items: center;
}
```

Alternatively, wrap `AmbianceCard` + `MidiStatus` in a `<div class="content">` with `flex: 1; display: flex; align-items: center; justify-content: center;`.

**Step 3: Run check + visual verify**

Run: `pnpm run check`
Run: `pnpm run dev`
Verify: keyboard is sticky at bottom with 48px breathing room, card is centered above, black keys have shadow.

**Step 4: Run e2e**

Run: `pnpm run test:e2e`
Fix any broken tests (layout change may affect element positions).

**Step 5: Commit**

```bash
git add src/lib/components/PianoKeyboard.svelte src/routes/+page.svelte
git commit -m "🎹 style: sticky keyboard at bottom + black key shadows"
```

---

### Task 5: Refactor SettingsPanel into Sidebar (hamburger sidebar with global settings + exercise nav)

**Files:**
- Modify: `src/lib/components/SettingsPanel.svelte` (rewrite as sidebar)
- Modify: `src/lib/i18n.svelte.ts` (add sidebar i18n keys)
- Modify: `src/routes/+layout.svelte` (update prop name if needed)

**Step 1: Add i18n keys**

In `src/lib/i18n.svelte.ts`, add to both `en` and `fr`:

```ts
// en
'sidebar.exercises': 'Exercises',
'sidebar.settings': 'Settings',
'exercise.sandbox': 'Sandbox',
'exercise.sandbox.desc': 'Free improvisation over modes',
'exercise.scenes': 'Scene Prompt',
'exercise.scenes.desc': 'React to scene descriptions',
'exercise.ear': 'Ear Training',
'exercise.ear.desc': 'Identify intervals & chords',
'exercise.rhythm': 'Rhythm & Texture',
'exercise.rhythm.desc': 'Accompaniment patterns',
'badge.soon': 'Soon',

// fr
'sidebar.exercises': 'Exercices',
'sidebar.settings': 'Paramètres',
'exercise.sandbox': 'Sandbox',
'exercise.sandbox.desc': 'Improvisation libre sur les modes',
'exercise.scenes': 'Scène',
'exercise.scenes.desc': 'Réagir à des descriptions de scènes',
'exercise.ear': 'Oreille',
'exercise.ear.desc': 'Identifier intervalles et accords',
'exercise.rhythm': 'Rythme & Texture',
'exercise.rhythm.desc': "Patterns d'accompagnement",
'badge.soon': 'Bientôt',
```

**Step 2: Rewrite SettingsPanel.svelte as sidebar**

Convert `SettingsPanel.svelte` to use `Sheet` with `side="left"`. It should contain:

1. Exercise navigation list (Sandbox active, others greyed with "Soon" badge)
2. Separator
3. Global settings section (language, keyboard size, hints, notation)

Use shadcn Sheet component (`side="left"`). Keep ToggleGroup for settings chips.

Remove exercise-specific settings from here (interval, difficulty, mode pool, key pool) — these move to the ambiance card in Task 6.

**Step 3: Update +layout.svelte**

Ensure `sidebarOpen` state is passed correctly to the renamed sidebar.

**Step 4: Run check + e2e**

Run: `pnpm run check && pnpm run test:e2e`
Fix broken tests — settings selectors will have changed.

**Step 5: Commit**

```bash
git add src/lib/components/SettingsPanel.svelte src/lib/i18n.svelte.ts src/routes/+layout.svelte
git commit -m "🗄️ refactor: convert settings panel to hamburger sidebar with exercise nav"
```

---

### Task 6: Add exercise settings inside AmbianceCard (desktop) + bottom sheet (mobile)

**Files:**
- Modify: `src/lib/components/AmbianceCard.svelte` (add in-card settings panel)
- Create: `src/lib/components/ExerciseSettingsFab.svelte` (FAB + bottom sheet for mobile)
- Modify: `src/routes/+page.svelte` (render FAB on mobile)
- Modify: `src/lib/i18n.svelte.ts` (add keys)

**Step 1: Add i18n keys**

```ts
// en
'settings.exercise': 'Exercise settings',

// fr
'settings.exercise': "Paramètres de l'exercice",
```

**Step 2: Add in-card settings to AmbianceCard**

In `AmbianceCard.svelte`:

- Add a sliders icon button (Lucide `SlidersHorizontal`) in the card actions area (top-right, next to skip button)
- Add a collapsible `<div>` below the progression that contains: interval, difficulty, mode pool, key pool (same ToggleGroup chips as current SettingsPanel)
- Toggle visibility with a `let settingsOpen = $state(false)` local state
- Use `max-height` transition for animation
- Wrap in `class="desktop-only"` with `@media (max-width: 480px) { .desktop-only { display: none; } }`

Import needed:
```ts
import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
```

**Step 3: Create ExerciseSettingsFab.svelte**

Create `src/lib/components/ExerciseSettingsFab.svelte`:

- FAB button (bottom-right, `position: fixed`)
- On click, opens a bottom sheet (custom, not shadcn Sheet — it slides from bottom)
- Sheet contains same settings as the in-card version (interval, difficulty, modes, keys)
- Only visible at `max-width: 480px`
- Sheet has: drag handle, title, close button, settings chips
- Backdrop overlay behind sheet

**Step 4: Render FAB in +page.svelte**

```svelte
<ExerciseSettingsFab />
```

**Step 5: Run check + visual verify**

Run: `pnpm run check`
Run: `pnpm run dev`
Verify at desktop: sliders icon in card, settings expand below progression.
Verify at mobile width: FAB appears, bottom sheet slides up.

**Step 6: Run e2e**

Run: `pnpm run test:e2e`
Fix any broken settings tests.

**Step 7: Commit**

```bash
git add src/lib/components/AmbianceCard.svelte src/lib/components/ExerciseSettingsFab.svelte src/routes/+page.svelte src/lib/i18n.svelte.ts
git commit -m "⚙️ feat: add exercise settings in-card (desktop) + bottom sheet (mobile)"
```

---

### Task 7: Add landing page

**Files:**
- Modify: `src/routes/+page.svelte` (add landing/exercise conditional)
- Modify: `src/lib/i18n.svelte.ts` (add landing page keys)

**Step 1: Add i18n keys**

```ts
// en
'landing.title': 'What are we practicing?',
'landing.subtitle': 'Pick an exercise and play. Your MIDI keyboard is ready.',

// fr
'landing.title': 'On travaille quoi ?',
'landing.subtitle': 'Choisis un exercice et joue. Ton clavier MIDI est prêt.',
```

**Step 2: Add landing page view**

In `src/routes/+page.svelte`, add a state to track current view:

```ts
let currentExercise = $state<string | null>(null);
```

When `currentExercise` is `null`, show the landing page card grid. When it's `'sandbox'`, show the current sandbox view.

Landing page layout:
- Hero: h1 (DM Serif Display) + subtitle
- 2-column grid of exercise cards (Sandbox active, others disabled with "Soon" badge)
- Cards use the same lifted shadow treatment as AmbianceCard
- Clicking Sandbox sets `currentExercise = 'sandbox'`

Sandwich with `{#if currentExercise === null}` ... `{:else}` ... `{/if}`.

The hamburger sidebar (from Task 5) should also be able to switch exercises. Pass a callback or use a shared store.

**Step 3: Run check + visual verify**

Run: `pnpm run check`
Run: `pnpm run dev`
Verify: app opens to landing page, clicking Sandbox enters exercise view, hamburger can navigate back.

**Step 4: Run full test suite**

Run: `pnpm run test && pnpm run test:e2e`
Fix broken tests — e2e tests need to navigate past the landing page first. Update `page.goto` calls to click Sandbox card before testing exercise features.

**Step 5: Update docs**

Update `CLAUDE.md` project structure section to reflect new components and navigation architecture.

**Step 6: Commit**

```bash
git add src/routes/+page.svelte src/lib/i18n.svelte.ts CLAUDE.md
git commit -m "🏠 feat: add landing page with exercise card grid"
```

---

## Task Dependency Graph

```
Task 1 (tokens/font)
  └─▶ Task 2 (navbar)
  └─▶ Task 3 (card)
  └─▶ Task 4 (keyboard)
       └─▶ Task 5 (sidebar) ──▶ Task 6 (exercise settings) ──▶ Task 7 (landing page)
```

Tasks 2, 3, 4 can run in parallel after Task 1. Tasks 5–7 are sequential.

## E2E Test Impact

Most e2e tests will break at Task 7 (landing page) because they assume the sandbox is immediately visible. Update all `page.goto('/')` calls to include a click on the Sandbox card:

```ts
await page.goto('/', { waitUntil: 'networkidle' });
await page.getByText('Sandbox').click();
```

Consider extracting a helper: `async function enterSandbox(page: Page)`.
