# Piano — Theatrical Improv Training App

[![CI](https://github.com/fait-maison/panio/actions/workflows/docker-build.yml/badge.svg)](https://github.com/fait-maison/panio/actions/workflows/docker-build.yml)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/aBMania/788bd59c89ce1bee55d7e7683513f777/raw/panio-coverage.json)

A MIDI-driven practice tool for pianists who accompany theatrical improvisation. Connect a MIDI keyboard, get a random musical context (mode + key + texture), play freely, and let the app nudge you to a new ambiance every few minutes — like a silent musical scene partner.

## Goals

- Build the instinct to create a musical ambiance on demand (dark, magical, tense, melancholic…)
- Develop fluency with modes as emotional tools, not just harmonic theory
- Train rhythmic and textural variety: sustained chords, pedal tones, sparse silence, driving pulse

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + Backend | SvelteKit (full-stack, TypeScript) |
| Music theory | tonal.js |
| MIDI input | Web MIDI API (native browser) |
| Package manager | pnpm |

> v1 has no audio playback from the app and no database. Tone.js and Drizzle ORM are planned for later phases.

## Getting Started

```bash
pnpm install
pnpm dev
```

The app auto-connects to the first MIDI device that sends input — just press a key.
You can also pick a specific device from the settings panel.
If no MIDI device is found, the on-screen keyboard is available as a fallback.

## How It Works (v1)

1. App displays a random ambiance: **mode + key + texture hint** (e.g. "D Dorian · sparse · pedal tone")
2. Play freely on your MIDI keyboard — on-screen keyboard highlights your notes in real time
3. After your configured interval (default 3 min), a **"Next ambiance in 5s"** card appears
4. Let it count down to auto-switch, or hit **Snooze** to keep the current ambiance longer
5. Repeat for the length of your session

## Mode / Mood Reference

| Mode | Feel |
|---|---|
| Ionian (Major) | Bright, resolved, safe |
| Dorian | Melancholic, bittersweet |
| Phrygian | Dark, threatening, mysterious |
| Lydian | Magical, ethereal, wonder |
| Mixolydian | Heroic, open, confident |
| Aeolian (Natural Minor) | Sad, dramatic, longing |
| Locrian | Dissonant, dread, instability |

## Settings

All difficulty is user-controlled — no hidden progression.

| Setting | Default | Description |
|---|---|---|
| Interval | 3 min | How long before the autoadvance card appears |
| Chord complexity | Simple | Which tiers to draw from: Simple / Rich / Complex (multi-select) |
| Mode pool | All 8 modes | Which modes to include in random draws |
| Key pool | All 12 keys | Which keys to include |
| Hint mode | On | Highlight the active mode's notes on the keyboard |

## Project Structure

```
piano/
├── src/
│   ├── routes/
│   │   └── +page.svelte              # Main practice view
│   ├── lib/
│   │   ├── midi/                     # Web MIDI API store & types
│   │   ├── music/                    # tonal.js wrappers, mode/mood map, ambiance generator
│   │   └── stores/                   # Svelte stores (midi, ambiance, timer, settings)
│   └── components/
│       ├── PianoKeyboard.svelte      # On-screen keyboard (responsive, real-time highlighting)
│       ├── AmbianceCard.svelte       # Current mode / key / texture display
│       ├── AutoadvanceCard.svelte    # "Next ambiance in 5s" countdown + Snooze
│       └── SettingsPanel.svelte      # Interval, mode pool, key pool, hint mode
├── static/
└── PRD.md
```

## Browser Requirements

Web MIDI API is supported in all major browsers: Chrome, Edge, Arc, and Firefox (108+).
Firefox will prompt for a "Access MIDI devices" site permission on first use.

## Roadmap

See `PRD.md` for the full product requirements and phased roadmap.
