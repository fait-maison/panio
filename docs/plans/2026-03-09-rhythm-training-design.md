# Rhythm Training — Design Doc

**Date:** 2026-03-09
**Status:** Approved

## Goal

Help the user internalize rhythmic grooves (e.g. "tango", "bossa nova") by hearing and
playing along with a piano left-hand comping pattern. Not precision evaluation — groove
literacy. The user hears the pattern, reads the notation, and plays along until the feel
is in their body.

## User Story

> As a theatrical improv pianist, I want to look up "tango" and immediately hear what
> left-hand pattern to play, so I can internalize the groove and recall it on stage.

## Design Decisions

| Decision      | Choice                                      | Rationale                                                |
| ------------- | ------------------------------------------- | -------------------------------------------------------- |
| Audio format  | Piano left-hand comping (soundfont-player)  | Avoids new dep; reuses existing audio context            |
| Tempo         | Default BPM per rhythm + user slider        | Defaults encode idiomatic feel; override for practice    |
| Key           | Default C, dropdown to change               | Independent of sandbox; C is the clearest key to read    |
| Navigation    | `/rhythm` list → `/rhythm/[name]` detail    | Clean SPA routing, bookmarkable, back-button friendly    |
| Scheduling    | `AudioContext.currentTime` lookahead        | Sample-accurate without Tone.js (deferred to v5)         |
| Pattern scope | 8–10 patterns at launch, rest "coming soon" | Ship something useful fast; patterns added incrementally |

## UI Direction

**Editorial A**: warm cream background (`#f5f0e8`), DM Serif Display for rhythm name,
Inter for UI. Three stacked sections on the detail page:

1. **Traditional notation** — VexFlow 3, bass clef, two colored voices (red = bass,
   blue = chord stabs), 1-bar loop
2. **Beat grid** — 16-step sequencer grid, same red/blue color coding, animated playhead
3. **Controls** — play/stop button, BPM slider (default per rhythm), key dropdown

Reference mockups: `docs/mockups/rhythm-A-notation.html`, `docs/mockups/rhythm-A-editorial.html`

## Architecture

### New files

```
src/
├── routes/
│   ├── rhythm/
│   │   ├── +page.svelte          # rhythm browser (grid of all 23)
│   │   └── [name]/
│   │       └── +page.svelte      # rhythm detail (notation + grid + playback)
├── lib/
│   ├── music/
│   │   └── rhythmPatterns.ts     # pattern definitions (bpm, steps, description)
│   └── stores/
│       └── rhythmPlayer.svelte.ts # Web Audio lookahead scheduler
```

### Modified files

```
src/lib/components/SidebarNav.svelte   # add "Rhythm" nav link
```

### Data model (`rhythmPatterns.ts`)

```ts
type PatternStep = {
	step: number; // 0–15 on a 16-step grid (1/16th note resolution)
	degree: number; // scale degree (1 = root, 5 = fifth)
	octave: number; // relative octave offset
	duration: number; // in steps
	velocity: number; // 0–127
};

type RhythmPattern = {
	bpm: number;
	timeSignature: [number, number]; // e.g. [4, 4], [3, 4]
	bass: PatternStep[];
	chords: PatternStep[];
	description: string; // plain-language explanation of the feel
} | null; // null = pattern not yet defined ("coming soon")
```

Each of the 23 rhythm keys in `src/lib/music/rhythms.ts` maps to a `RhythmPattern | null`.
Launch target: 8–10 patterns (tango, waltz, bossa nova, flamenco, ostinato, bolero,
shuffle, march). Remainder `null`.

### Audio scheduler (`rhythmPlayer.svelte.ts`)

Standard Web Audio lookahead pattern:

```
scheduleAhead() — called every ~25ms via setInterval
  ├── looks 100ms into the future
  ├── for each step in that window:
  │     └── soundfontPlayer.play(note, audioContext.currentTime + offset)
  └── advances internal clock
```

Exposes:

- `start(pattern, key, bpm)` — begins loop
- `stop()` — clears scheduler
- `setBpm(n)` — updates tempo live
- `currentStep: number` — reactive `$state` for beat grid playhead

Reuses the same soundfont instrument instance already loaded for the keyboard.
No second `AudioContext` — shares the existing one from `audio.ts`.

### `/rhythm` list page

Grid of rhythm cards (2 columns on mobile, 3 on tablet). Each card shows:

- Rhythm name (DM Serif Display)
- Style tag (e.g. "Argentine", "Brazilian")
- Default BPM

Cards with `null` pattern: dimmed, `pointer-events: none`, "coming soon" badge.

### `/rhythm/[name]` detail page

Three stacked sections:

1. **Header** — rhythm name, style, time signature, description
2. **Notation** — VexFlow 3 rendered SVG (bass clef, 2 voices, colored stems/beams)
3. **Beat grid** — 16-step grid (bass row + chord row), animated playhead
4. **Controls** — play/stop, BPM slider (pre-loaded with pattern default), key dropdown

Key dropdown: shadcn-svelte `Select` component, all 12 chromatic keys, defaults to C.
Changing key re-renders notation and updates scheduler root note.

Back link: "← All rhythms" → `/rhythm`

## Testing

### Unit (`src/lib/music/rhythmPatterns.test.ts`)

- All defined patterns have exactly 16 steps total coverage
- BPM in range 40–240
- `timeSignature` is a valid 2-tuple

### E2E (Playwright)

- Sidebar nav has "Rhythm" link
- `/rhythm` lists rhythm cards, Tango visible
- Clicking Tango navigates to `/rhythm/tango`
- Detail page renders: beat grid, notation container, play button, key selector
- Key selector defaults to C
- Changing key to D updates the display
- Play button toggles playhead on beat grid

## Out of Scope (deferred)

- Tone.js synthesis / swing humanization (v5)
- Drum/percussion audio layers
- MIDI input evaluation against the rhythm pattern
- Difficulty levels for rhythms
- i18n for rhythm descriptions (English only for now)
