# About Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an `/about` page with storytelling layout (hero, narrative, credits) accessible via sidebar link.

**Architecture:** New SvelteKit route at `src/routes/about/+page.svelte` with scoped CSS using existing design tokens. Sidebar gets an "About" link below the exercise list. All text internationalized via `t()`.

**Tech Stack:** SvelteKit 2, Svelte 5, Tailwind v4, existing CSS custom properties

---

### Task 1: Add i18n translations

**Files:**

- Modify: `src/lib/i18n.svelte.ts`

**Step 1: Add EN translations**

Add to the `en` object after the `'badge.soon'` line:

```typescript
// about page
'about.tagline': 'Score the',
'about.tagline.accent': 'moment.',
'about.subtitle': 'Every improv scene deserves a live soundtrack.',
'about.story.p1': 'I play piano for theatrical improv groups. Every night, a new scene unfolds and I need to score it live \u2014 like a film composer with no script.',
'about.pullquote.l1': 'A love scene? Tender arpeggios.',
'about.pullquote.l2': 'A chase? Driving octaves.',
'about.pullquote.l3': 'The audience feels the shift before they understand it.',
'about.story.p2': 'But that reflex \u2014 translating an emotion into the right mode, the right texture, instantly \u2014 doesn\u2019t come naturally. It takes practice.',
'about.story.p3': 'Panio is the tool I built to train it. It throws random musical ambiances at you \u2014 a mode, a key, a texture \u2014 and you play. No evaluation. No scoring. Just you and the moment.',
'about.me.title': 'About me',
'about.me.bio': '[Your name here]. Pianist, improviser, and developer based in [city]. I\u2019ve been accompanying improv troupes for [N] years and building tools to scratch my own itches for even longer.',
'about.me.opensource': 'Panio is open source and built with love. Contributions welcome.',
'about.credits.title': 'Built with',
'sidebar.about': 'About',
```

**Step 2: Add FR translations**

Add to the `fr` object at the same position:

```typescript
// about page
'about.tagline': 'Scorer le',
'about.tagline.accent': 'moment.',
'about.subtitle': 'Chaque sc\u00e8ne d\u2019impro m\u00e9rite sa bande-son live.',
'about.story.p1': 'Je joue du piano pour des troupes d\u2019improvisation th\u00e9\u00e2trale. Chaque soir, une nouvelle sc\u00e8ne se d\u00e9roule et je dois la mettre en musique en direct \u2014 comme un compositeur de film sans sc\u00e9nario.',
'about.pullquote.l1': 'Une sc\u00e8ne d\u2019amour\u00a0? Arp\u00e8ges tendres.',
'about.pullquote.l2': 'Une poursuite\u00a0? Octaves percutantes.',
'about.pullquote.l3': 'Le public ressent le changement avant de le comprendre.',
'about.story.p2': 'Mais ce r\u00e9flexe \u2014 traduire une \u00e9motion dans le bon mode, la bonne texture, instantan\u00e9ment \u2014 ne vient pas naturellement. \u00c7a se travaille.',
'about.story.p3': 'Panio est l\u2019outil que j\u2019ai construit pour \u00e7a. Il te lance des ambiances musicales al\u00e9atoires \u2014 un mode, une tonalit\u00e9, une texture \u2014 et tu joues. Pas d\u2019\u00e9valuation. Pas de score. Juste toi et le moment.',
'about.me.title': '\u00c0 propos',
'about.me.bio': '[Ton nom ici]. Pianiste, improvisateur et d\u00e9veloppeur bas\u00e9 \u00e0 [ville]. J\u2019accompagne des troupes d\u2019impro depuis [N] ans et je construis des outils pour mes propres besoins depuis encore plus longtemps.',
'about.me.opensource': 'Panio est open source et construit avec amour. Contributions bienvenues.',
'about.credits.title': 'Construit avec',
'sidebar.about': '\u00c0 propos',
```

**Step 3: Run check**

Run: `pnpm run check`
Expected: PASS (no type errors)

**Step 4: Commit**

```
git add src/lib/i18n.svelte.ts
git commit -m "feat: add i18n translations for about page"
```

---

### Task 2: Create the about page route

**Files:**

- Create: `src/routes/about/+page.svelte`

**Step 1: Create the about page component**

Create `src/routes/about/+page.svelte` based on the mockup at `docs/mockups/about-C-full-width-story.html`, translating the static HTML into a Svelte component with:

- All text via `t()` calls
- CSS using existing design tokens (`--font-display`, `--text`, `--text-muted`, `--red`, `--surface`, `--border-subtle`, `--sp-*`, `--dur-*`)
- Scoped `<style>` block
- Responsive: reduce hero font size and spacing on mobile (`max-width: 480px`)
- Credits list: hardcoded tech names (not i18n — they're proper nouns)
- GitHub link: `https://github.com/fait-maison/panio`
- Version: hardcoded `v1.0.0` for now

Key structure:

```svelte
<script lang="ts">
	import { t } from '$lib/i18n.svelte';
</script>

<main class="about">
	<!-- hero -->
	<div class="hero">
		<h1>{t('about.tagline')} <span class="accent">{t('about.tagline.accent')}</span></h1>
		<p class="subtitle">{t('about.subtitle')}</p>
	</div>

	<hr class="divider" />

	<!-- story -->
	<div class="story">
		<p>{t('about.story.p1')}</p>
		<div class="pull-quote">
			{t('about.pullquote.l1')}<br />
			{t('about.pullquote.l2')}<br />
			{t('about.pullquote.l3')}
		</div>
		<p>{t('about.story.p2')}</p>
		<p>{t('about.story.p3')}</p>
	</div>

	<hr class="divider" />

	<!-- about me -->
	<div class="about-me">
		<h2>{t('about.me.title')}</h2>
		<p>{t('about.me.bio')}</p>
		<p class="muted">{t('about.me.opensource')}</p>
	</div>

	<!-- credits bar -->
	<footer class="credits-bar">
		<h2>{t('about.credits.title')}</h2>
		<div class="credits-row">
			SvelteKit · Tailwind CSS · tonal.js · soundfont-player · Web MIDI API · shadcn-svelte
		</div>
		<div class="footer-links">
			<a href="https://github.com/fait-maison/panio" target="_blank" rel="noopener">GitHub ↗</a>
			<span>·</span>
			<span>v1.0.0</span>
		</div>
	</footer>
</main>
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```
git add src/routes/about/+page.svelte
git commit -m "feat: add about page with storytelling layout"
```

---

### Task 3: Add sidebar "About" link

**Files:**

- Modify: `src/lib/components/SettingsPanel.svelte`

**Step 1: Add About link to sidebar**

After the exercise `</ul>` closing tag (line 57) and before the `</section>` (line 58), add an About button styled like the exercise items but as a standalone link:

After the closing `</section>` of the exercise navigation section (line 58), add:

```svelte
<!-- About link -->
<button
  class="about-link"
  class:active={$page.url.pathname === '/about'}
  onclick={() => {
    void goto(resolve('/about' as '/'));
    open = false;
  }}
>
  {t('sidebar.about')}
</button>
```

Add CSS for `.about-link` in the `<style>` block:

```css
.about-link {
	display: block;
	width: 100%;
	padding: var(--sp-2) var(--sp-3);
	border-radius: 8px;
	border: none;
	background: none;
	cursor: pointer;
	text-align: left;
	font-size: 0.9rem;
	font-weight: 600;
	color: var(--text-muted);
	transition:
		background var(--dur-base),
		color var(--dur-base);
}

.about-link:hover {
	background: rgba(0, 0, 0, 0.04);
	color: var(--text);
}

.about-link.active {
	background: rgba(0, 0, 0, 0.05);
	color: var(--text);
}
```

**Step 2: Run check**

Run: `pnpm run check`
Expected: PASS

**Step 3: Commit**

```
git add src/lib/components/SettingsPanel.svelte
git commit -m "feat: add about link to sidebar navigation"
```

---

### Task 4: E2E tests

**Files:**

- Create: `tests/about.spec.ts`

**Step 1: Write e2e tests**

```typescript
import { test, expect } from '@playwright/test';

test.describe('About page', () => {
	test('renders hero, story, and credits sections', async ({ page }) => {
		await page.goto('/about', { waitUntil: 'networkidle' });

		// Hero
		const heading = page.locator('h1');
		await expect(heading).toBeVisible();

		// Pull-quote
		const pullQuote = page.locator('.pull-quote');
		await expect(pullQuote).toBeVisible();

		// Credits bar
		const credits = page.locator('.credits-bar');
		await expect(credits).toBeVisible();
		await expect(credits).toContainText('SvelteKit');
	});

	test('is accessible from sidebar', async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		// Open sidebar
		await page.getByLabel('Menu').click();

		// Click About link
		const aboutLink = page.getByRole('button', { name: /about|à propos/i });
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
```

**Step 2: Run e2e tests**

Run: `pnpm run test:e2e -- tests/about.spec.ts`
Expected: 3 tests PASS

**Step 3: Commit**

```
git add tests/about.spec.ts
git commit -m "test: add e2e tests for about page"
```

---

### Task 5: Update docs

**Files:**

- Modify: `CLAUDE.md` (add `/about` route to project structure)

**Step 1: Update project structure in CLAUDE.md**

Add `about/+page.svelte` to the routes section:

```
├── routes/
│   ├── +layout.svelte        # app shell: Navbar, Toaster, SettingsPanel
│   ├── +page.svelte          # landing page: exercise grid
│   ├── about/+page.svelte    # about page: story, credits, links
│   └── sandbox/+page.svelte  # sandbox exercise: AmbianceCard + PianoKeyboard
```

**Step 2: Commit**

```
git add CLAUDE.md
git commit -m "docs: add about page route to project structure"
```

---

## Verification

1. `pnpm run check` — no type errors
2. `pnpm run lint` — no lint errors
3. `pnpm run test:e2e -- tests/about.spec.ts` — 3 tests pass
4. Manual: open `/about` in browser, check hero, story, credits render correctly
5. Manual: open sidebar, click "About", verify navigation works
6. Manual: switch language (FR/EN), verify all text updates
