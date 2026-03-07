# Mood-Driven Rhythmic Ambiances

**Date:** 2026-03-07

## Summary

Replace the current texture system with a mood-driven generation model. Instead of
picking mode, key, and texture independently, the generator first picks a **mood**
(e.g. "tense," "romantic," "playful"), then selects a compatible mode, rhythm, and
progression. This ensures coherent ambiances where every element serves the same
emotional direction — matching how theatrical improv actually works.

## Motivation

- The 14 textures are vague playing-style hints ("sparse pedal tone," "dense block chords")
  that don't address rhythm at all
- Mode, key, texture, and progression are picked independently — a funeral march in Lydian
  with a bouncy progression breaks immersion
- Theatrical improv scoring is mood-first: you read the scene, feel the emotion, then
  translate it into music. The app should mirror that workflow

## Data Model

### Rhythms (replaces textures)

23 rhythmic patterns, each a simple string key:

```
waltz, march, bossa, shuffle, ballad, rubato, ostinato, tango,
lullaby, stride, reggae, blues, funk, bolero, polka, funeral-march,
minimalist, nocturne, fanfare, barcarolle, flamenco, tarantella, samba
```

New file: `src/lib/music/rhythms.ts` (replaces `textures.ts`).

### Moods

10 mood categories, each with compatible modes and rhythms:

| Mood        | Compatible Modes                  | Compatible Rhythms                            |
| ----------- | --------------------------------- | --------------------------------------------- |
| tense       | Phrygian, Locrian, Harmonic Minor | ostinato, tango, tarantella, flamenco         |
| dark        | Phrygian, Locrian, Minor          | funeral-march, nocturne, minimalist, ostinato |
| melancholic | Dorian, Minor, Harmonic Minor     | ballad, nocturne, waltz, blues, barcarolle    |
| bright      | Major, Lydian, Mixolydian         | march, samba, polka, stride, fanfare          |
| romantic    | Lydian, Dorian, Major             | waltz, bossa, bolero, ballad, barcarolle      |
| heroic      | Mixolydian, Major, Dorian         | march, fanfare, ostinato, stride              |
| playful     | Major, Mixolydian, Lydian         | polka, shuffle, stride, reggae, samba, funk   |
| mysterious  | Lydian, Phrygian, Locrian         | rubato, minimalist, nocturne, barcarolle      |
| dramatic    | Harmonic Minor, Phrygian, Minor   | tango, flamenco, bolero, funeral-march        |
| pastoral    | Major, Lydian, Mixolydian         | waltz, lullaby, ballad, reggae                |

New file: `src/lib/music/moods.ts`.

### Ambiance Interface

```ts
export interface Ambiance {
	mood: MoodInfo;
	mode: ModeInfo;
	key: string;
	rhythm: string;
	progression: RomanProgression;
}
```

## Generator Logic

```
1. Filter moods by user's mood pool setting
2. Pick a mood (avoid repeating previous)
3. Intersect mood.modes with user's mode pool -> pick a mode
4. Pick a rhythm from mood.rhythms (avoid repeat)
5. Pick a key from user's key pool (avoid repeat)
6. Pick a progression from mode's existing pool (unchanged)
```

Fallback: if the intersection of mood.modes and user's mode pool is empty, skip that
mood and pick another. If no mood works, fall back to fully random selection.

## UI Changes

### AmbianceCard Layout

```
        TENSE                  <- mood (small caps, muted color)
     D . PHRYGIAN              <- mode + key (big, bold — unchanged)
       ostinato                <- rhythm (replaces texture line)
     ---------------
  Dm > Eb > Dm > Bb            <- progression (unchanged)
```

Mood is the new top line, displayed in small caps with muted color. It sets the
creative direction before the theory details.

### Exercise Settings

New "Mood" section added between interval and difficulty:

```
MOOD
[tense] [dark] [melancholic] [bright] [romantic] [heroic] [playful] [mysterious] [dramatic] [pastoral]
```

Same ToggleGroup multi-select pattern with `data-lock-active` as existing pools.

### Settings Model

New field in Settings interface:

```ts
moodPool: string[]  // defaults to ALL_MOOD_NAMES
```

## i18n

Remove all 14 `texture.*` keys. Add:

- 23 `rhythm.*` keys (waltz/valse, march/marche, etc.)
- 10 `mood.*` keys for the new moods (tense/tendu, dark/sombre, etc.)
- Settings label for the mood pool section

### Rhythm Translations

| Key                  | EN            | FR             |
| -------------------- | ------------- | -------------- |
| rhythm.waltz         | waltz         | valse          |
| rhythm.march         | march         | marche         |
| rhythm.bossa         | bossa nova    | bossa nova     |
| rhythm.shuffle       | shuffle       | shuffle        |
| rhythm.ballad        | ballad        | ballade        |
| rhythm.rubato        | rubato        | rubato         |
| rhythm.ostinato      | ostinato      | ostinato       |
| rhythm.tango         | tango         | tango          |
| rhythm.lullaby       | lullaby       | berceuse       |
| rhythm.stride        | stride        | stride         |
| rhythm.reggae        | reggae        | reggae         |
| rhythm.blues         | blues         | blues          |
| rhythm.funk          | funk          | funk           |
| rhythm.bolero        | bolero        | bolero         |
| rhythm.polka         | polka         | polka          |
| rhythm.funeral-march | funeral march | marche funebre |
| rhythm.minimalist    | minimalist    | minimaliste    |
| rhythm.nocturne      | nocturne      | nocturne       |
| rhythm.fanfare       | fanfare       | fanfare        |
| rhythm.barcarolle    | barcarolle    | barcarolle     |
| rhythm.flamenco      | flamenco      | flamenco       |
| rhythm.tarantella    | tarantella    | tarentelle     |
| rhythm.samba         | samba         | samba          |

### Mood Translations

| Key              | EN          | FR           |
| ---------------- | ----------- | ------------ |
| mood.tense       | tense       | tendu        |
| mood.dark        | dark        | sombre       |
| mood.melancholic | melancholic | melancolique |
| mood.bright      | bright      | lumineux     |
| mood.romantic    | romantic    | romantique   |
| mood.heroic      | heroic      | heroique     |
| mood.playful     | playful     | enjoue       |
| mood.mysterious  | mysterious  | mysterieux   |
| mood.dramatic    | dramatic    | dramatique   |
| mood.pastoral    | pastoral    | pastoral     |

## Files Touched

| File                                     | Change                                              |
| ---------------------------------------- | --------------------------------------------------- |
| `src/lib/music/textures.ts`              | Delete                                              |
| `src/lib/music/rhythms.ts`               | Create — 23-item RHYTHMS array                      |
| `src/lib/music/moods.ts`                 | Create — 10 moods with mode/rhythm mappings         |
| `src/lib/music/generator.ts`             | Mood-driven generation, texture -> rhythm           |
| `src/lib/components/AmbianceCard.svelte` | New mood line, texture -> rhythm, mood pool setting |
| `src/lib/stores/settings.svelte.ts`      | Add moodPool to Settings                            |
| `src/lib/i18n.svelte.ts`                 | Remove textures, add rhythms + moods                |
| `src/lib/music/scale.test.ts`            | Update fixtures (texture -> rhythm)                 |
| `CLAUDE.md`                              | Update structure + patterns                         |
| `DESIGN.md`                              | Update ambiance badge, add mood section             |

## What Does NOT Change

- PianoKeyboard, AutoadvanceToast, timer, MIDI
- Progression pools (still per-mode)
- Global settings panel
- Difficulty system
- Chord detection
