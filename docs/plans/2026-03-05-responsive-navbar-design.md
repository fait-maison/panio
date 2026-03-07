# Responsive Layout + Navbar

## Context

The app needs to work on a phone (Samsung S10e, 360px viewport) in **portrait** orientation.
The user has a MIDI keyboard connected — the on-screen keyboard is a visual reference only,
not for tap-playing.

## Design

### Navbar

Fixed top bar replacing the floating gear button and `<h1>` title.

```
[Panio]    Sandbox                    [gear]
```

- **Left:** "Panio" — app name, bold, links to `/`
- **Center:** "Sandbox" — active nav item (only item for v1; v3 adds more)
- **Right:** Gear icon — triggers Settings Sheet
- Height: ~48px, `z-index: var(--z-drawer)`
- Background: `var(--surface)` with `border-bottom: 1px solid var(--border-subtle)`
- Use shadcn components where possible (Button for gear trigger)

### Responsive (portrait, <480px)

| Component        | Change                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| AmbianceCard     | Remove `min-width: 430px`, use `width: calc(100vw - 2rem)`, scale fonts down                            |
| PianoKeyboard    | Keep size `s`, remove `justify-content: center` from scroll container, auto-scroll to middle C on mount |
| Page `<main>`    | Reduce padding and gap, add `padding-top` for navbar clearance                                          |
| AutoadvanceToast | Already responsive (`min(420px, 100vw - 2rem)`)                                                         |
| Settings Sheet   | Already responsive (slides from right)                                                                  |
| MIDI status      | No change (fixed bottom-left)                                                                           |

### Keyboard scroll centering

The keyboard is ~990px wide at size `s`. On a 360px viewport, the initial view shows the
leftmost keys (A0). Instead, scroll to center on middle C (C4, MIDI 60).

Calculate `scrollLeft` to center MIDI 60 in the viewport:

```
scrollLeft = whiteKeyLeftPosition(C4) - (containerWidth / 2) + (whiteKeyWidth / 2)
```

Set via `$effect` watching the container element.

### App name change

- Title: "Panio" everywhere (navbar, `<title>`, i18n `app.title`)
- This is intentional branding, not a typo

### Files to modify

| File                                    | Change                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------- |
| New: `src/lib/components/Navbar.svelte` | Navbar with Panio, Sandbox, gear trigger                                    |
| `SettingsPanel.svelte`                  | Remove floating gear button, expose Sheet open state or accept trigger slot |
| `+page.svelte`                          | Remove `<h1>`, adjust `<main>` padding                                      |
| `+layout.svelte`                        | Add `<Navbar />` (app-wide)                                                 |
| `AmbianceCard.svelte`                   | Remove `min-width`, add mobile media query                                  |
| `PianoKeyboard.svelte`                  | Auto-scroll to middle C, remove center justification on mobile              |
| `src/app.css`                           | Add `@media (max-width: 480px)` adjustments if needed                       |
| i18n files                              | Update `app.title` to "Panio"                                               |
