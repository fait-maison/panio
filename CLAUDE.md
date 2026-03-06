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
```

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte        # app shell: Navbar, Toaster, SettingsPanel
│   ├── +page.svelte          # landing page: exercise grid
│   └── sandbox/+page.svelte  # sandbox exercise: AmbianceCard + PianoKeyboard
├── lib/
│   ├── components/
│   │   ├── Navbar.svelte           # top bar: Panio logo, nav items, gear
│   │   ├── AmbianceCard.svelte     # mode + key + texture + progression
│   │   ├── PianoKeyboard.svelte    # on-screen keyboard, MIDI highlighting
│   │   ├── AutoadvanceToast.svelte # countdown toast (custom, not Sonner)
│   │   ├── SettingsPanel.svelte    # Sheet-based settings UI
│   │   ├── MidiStatus.svelte       # MIDI device indicator + picker
│   │   └── ui/                     # shadcn-svelte components
│   ├── stores/
│   │   ├── ambiance.svelte.ts  # current mode + key + texture
│   │   ├── timer.svelte.ts     # interval countdown, autoadvance
│   │   ├── settings.svelte.ts  # user prefs (localStorage)
│   │   └── midi.svelte.ts      # Web MIDI API wrapper
│   ├── music/
│   │   ├── modes.ts            # mode definitions, mood map
│   │   ├── scale.ts            # scale note calculations
│   │   ├── progressions.ts     # chord progression pools by mode/difficulty
│   │   ├── textures.ts         # texture definitions (14 textures)
│   │   └── generator.ts        # ambiance generator
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
:global([data-lock-active] [data-state='on']) { pointer-events: none; }
```
- Single-select: always add `data-lock-active` on Root
- Multi-select: `data-lock-active={pool.length === 1 ? '' : undefined}`

## Key Patterns

### Svelte 5 Proxy gotcha

`$state` wraps objects in Proxy — never compare by reference (`!==`).
Always compare by value property (e.g. `mode.name`).

### Stores

All stores use Svelte 5 runes pattern (not legacy stores):
```ts
let _value = $state<T>(initial);
export const store = {
    get value() { return _value; },
    update(fn: (v: T) => T) { _value = fn(_value); }
};
```

### Settings persistence

Settings stored in `localStorage` key `piano-settings`. On load, spread-merged with
`DEFAULT_SETTINGS` to handle new keys gracefully.

## Deployment

- **Image:** `ghcr.io/fait-maison/panio`
- **Adapter:** `adapter-static` with `fallback: 'index.html'` (SPA mode for nginx)
- **Platform:** `linux/amd64` only (tailwindcss oxide crashes under QEMU arm64)
- **CI trigger:** push to `main` → build image; push `v*.*.*` tag → build + publish Helm chart
- **CI pipeline:** `test` (check + vitest + playwright) → `build` (docker) → `helm-release` (on tags)
- **Helm chart:** `helm/panio/`

## Conventions

- **Commit style:** gitmoji + lowercase title + bullet body. No co-author line.
- **Run `pnpm run check` after every code change** — don't ask, just do it.
- **Update docs before committing** — DESIGN.md, README.md, CLAUDE.md as relevant.
- **Run `/claude-md-management:revise-claude-md` before committing** when conventions, patterns, or project structure changed.
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

## Known Tech Debt

- `mode-watcher` dep is unused (no dark mode) — remove and hard-code `theme="light"` in sonner.svelte
- `@internationalized/date` devDep is never imported — safe to remove
- `nav.sandbox` i18n key defined but never used
- `data-lock-active` CSS rule duplicated in SettingsPanel + AmbianceCard — should be in app.css
- `timer.svelte.ts` calls `startInterval()` at module load with no browser guard
- Build-time deps (`tailwind-variants`, `tw-animate-css`, `tailwind-merge`, `clsx`) in `dependencies` instead of `devDependencies`

## App name

**Panio** — intentional spelling, not a typo.
