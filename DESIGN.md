# Design Spec

**Version:** 0.1 — 2026-03-03

---

## Concept

Minimalist. Clean. The app gets out of the way so the music takes over.
The color palette is borrowed from the theatrical improv group's identity:
Canadian hockey parody — red, white, and blue. High contrast, no decoration.

---

## Color Palette

| Token               | Value     | Usage                                             |
| ------------------- | --------- | ------------------------------------------------- |
| `--bg`              | `#F7F4EF` | App background (warm off-white / cream)           |
| `--surface`         | `#FFFFFF` | Cards, panels                                     |
| `--text`            | `#1A1A1A` | Primary text                                      |
| `--text-muted`      | `#888888` | Secondary labels (texture hint, mood label)       |
| `--red`             | `#CC2936` | Brand red — scale highlight tint, accents         |
| `--blue`            | `#1D4ED8` | Brand blue — active/pressed key fill              |
| `--key-white`       | `#FFFFFF` | White piano keys (default)                        |
| `--key-black`       | `#1A1A1A` | Black piano keys (default)                        |
| `--key-scale-white` | `#F7CCCE` | White key in active scale (red tint ~20% opacity) |
| `--key-scale-black` | `#6B1A1E` | Black key in active scale (darkened red tint)     |
| `--key-pressed`     | `#1D4ED8` | Any key currently pressed (blue fill)             |

---

## Typography

**Font:** Inter (Google Fonts, self-hosted or CDN)
**Style:** Bold sans-serif throughout. All caps for mode name. Sentence case for details.

| Element        | Size     | Weight | Style                      |
| -------------- | -------- | ------ | -------------------------- |
| Mode name      | 2.5rem   | 800    | Uppercase                  |
| Key            | 1.5rem   | 700    | Uppercase                  |
| Texture / mood | 1rem     | 400    | Sentence case, muted color |
| Timer / labels | 0.875rem | 500    | Uppercase, letter-spaced   |
| Button text    | 0.875rem | 700    | Uppercase                  |

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    D · DORIAN                       │  ← mode name (2.5rem, bold)
│              sparse · pedal tone                    │  ← texture + mood (1rem, muted)
│                                                     │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ [ piano keyboard — full width, scrollable ]   │  │
│  │   scale keys: faint red tint                  │  │
│  │   pressed keys: blue fill                     │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Ambiance badge is **centered vertically** in the upper area
- Keyboard is **pinned to the bottom**, full width
- On mobile: keyboard is horizontally scrollable, octave range reduced

---

## Piano Keyboard

- **Style:** Flat / geometric. No gradients, no shadows, no skeuomorphism.
- **White keys:** tall rectangles, 1px gap between them
- **Black keys:** shorter dark rectangles overlapping white key gaps
- **Scale highlight:** faint red tint on keys belonging to the active mode — always visible, no toggle needed
- **Pressed highlight:** solid blue fill — appears on note-on, disappears on note-off
- **Pressed + in scale:** blue takes priority over the red tint
- **Pressed + out of scale:** also blue (no visual penalty for "wrong" notes in v1)

---

## Ambiance Badge

```
         D  ·  DORIAN
      sparse · pedal tone
        melancholic
```

- **Line 1:** `[KEY] · [MODE]` — large, bold, uppercase, `--text`
- **Line 2:** `[texture] · [texture hint]` — normal weight, `--text-muted`
- **Line 3:** emotional color label — small, `--text-muted`, italic optional
- No border, no card background — floats directly on the cream bg
- Fades in on ambiance change (200ms opacity transition)

---

## Autoadvance Toast

Slides up from the bottom when the interval ends. Does not cover the keyboard.

```
┌─────────────────────────────────────────────────────┐
│  [keyboard — fully visible]                         │
├─────────────────────────────────────────────────────┤
│  ████████████████░░░░  Next ambiance in 3s  [Snooze]│
└─────────────────────────────────────────────────────┘
```

- **Progress bar** on the left: fills left-to-right over 5s, color `--red`
- **Label:** "Next ambiance in Xs" — `0.875rem`, uppercase, `--text`
- **Snooze button:** right-aligned, outlined style, `--red` border and text
- Toast height: ~48px, background `--surface`, top border `1px solid #E5E5E5`
- Slide-up animation: 250ms ease-out

---

## Settings Panel

- Accessible via a small gear icon in the top-right corner
- Slides in from the right as a side panel (not a full-page route)
- Same cream background, minimal

---

## Motion & Transitions

| Event           | Animation                                           |
| --------------- | --------------------------------------------------- |
| Ambiance change | Badge fades out → new badge fades in (200ms each)   |
| Toast appears   | Slides up from bottom (250ms ease-out)              |
| Toast dismisses | Slides back down (200ms ease-in)                    |
| Key press       | Instant color change (0ms — no delay on MIDI input) |
| Key release     | Instant return to scale tint or default             |

No bouncing, no excessive animation. Everything is quick and functional.

---

## Responsive Breakpoints

| Breakpoint          | Behavior                                                          |
| ------------------- | ----------------------------------------------------------------- |
| Desktop (> 1024px)  | Full keyboard visible (A0–C8), badge centered above               |
| Tablet (600–1024px) | Keyboard scrollable, badge above, comfortable touch targets       |
| Mobile (< 600px)    | Keyboard scrollable (2–3 octaves visible), badge compact (1 line) |
