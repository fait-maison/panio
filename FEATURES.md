# Feature Proposals

Potential features for Panio, organized by category and estimated effort.

---

## 1. Complete Planned Exercises

### 1.1 Ear Training Exercise (`/ear`)

**Status:** Infrastructure ready (i18n keys, exercise entry exist), not built.

Train recognition of intervals, chords, and progressions by ear — the listening
complement to the sandbox's playing practice.

- **Interval ID**: Play two notes, identify the interval (minor 3rd, perfect 5th, etc.)
- **Chord ID**: Play a chord, identify its quality (major, minor, dim, aug, 7th)
- **Progression ID**: Play a 4-chord progression, identify the Roman numerals
- **Difficulty scaling**: Start with simple intervals, unlock more complex challenges
- **Scoring**: Track accuracy per category, show weak areas

Uses existing `tonal.js` for generation and `soundfont-player` for playback.
No new dependencies needed.

### 1.2 Scene/Context Exercise (`/scenes`)

**Status:** Infrastructure ready (i18n keys, exercise entry exist), not built.

React to theatrical scene prompts — the core "improv piano" training loop.

- **Scene prompt library**: 50+ prompts across genres (film noir, comedy, horror, romance, action)
- **Timed response**: Scene appears → player has N seconds to start playing
- **Mood suggestion**: After playing, reveal which mood/mode the scene maps to
- **Self-evaluation**: "How well did your music match?" (no AI grading needed)
- **Scene categories**: Film, theater, emotion, location, character, situation

This is the exercise most aligned with Panio's core mission of theatrical improv accompaniment.

---

## 2. Expand the Music Library

### 2.1 More Scales & Modes

Current: 8 modes (Major, Minor, Harmonic Minor, Dorian, Phrygian, Lydian, Mixolydian, Locrian).

Add:
- **Blues pentatonic** / **Major pentatonic** — essential for improvisation
- **Melodic minor** (ascending) — jazz standard
- **Whole tone** — dreamlike, Debussy-esque
- **Diminished** (half-whole / whole-half) — tension and suspense
- **Hungarian minor** — dramatic, cinematic
- **Phrygian dominant** — flamenco, Middle Eastern

Each new mode needs: scale definition, compatible moods, progression pools.

### 2.2 More Moods

Current: 10 moods (tense, dark, melancholic, bright, romantic, heroic, playful, mysterious, dramatic, pastoral).

Add:
- **Ethereal** — whole tone / lydian, slow tempos
- **Urgent** — fast phrygian / harmonic minor
- **Nostalgic** — mixolydian / dorian, medium tempo
- **Whimsical** — lydian / major, playful variations
- **Ominous** — locrian / diminished, very slow
- **Triumphant** — major / lydian, march-like

### 2.3 More Styles & Patterns

**Styles** (current: 10): Add Swing, Mambo, Salsa, Cha-cha, Blues, Rock Ballad, Funk, Bolero, Lullaby, Calypso.

**Patterns** (current: 4): Add Block Chords, Pedal Point, Tremolo, Broken Octaves, Fingerpicking.

---

## 3. Practice Tracking & Progress

### 3.1 Session Statistics

Track practice metrics in `localStorage` (no backend needed):

- **Total practice time** (daily / weekly / all-time)
- **Moods explored**: Which moods has the player practiced with?
- **Keys covered**: Heat map of practiced keys
- **Modes practiced**: Distribution across modes
- **Session history**: Date, duration, settings used

### 3.2 Practice Streaks

- Daily practice streak counter
- Visual calendar (GitHub-style contribution grid)
- Optional browser notification reminders

### 3.3 Ambiance Journal

- After each ambiance rotation, optionally save a self-rating (1-5 stars)
- Review past ambiances with ratings to identify strengths/weaknesses
- Filter journal by mood, mode, key, difficulty

---

## 4. Performance & Recording

### 4.1 MIDI Performance Recording

Record the player's MIDI input with timestamps:

- **Record/stop** button in sandbox
- **Playback** with piano roll visualization
- **Export as MIDI file** (.mid) for use in DAWs
- Store recordings in IndexedDB (no size limits vs localStorage)

### 4.2 Reference Comparison

- Play back a style/pattern reference alongside the user's recording
- Visual overlay: reference notes vs played notes on piano roll
- Timing accuracy feedback (ahead/behind the beat)

---

## 5. Theory & Learning Aids

### 5.1 Mode Characteristics Panel

Expandable info panel on AmbianceCard showing:

- Mode formula (e.g., "1 2 b3 4 5 6 b7" for Dorian)
- Characteristic note (what makes this mode unique)
- Common uses ("jazz, folk, melancholic but hopeful")
- Related modes ("Dorian is the 2nd mode of Major")

### 5.2 Chord Function Labels

Show harmonic function alongside progression chords:

- **T** (tonic), **SD** (subdominant), **D** (dominant)
- Color-coded on the progression display
- Helps players internalize why progressions "work"

### 5.3 Voice Leading Guide

- Show suggested voice leading between consecutive chords
- Highlight common tones (notes shared between chords)
- Overlay on piano keyboard: "move this finger here"

### 5.4 Interactive Circle of Fifths

- Visual circle of fifths on settings or sandbox page
- Click to select key, shows relative major/minor
- Highlights current mode's relationship to parallel modes

---

## 6. UX Enhancements

### 6.1 Dark Mode

CSS custom properties are already in place. Add:

- Theme toggle in settings (light / dark / system)
- Dark palette for piano keys, cards, backgrounds
- Persist preference in settings store

### 6.2 Keyboard Shortcuts

Global shortcuts for power users:

- **Space** — play/pause style playback
- **N** — next ambiance (skip)
- **S** — snooze timer
- **1-5** — quick mood select
- **?** — show shortcut overlay

### 6.3 Swipe Gestures (Mobile)

- Swipe left/right on AmbianceCard to skip to next/previous ambiance
- Swipe up to expand settings panel
- Swipe down to dismiss

### 6.4 Onboarding Tour

First-visit guided walkthrough:

- Highlight key UI elements (AmbianceCard, keyboard, settings)
- Explain the practice loop (mood → mode → key → play)
- Prompt MIDI connection
- 4-5 steps, dismissable, doesn't repeat

---

## 7. Sharing & Export

### 7.1 Share Ambiance

- "Share" button generates a URL with encoded ambiance parameters
- Recipient opens link → sandbox loads with that exact mood/mode/key/progression
- Uses URL query params (no backend needed)

### 7.2 PDF Lead Sheet Export

- Export current ambiance as a one-page lead sheet (PDF)
- Shows: key signature, mode, chord progression in notation
- Uses VexFlow (already in the project) to render

### 7.3 Custom Progression Builder

- Drag-and-drop Roman numeral chords to build custom progressions
- Save to settings as a "custom progression pool"
- Share custom progressions via URL

---

## Priority Recommendation

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| **P0** | Scene Exercise (1.2) | Medium | High — core mission |
| **P0** | Ear Training (1.1) | Medium | High — completes exercise set |
| **P1** | More Scales & Modes (2.1) | Low | High — enriches every exercise |
| **P1** | Session Statistics (3.1) | Low | Medium — retention driver |
| **P1** | Dark Mode (6.1) | Low | Medium — most-requested UX feature |
| **P2** | More Moods (2.2) | Very Low | Medium — easy content expansion |
| **P2** | More Styles & Patterns (2.3) | Low-Med | Medium — content depth |
| **P2** | Keyboard Shortcuts (6.2) | Low | Medium — power user efficiency |
| **P2** | Share Ambiance (7.1) | Low | Medium — viral growth |
| **P2** | Mode Characteristics (5.1) | Low | Medium — learning value |
| **P3** | MIDI Recording (4.1) | Medium | Medium — advanced feature |
| **P3** | Custom Progressions (7.3) | Medium | Medium — power user feature |
| **P3** | Voice Leading Guide (5.3) | Medium | Medium — advanced learning |
| **P3** | Onboarding Tour (6.4) | Low | Low-Med — first-time UX |
| **P3** | Practice Streaks (3.2) | Low | Low — gamification |
