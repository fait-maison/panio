# E2E Test Expansion — Design

**Date:** 2026-03-09
**Branch:** feature/midi-settings

## Goal

Add e2e coverage for two untested areas:

1. In-card exercise settings (gear button collapsible in AmbianceCard)
2. Landscape phone viewport layout (AmbianceCard + keyboard visible without scrolling)

## File Structure

- **`tests/ambiance-card.spec.ts`** — append new `describe` block for in-card settings
- **`tests/ux.spec.ts`** — new file for viewport/layout tests

---

## Part 1 — In-card exercise settings

### Context

`AmbianceCard` has a gear button that toggles an in-card collapsible panel (desktop, >860px)
or a bottom sheet (mobile). The collapsible exposes: interval, mood pool, difficulty pool,
mode pool, key pool. None of this is currently tested.

### New `describe` block: `'in-card exercise settings'`

All tests run at the default Playwright viewport (1280×720 — desktop, collapsible shown).

| #   | Test                                              | Assertion                                                                  |
| --- | ------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | Gear button opens the settings panel              | `.exercise-settings.open` is visible                                       |
| 2   | Gear button closes on second click                | `.exercise-settings.open` not visible                                      |
| 3   | Changing interval saves to localStorage           | localStorage `piano-settings` has `intervalMin: 0.25` after clicking `15s` |
| 4   | Restricting mode pool to one mode constrains skip | pre-set `modePool: ['Dorian']`, skip → `.mode` text is `DORIAN`            |
| 5   | Restricting key pool to one key constrains skip   | pre-set `keyPool: ['C']`, skip → `.key` text is `C`                        |
| 6   | Lock pattern: last mood cannot be deselected      | pre-set `moodPool` to one mood, click that mood button, pool count stays 1 |

Tests 4–6 use `addInitScript` to pre-set `piano-settings` in localStorage before navigating.

---

## Part 2 — Landscape phone viewport (`ux.spec.ts`)

### Context

The sandbox page must display both the AmbianceCard and the piano keyboard without vertical
scrolling on a landscape phone. The keyboard can overflow horizontally (expected), but must
be vertically reachable.

### Viewport

**667×375** (iPhone SE landscape) — tightest common real-world case.

Each test: `page.setViewportSize({ width: 667, height: 375 })` before `goto('/sandbox')`.

| #   | Test                                             | Assertion                                                     |
| --- | ------------------------------------------------ | ------------------------------------------------------------- |
| 1   | AmbianceCard fully within viewport vertically    | `box.y + box.height ≤ 375`                                    |
| 2   | Keyboard wrapper visible without vertical scroll | `box.y < 375` (top edge in view)                              |
| 3   | No vertical overflow                             | `document.documentElement.scrollHeight <= window.innerHeight` |

Together these guarantee nothing is hidden, cut off, or requiring vertical scrolling.

---

## Out of scope

- Bottom sheet (mobile ≤860px) — separate concern, deferred
- Visual screenshot diffing — too brittle for now
- Other viewports (portrait phone, tablet) — deferred
