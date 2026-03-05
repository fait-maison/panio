# Product Requirements Document — Piano Ear Training App

**Version:** 0.5
**Date:** 2026-03-05
**Status:** v1 implemented

---

## 1. Problem Statement

Playing piano for theatrical improvisation requires a specific skill that most practice tools don't train: the ability to instantly establish an emotional ambiance — dark, magical, tense, melancholic — and sustain it convincingly while actors perform. This is closer to live film scoring than to jazz: the goal is texture, mood, and emotional responsiveness, not harmonic sophistication.

There is no tool that trains this directly. Most ear training apps focus on jazz, sheet music, or gamified note-hitting. This app trains the instinct to match sound to feeling, in real time, under pressure.

---

## 2. Goals

- Train the ability to instantly create and sustain a musical ambiance on demand
- Build fluency with modes and cinematic chord colors as emotional tools
- Develop rhythmic and textural variety (ostinatos, pedal tones, sparse silence, driving pulse)
- Make 30-minute daily sessions feel productive and measurable
- Keep the interface minimal — the focus is on listening and feeling, not on the UI

## 3. Non-Goals

- Jazz vocabulary training (ii-V-I, bebop, chord substitutions)
- Sheet music reading or sight-reading
- General-purpose music theory education
- Social features, leaderboards, or sharing
- Native mobile app (browser + responsive web only)

---

## 4. Users

### Primary user (v1)
- Single user (the developer / owner)
- Intermediate piano + theory level: knows modes, diatonic chords, chord colors
- Performs live as pianist for theatrical improvisation groups
- Has a MIDI keyboard connected to their computer
- Practice sessions of ~30 minutes
- Goal: build the reflex to translate a scene or emotion into music instantly

### Future users (v2+)
- Other theatrical improv pianists or film/game composers
- Multiple accounts with individual progress tracking

---

## 5. Exercise Types

### v1 — Ambiance Sandbox (only exercise in v1)

The app is a silent companion: it sets the musical context, gets out of the way,
and nudges the user to switch after a configurable interval.

**Flow:**
1. App displays the current ambiance context: mode, key, texture hint, and a suggested chord progression
2. User plays freely on their MIDI keyboard for the full interval duration
3. On-screen keyboard highlights keys in real time (visual feedback only)
4. When the interval ends, a **"Next ambiance in 5s"** card appears:
   - Countdown from 5 with a progress bar
   - **Snooze** button: dismiss, restart the interval on the same ambiance
   - If countdown reaches 0: auto-advance to a new randomly generated ambiance
5. Loop indefinitely until the user stops the session

No evaluation, no scoring, no audio from the app. Pure exploration.

### v2+ — Additional Exercise Types
- **Scene Prompt**: app shows a mood word or scene description, user plays for it
- **Melodic Ear Training**: app plays a phrase from the active mode, user reproduces it
- **Rhythm & Texture**: app plays an ostinato pattern, user locks it in

---

## 6. Mode & Mood Map

Modes are framed by their emotional color, not their harmonic function.

| Mode | Emotional color | Cinematic use |
|---|---|---|
| Ionian (Major) | Bright, resolved, safe | Happy endings, daylight scenes |
| Dorian | Melancholic, reflective, bittersweet | Introspective moments, nostalgia |
| Phrygian | Dark, mysterious, threatening | Horror, tension, foreign menace |
| Lydian | Magical, ethereal, wonder | Fantasy, dreams, discovery |
| Mixolydian | Heroic, confident, open | Adventure, triumph (without full resolution) |
| Aeolian (Natural Minor) | Sad, dramatic, longing | Loss, tragedy, romance |
| Locrian | Dissonant, unstable, dread | Extreme tension, psychological horror |
| Harmonic Minor | Dramatic, exotic, tense | Eastern/flamenco flavour, climactic scenes |

---

## 7. Session Flow (v1)

```
App start
└── MIDI device detected (or on-screen keyboard fallback)

Session start
└── Generate first random ambiance (mode + key + texture)

─── Ambiance loop ──────────────────────────────────────────
│
│  [Context card visible: "D Dorian · sparse · mysterious · Dm → G → C → Dm"]
│  [On-screen keyboard highlights notes as user plays]
│
│  ... user plays for N minutes ...
│
│  [Countdown card: "Next ambiance in 5s" + progress bar]
│  │
│  ├── User clicks Snooze → restart N-minute timer, same ambiance
│  └── Countdown reaches 0 → generate new ambiance, loop
│
────────────────────────────────────────────────────────────

Session end (user closes / stops)
```

---

## 8. Functional Requirements

### 8.1 MIDI Input
- Detect all connected MIDI devices on app load
- Auto-select the first device that sends MIDI input (no prompt needed)
- Display a device status indicator (connected / disconnected)
- Fall back to on-screen keyboard if no MIDI device is detected
- Stream note-on / note-off events into a reactive Svelte store

### 8.2 Ambiance Generator
- Draw from tonal.js for scale/mode data
- Randomly pick: mode (from pool) + key (from pool) + texture hint + chord progression at a random difficulty tier (from pool)
- Texture hints are short descriptive strings, e.g.:
  `"sparse"`, `"pedal tone"`, `"flowing arpeggios"`, `"sustained chords"`, `"driving pulse"`, `"silence and space"`
- Chord progressions are curated per-mode pools, loopable:
  - Major and Harmonic Minor: **10 progressions per tier** (simple / rich / complex)
  - All other modes: 5 progressions per tier
  - Real-world-inspired sources: jazz turnarounds, Pachelbel canon, soul/Motown, Miserlou, flamenco jondo, etc.
- Generator ensures each field differs from the previous ambiance (no immediate repeat on any dimension)

### 8.3 Interval Timer & Autoadvance
- Default interval: 3 minutes (user-configurable in settings)
- When interval ends, show the autoadvance card:
  - Countdown from 5 seconds with animated progress bar
  - "Snooze" button: dismiss card, restart full interval on same ambiance
  - At 0: auto-switch to a new ambiance
- Countdown card is non-blocking — user can keep playing during it

### 8.4 On-Screen Keyboard
- Full piano range, horizontally scrollable
- Highlights keys in real time as MIDI input is received
- Optionally highlights notes of the active mode (hint mode toggle, on by default)
- Responsive: usable on desktop, tablet, and mobile

### 8.5 UI
- Context card: prominently shows mode name, key, texture hint, and suggested chord progression
  - Tonic chord highlighted in red; remaining chords in default text color; arrows muted
  - Progression row scrolls horizontally on narrow screens (no overflow clipping)
- Minimal chrome — nothing distracting while playing
- Autoadvance card overlays the bottom of the screen (does not hide the keyboard)
- Language toggle: EN / FR (stored in localStorage)

### 8.6 Settings
- **Interval duration:** 15s / 1 / 3 / 5 / 10 minutes
- **Keyboard size:** S / M / L (controls visual width of on-screen keyboard)
- **Chord complexity (difficulty pool):** multi-select — Simple / Rich / Complex (default: Simple); generator picks randomly from selected tiers each ambiance
- **Progression notation:** chord symbols (`Dm → G → C`) or Roman numerals (`i → IV → VII`)
- **Mode pool:** which of the 8 modes to include in the random draw
- **Key pool:** restrict to specific keys if desired (e.g. only C, F, G for beginners)
- **Hint mode:** highlight active mode notes on keyboard
- **Language:** EN / FR
- All settings persisted to localStorage; spread-merge on load handles missing keys from older versions
- All toggle groups enforce minimum-one selection: last active item has `pointer-events: none` via CSS (`[data-lock-active] [data-state='on']`)

---

## 9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| MIDI input latency | < 10ms from key press to visual feedback |
| Mobile usability | Fully usable on iOS Safari and Android Chrome |
| Browser support | Chrome/Edge/Arc/Firefox 108+ (Web MIDI API required; Firefox prompts for site permission) |
| No external dependencies at runtime | tonal.js bundled, no CDN calls |

---

## 10. Difficulty & Mode Selection

Difficulty is **entirely user-controlled** — there is no hidden progression or automatic unlocking.

The user configures their session through the settings panel:

| Setting | Options |
|---|---|
| Mode pool | Any subset of the 8 supported modes |
| Key pool | Any subset of the 12 keys (or "all") |
| Chord complexity | Any subset of Simple / Rich / Complex (multi-select; generator picks randomly each ambiance) |
| Interval duration | 15s / 1 / 3 / 5 / 10 min |
| Keyboard size | S / M / L |
| Progression notation | Chord symbols or Roman numerals |

A beginner might restrict to Major + Dorian + Aeolian in a few familiar keys, Simple complexity only.
An advanced user opens the full pool including Phrygian, Lydian, Locrian, and Harmonic Minor, with Rich + Complex enabled.
The app never makes this choice for the user.

---

## 11. Phased Roadmap

### Phase 1 — v1 ✅ complete
- SvelteKit scaffold + tonal.js (no Tone.js, no Drizzle)
- MIDI input store (Web MIDI API) + MIDI device picker with localStorage persistence
- On-screen keyboard with real-time MIDI highlighting and scale note tinting
- Ambiance generator (mode + key + texture + chord progression)
- Context card: mode, key, texture, chord progression row (tonic in red)
- Interval timer + autoadvance card ("Next ambiance in 5s" + Snooze)
- Settings panel: interval, keyboard size, progression notation, mode pool, key pool, language (EN/FR), hint mode
- Design system: Tailwind v4 + shadcn-svelte (Sheet, ToggleGroup, Card, Sonner)
- Chord complexity (difficulty): multi-select Simple / Rich / Complex; generator picks random tier per ambiance
- Expanded progression pools: Major + Harmonic Minor → 10 progressions per tier (real-world inspired)
- ToggleGroup UX: last active item locked via CSS (`data-lock-active` pattern)

### Phase 2 — Feedback Layer
- MIDI evaluator: modal consistency (% notes in active mode), density
- Feedback card shown after each ambiance window (non-blocking summary)
- Optional self-rating after each round

### Phase 3 — More Exercise Types
- Scene Prompt (mood word / scene description)
- Melodic Ear Training (phrase reproduction)
- Rhythm & Texture (ostinato reproduction)

### Phase 4 — Persistence & Progress
- SQLite + Drizzle ORM
- SvelteKit API routes for session save / progress fetch
- Progress dashboard: history, modal consistency trends

### Phase 5 — Polish
- Mobile layout optimization
- MIDI device picker / onboarding flow
- Offline caching (service worker)

---

## 12. Out of Scope (v1)

- Any evaluation or scoring
- Audio playback from the app (no Tone.js in v1)
- Database or persistence
- Jazz vocabulary (ii-V-I, altered chords, bebop)
- Sheet music display
- User authentication / multi-account
- Audio recording of user sessions
- AI-generated content
