# Panio Design Redesign

**Date:** 2026-03-06
**Status:** Approved

## Overview

Redesign of Panio's visual identity and navigation architecture. Moves from a flat utility
look to a "Warm Editorial" aesthetic — warm cream tones, serif headings, lifted cards, and
a real-instrument feel with the keyboard anchored at the bottom.

## Visual Style

### Warm Editorial

- **Background:** warm cream `#F5F0E8`
- **Surfaces:** off-white `#FFFDF9`
- **Accent red:** `#CC2936` (unchanged)
- **Accent blue:** `#1D4ED8` (unchanged, pressed keys)
- **Text:** `#1A1A1A` primary, `#8A8078` muted
- **Border:** `#E8E0D4`

### Typography

- **Headings (mode name, key letter, logo):** DM Serif Display (serif)
- **Body / UI:** Inter (unchanged)

### Card Treatment

- No border
- Strong lifted shadow: `0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)`
- Hover: lifts 2px + deeper shadow `0 12px 48px rgba(0,0,0,0.14)`
- Border radius: 14px
- Transition: `0.25s ease` on shadow and transform

### Keyboard

- Black keys: subtle gradient (`#1A1A1A` → `#2A2A2A`) + drop shadow
  `0 3px 6px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)`
- White keys: unchanged (`#FFFDF9`, 1px `#ccc` border, 4px bottom radius)
- Scale/pressed colors: unchanged

## Layout

### Keyboard Placement

- Sticky at bottom of viewport
- 48px padding below keys (breathing room)
- No visual separation (no border-top, no surface bar) — sits on the same cream background
- Card vertically centered in remaining space above keyboard

### Navbar

- Blends into cream background (same `--bg`, no border-bottom)
- Left: hamburger button + "Panio" logo (DM Serif Display)
- No gear icon in navbar — settings moved to sidebar
- Height: 52px

## Navigation Architecture

### Landing Page (`/`)

- Card grid of exercises (2-column on desktop, 1-column mobile)
- Each card: icon + title + description
- Active exercises clickable, future ones greyed with "Coming soon" badge
- Hero text: "What are we practicing?"
- Clicking a card navigates to full-screen exercise view

### In-Exercise Navigation

- **Hamburger sidebar** (overlay, slides from left)
  - Exercise list with icons and short descriptions
  - Global settings section at the bottom
  - Overlay backdrop dims content behind
  - Animated hamburger → X transition

## Settings Split

### Global Settings (in hamburger sidebar)

Applies everywhere, persisted in localStorage:

- Language (FR / EN)
- Keyboard size (S / M / L)
- Hints (on / off)
- Notation (chord names / roman numerals)

### Exercise Settings (context-specific)

Applies only to the current exercise, persisted per-exercise in localStorage:

- Interval (15s / 1 / 3 / 5 / 10 min)
- Difficulty pool (simple / rich / complex)
- Mode pool (7 modes)
- Key pool (12 keys)

#### Desktop / Tablet (>480px)

- Inside the ambiance card
- Sliders icon (top-right of card) toggles settings panel below the progression
- Animated expand/collapse with `max-height` transition

#### Mobile (≤480px)

- Bottom sheet triggered by FAB (floating action button, bottom-right)
- Sheet slides up from bottom with handle + close button
- Overlay backdrop behind sheet

## Mood Tag

- Not visible on card surface
- Accessible via tooltip on the mode badge (hover/tap on "D · DORIAN")
- Unchanged from current implementation

## Mockups

Reference mockups in `docs/mockups/`:

| File | What it shows |
|------|--------------|
| `A-final.html` | Full Warm Editorial style |
| `A2-card-shadows.html` | Card shadow comparison (A/B/C) |
| `A3-keyboard-styles.html` | Keyboard style comparison |
| `A4-nav-landing.html` | Landing page card grid |
| `A5-nav-hamburger.html` | Hamburger sidebar overlay |
| `A6-settings-incard.html` | Exercise settings inside card |
| `A6-settings-bottomsheet.html` | Exercise settings as bottom sheet (mobile) |
| `A7-keyboard-sticky.html` | Final keyboard placement (sticky, 48px padding) |

## Implementation Notes

- Add `DM Serif Display` via Google Fonts (or self-host)
- Card hover effect: only on desktop (use `@media (hover: hover)`)
- FAB + bottom sheet: only render at mobile breakpoint
- In-card settings: only render above mobile breakpoint
- Hamburger sidebar: can reuse shadcn Sheet component (side="left")
- Landing page: new route or conditional render on `+page.svelte`
- Settings store split: `globalSettings` vs `exerciseSettings` (or keep one store, split UI only)
