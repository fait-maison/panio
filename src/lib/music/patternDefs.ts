// src/lib/music/patternDefs.ts
import type { PatternDef } from './stylePatterns';
export { totalSteps } from './stylePatterns';
import type { Pattern } from './patterns';

// ── Pattern definitions ───────────────────────────────────────────────────────
// Patterns are left-hand accompaniment techniques — reusable mechanisms that
// work across any key, mood, or musical context.

const ostinato: PatternDef = {
	bpm: 96,
	timeSignature: [4, 4],
	origin: 'Contemporary',
	quality: 'Major',
	swing: 0,
	description:
		'Root note repeated in eighth notes throughout the bar. Chord stabs on beats 2 and 4 add color without cluttering the bass. Hypnotic and minimal.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 2, velocity: 82 },
		{ step: 2, semitones: [0], octave: -1, duration: 2, velocity: 68 },
		{ step: 4, semitones: [0], octave: -1, duration: 2, velocity: 74 },
		{ step: 6, semitones: [0], octave: -1, duration: 2, velocity: 64 },
		{ step: 8, semitones: [0], octave: -1, duration: 2, velocity: 80 },
		{ step: 10, semitones: [0], octave: -1, duration: 2, velocity: 66 },
		{ step: 12, semitones: [0], octave: -1, duration: 2, velocity: 72 },
		{ step: 14, semitones: [0], octave: -1, duration: 2, velocity: 62 }
	],
	chords: [
		{ step: 4, semitones: [4, 7], octave: 0, duration: 2, velocity: 58 }, // 3rd+5th on beat 2
		{ step: 12, semitones: [4, 7], octave: 0, duration: 2, velocity: 55 } // 3rd+5th on beat 4
	]
};

// Alberti bass: low-high-mid-high broken chord pattern.
// Named after Domenico Alberti. Foundation of Classical keyboard style.
// A sustained root note holds in the bass while the broken chord pattern
// plays above it.
const albertiBass: PatternDef = {
	bpm: 100,
	timeSignature: [4, 4],
	origin: 'Classical',
	quality: 'Major',
	swing: 0,
	description:
		'Low-high-mid-high broken chord pattern (1-5-3-5). Named after Domenico Alberti. Foundation of Classical keyboard style.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 16, velocity: 50 } // sustained root throughout
	],
	chords: [
		{ step: 0, semitones: [0], octave: 0, duration: 2, velocity: 75 }, // 1 (low)
		{ step: 2, semitones: [7], octave: 0, duration: 2, velocity: 55 }, // 5 (high)
		{ step: 4, semitones: [4], octave: 0, duration: 2, velocity: 60 }, // 3 (mid)
		{ step: 6, semitones: [7], octave: 0, duration: 2, velocity: 53 }, // 5 (high)
		{ step: 8, semitones: [0], octave: 0, duration: 2, velocity: 73 }, // 1 (low)
		{ step: 10, semitones: [7], octave: 0, duration: 2, velocity: 53 }, // 5 (high)
		{ step: 12, semitones: [4], octave: 0, duration: 2, velocity: 58 }, // 3 (mid)
		{ step: 14, semitones: [7], octave: 0, duration: 2, velocity: 51 } // 5 (high)
	]
};

// Arpeggio: rolling broken chord ascending through the bar.
// Each note of the triad played in sequence from bass to treble.
const arpeggio: PatternDef = {
	bpm: 80,
	timeSignature: [4, 4],
	origin: 'Classical',
	quality: 'Major',
	swing: 0,
	description:
		'Rolling broken chord ascending through the bar. Each note of the triad played in sequence from bass to treble.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 16, velocity: 65 } // whole note sustain
	],
	chords: [
		{ step: 0, semitones: [0], octave: 0, duration: 2, velocity: 72 },
		{ step: 2, semitones: [4], octave: 0, duration: 2, velocity: 65 },
		{ step: 4, semitones: [7], octave: 0, duration: 2, velocity: 68 },
		{ step: 6, semitones: [12], octave: 0, duration: 2, velocity: 62 },
		{ step: 8, semitones: [0], octave: 0, duration: 2, velocity: 70 },
		{ step: 10, semitones: [4], octave: 0, duration: 2, velocity: 63 },
		{ step: 12, semitones: [7], octave: 0, duration: 2, velocity: 66 },
		{ step: 14, semitones: [12], octave: 0, duration: 2, velocity: 60 }
	]
};

// Stride: bass note on beats 1 and 3, chord on the offbeat.
// The heartbeat of stride piano.
const stride: PatternDef = {
	bpm: 120,
	timeSignature: [4, 4],
	origin: 'Jazz',
	quality: 'Major',
	swing: 0.1,
	description: 'Bass note on beats 1 and 3, chord on the offbeat. The heartbeat of stride piano.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 88 },
		{ step: 8, semitones: [0], octave: -1, duration: 4, velocity: 84 }
	],
	chords: [
		{ step: 4, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 72 },
		{ step: 12, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 68 }
	]
};

// ── Pattern map ───────────────────────────────────────────────────────────────

export const PATTERN_DEFS: Record<Pattern, PatternDef> = {
	ostinato,
	'alberti-bass': albertiBass,
	arpeggio,
	stride
};
