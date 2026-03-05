# Panio

MIDI-driven practice tool for theatrical improv piano accompaniment.
Train the reflex to translate a scene or emotion into music instantly — like live film scoring.

## Tech Stack

- **SvelteKit 2** + TypeScript — full-stack SPA (no server routes)
- **Svelte 5** — runes syntax (`$state`, `$derived`, `$effect`, `$props`)
- **Tailwind v4** + **shadcn-svelte 1.x** (bits-ui 2.x) — design system
- **tonal.js** — music theory (modes, scales, keys, chords)
- **Web MIDI API** — native browser API, wrapped in a Svelte store
- **pnpm** — package manager
- No database, no backend API in v1

## Commands

```bash
pnpm run dev          # start dev server
pnpm run build        # production build (adapter-static → build/)
pnpm run check        # svelte-check (run after every code change)
pnpm run test         # vitest unit tests
pnpm run test:e2e     # playwright e2e tests
pnpm run preview      # preview production build
```

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte        # app shell: Navbar, Toaster, SettingsPanel
│   └── +page.svelte          # main page: AmbianceCard + PianoKeyboard
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
│   │   └── generator.ts        # ambiance generator
│   └── i18n.svelte.ts          # i18n (en/fr), locale store
├── app.css                     # Tailwind + design tokens
└── app.html                    # HTML shell
helm/panio/                     # Helm chart
Dockerfile                      # multi-stage: node:20-alpine → nginx:alpine
.github/workflows/              # CI: docker build + helm publish
```

## Design System

- Colors: oklch format in `src/app.css` `:root` block
- Custom tokens: `--sp-*` spacing, `--z-*` z-index, `--shadow-*`, `--dur-*`
- Piano tokens: `--border-key`, `--radius-key`, `--key-white`, `--key-black`, `--key-pressed`
- Accent red: `#CC2936` — scale tint, accents, progress bars
- Accent blue: `#1D4ED8` — pressed keys
- Font: Inter, bold sans-serif
- **Always prefer shadcn-svelte components** over custom HTML/CSS

### shadcn components in use

Sheet, ToggleGroup, Card, Sonner, Button, Separator, Tooltip, Toggle

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
- **Helm chart:** `helm/panio/`

## Conventions

- **Commit style:** gitmoji + lowercase title + bullet body. No co-author line.
- **Run `pnpm run check` after every code change** — don't ask, just do it.
- **Update docs before committing** — DESIGN.md, README, PRD as relevant.
- **No over-engineering** — YAGNI. No abstractions for one-time operations.
- **i18n:** all user-facing strings go through `t()` from `$lib/i18n.svelte`.

## Testing

### Unit tests (vitest)

- Config: `vitest.config.ts` (separate from `vite.config.ts`)
- Music logic tests in `src/lib/music/*.test.ts`

### E2E tests (Playwright)

- **Always use `waitUntil: 'networkidle'`** in `page.goto` — Vite serves Svelte components
  as dynamic imports after `load`.
- **Use `locator.blur()`** to leave focus groups, not Tab.
- **bits-ui roles:** `type="single"` → `role="radio"`, `type="multiple"` → implicit `button`.
- **Persistence tests** need their own `test.describe` with dedicated `addInitScript`.

## App name

**Panio** — intentional spelling, not a typo.
