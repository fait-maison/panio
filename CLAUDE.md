# Panio

MIDI-driven practice tool for theatrical improv piano accompaniment.
Train the reflex to translate a scene or emotion into music instantly — like live film scoring.

## Tech Stack

- **SvelteKit 2** + TypeScript — full-stack SPA (no server routes)
- **Svelte 5** — runes syntax (`$state`, `$derived`, `$effect`, `$props`)
- **Tailwind v4** + **shadcn-svelte 1.x** (bits-ui 2.x) — design system
- **tonal.js** — music theory (modes, scales, keys, chords)
- **Web MIDI API** — native browser API, wrapped in a Svelte store
- **soundfont-player** — on-screen keyboard audio playback (Web Audio API)
- **pnpm** — package manager
- No database, no backend API

## Commands

```bash
pnpm run dev          # start dev server
pnpm run build        # production build (adapter-static → build/)
pnpm run check        # svelte-check (run after every code change)
pnpm run test         # vitest unit tests
pnpm run test:coverage # vitest with v8 coverage report
pnpm run test:e2e     # playwright e2e tests
pnpm run preview      # preview production build
pnpm run lint         # eslint on src/**/*.ts only (svelte files covered by check)
pnpm run lint:fix     # eslint with auto-fix
pnpm run format       # prettier (write)
pnpm run format:check # prettier (check only)
```

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte        # app shell: Navbar, Toaster, SidebarNav
│   ├── +page.svelte          # landing page: exercise grid
│   ├── about/+page.svelte    # about page: story, credits, links
│   ├── settings/+page.svelte # settings page: language, keyboard, hints, notation, MIDI
│   └── sandbox/+page.svelte  # sandbox exercise: AmbianceCard + PianoKeyboard
├── lib/
│   ├── components/
│   │   ├── Navbar.svelte           # top bar: Panio logo, nav items, gear
│   │   ├── AmbianceCard.svelte     # mood + mode + key + rhythm + progression
│   │   ├── PianoKeyboard.svelte    # on-screen keyboard, MIDI highlighting
│   │   ├── AutoadvanceToast.svelte # countdown toast (custom, not Sonner)
│   │   ├── SidebarNav.svelte       # sidebar: exercise nav, about, settings link
│   │   ├── MidiStatus.svelte       # MIDI device indicator + picker
│   │   └── ui/                     # shadcn-svelte components
│   ├── stores/
│   │   ├── ambiance.svelte.ts  # current mood + mode + key + rhythm
│   │   ├── timer.svelte.ts     # interval countdown, autoadvance
│   │   ├── settings.svelte.ts  # user prefs (localStorage)
│   │   └── midi.svelte.ts      # Web MIDI API wrapper
│   ├── music/
│   │   ├── modes.ts            # mode definitions
│   │   ├── moods.ts            # 10 moods with compatible modes + rhythms
│   │   ├── rhythms.ts          # 23 rhythmic pattern keys
│   │   ├── scale.ts            # scale note calculations
│   │   ├── progressions.ts     # chord progression pools, toChordSymbol/chordToRoman
│   │   └── generator.ts        # mood-driven ambiance generator
│   ├── audio.ts                # soundfont-player wrapper (on-screen keyboard audio)
│   ├── exercises.ts            # exercise definitions (sandbox, future exercises)
│   ├── utils.ts                # utility functions (cn helper)
│   └── i18n.svelte.ts          # i18n (en/fr), locale store
├── app.css                     # Tailwind + design tokens
└── app.html                    # HTML shell
helm/panio/                     # Helm chart
Dockerfile                      # multi-stage: node:22-alpine → nginx:alpine
.github/workflows/              # CI: test → docker build → helm publish
```

## Design System

- Colors: oklch format in `src/app.css` `:root` block
- Custom tokens: `--sp-*` spacing, `--z-*` z-index, `--shadow-*`, `--dur-*`
- Piano tokens: `--border-key`, `--radius-key`, `--radius-card`, `--key-white`, `--key-black`, `--key-pressed`, `--key-scale-white`, `--key-scale-black`, `--key-chord-white`, `--key-chord-black`
- Accent red: `#CC2936` — scale tint, accents, progress bars
- Accent blue: `#1D4ED8` — pressed keys
- Font: Inter, bold sans-serif
- **Always prefer shadcn-svelte components** over custom HTML/CSS

### shadcn components in use

Sheet, ToggleGroup, Card, Sonner, Tooltip, Slider

### ToggleGroup lock pattern

Prevents deselecting the last item in a group:

```css
:global([data-lock-active] [data-state='on']) {
	pointer-events: none;
}
```

- Single-select: always add `data-lock-active` on Root
- Multi-select: `data-lock-active={pool.length === 1 ? '' : undefined}`

## Key Patterns

### Svelte 5 Proxy gotcha

`$state` wraps objects in Proxy — never compare by reference (`!==`).
Always compare by value property (e.g. `mode.name`).

### SSR gotcha: `onDestroy` runs server-side

`onMount` is browser-only, but `onDestroy` runs during SSR too.
Guard any browser globals (`document`, `window`, `navigator`) in `onDestroy` with
`if (typeof document !== 'undefined')`. Same applies to module-level side effects in stores.

### Stores

All stores use Svelte 5 runes pattern (not legacy stores):

```ts
let _value = $state<T>(initial);
export const store = {
	get value() {
		return _value;
	},
	update(fn: (v: T) => T) {
		_value = fn(_value);
	}
};
```

### Settings persistence

Settings stored in `localStorage` key `piano-settings`. On load, spread-merged with
`DEFAULT_SETTINGS` to handle new keys gracefully.

### tonal.js Chord.detect() quirks

- Order-sensitive: first note = bass → slash chords. Sort MIDI notes by pitch before detecting.
- Ranks exotic qualities first (e.g. `Em#5` over `CM/E`). Prefer Major/Minor via `Chord.get(s).quality`.
- Returns `CM` for C major. Strip leading `M`/`^` to match app convention (`C`).
- 2-note detection is limited: perfect fifths work (C5), but most intervals (thirds, etc.) return `[]`.

## Deployment

- **Image:** `ghcr.io/fait-maison/panio`
- **Adapter:** `adapter-static` with `fallback: 'index.html'` (SPA mode for nginx)
- **Platform:** `linux/amd64` only (tailwindcss oxide crashes under QEMU arm64)
- **CI trigger:** push to `main` → build image; push `v*.*.*` tag → build + publish Helm chart
- **CI pipeline:** `lint` (format:check + eslint) → `test` (check + vitest + playwright) → `build` (docker) → `helm-release` (on tags)
- **Helm chart:** `helm/panio/`

## Conventions

- **Commit style:** gitmoji + lowercase title + bullet body. No co-author line.
- **Run `pnpm run check` after every code change** — don't ask, just do it.
- **Update docs before committing** — DESIGN.md, README.md, CLAUDE.md as relevant.
- **Run `/claude-md-management:revise-claude-md` before committing** when conventions, patterns, or project structure changed.
- **Formatting:** Prettier runs on commit via lint-staged. Run `pnpm run format` to format all files.
- **Linting:** ESLint (syntax-only, no type-aware rules) on `.ts` files only — fast (~3s). `.svelte` type checking handled by `pnpm run check`. Run `pnpm run lint` to check, `pnpm run lint:fix` to auto-fix.
- **No over-engineering** — YAGNI. No abstractions for one-time operations.
- **i18n:** all user-facing strings go through `t()` from `$lib/i18n.svelte`.
- **Use skills** — always invoke applicable skills before starting work (brainstorming, TDD, debugging, feature-dev, etc.). If there's even a 1% chance a skill applies, use it.
- **Use git worktrees** — for feature work that benefits from isolation, use the `using-git-worktrees` skill to create isolated worktrees instead of working directly on `main`.

## Library Documentation

Always use context7 to look up current documentation before:

- Using a library API you're unsure about
- Adding a new dependency or shadcn component
- Debugging framework-specific behavior
- Writing patterns involving Svelte runes, SvelteKit config, bits-ui, or tonal.js

This ensures code stays aligned with current library versions, not outdated training data.

## Testing

### Unit tests (vitest)

- Config: `vitest.config.ts` (separate from `vite.config.ts`)
- Music logic tests in `src/lib/music/*.test.ts`
- Coverage: `pnpm run test:coverage` (v8 provider via `@vitest/coverage-v8`)

### E2E tests (Playwright)

- **Always use `waitUntil: 'networkidle'`** in `page.goto` — Vite serves Svelte components
  as dynamic imports after `load`.
- **Use `locator.blur()`** to leave focus groups, not Tab.
- **bits-ui roles:** `type="single"` → `role="radio"`, `type="multiple"` → implicit `button`.
- **Persistence tests** need their own `test.describe` with dedicated `addInitScript`.
- **Cross-page tests** that change settings on `/settings` then verify on `/sandbox`:
  `addInitScript` runs on every `page.goto()`, so guard `localStorage.removeItem` with a
  `sessionStorage` flag to avoid wiping settings mid-test.

## App name

**Panio** — intentional spelling, not a typo.
