// src/lib/music/stylePatterns.ts
import { Chord } from 'tonal';
import type { Style } from './styles';

// Derive ChordQuality from tonal's Chord.get() return type — "Major" | "Minor" | "Augmented" | "Diminished" | "Unknown"
export type ChordQuality = ReturnType<typeof Chord.get>['quality'];

export type PatternStep = {
	step: number; // 0-based index into the step grid (0–15 for 4/4, 0–11 for 3/4)
	semitones: number[]; // offsets from rootMidi: [0]=root only, [0,4,7]=major triad, [4,7,12]=1st inv
	octave: number; // relative octave offset from middle register (-1, 0, 1)
	duration: number; // length in steps (1 = 1/16th note)
	velocity: number; // 0–127 MIDI velocity
};

export type PatternDef = {
	bpm: number;
	timeSignature: [number, number]; // [beats, beat-value], e.g. [4, 4], [3, 4]
	origin: string; // e.g. "Argentine", "Brazilian"
	quality: ChordQuality; // metadata for display — voicing is now expressed in semitones
	swing: number; // 0=straight, 0.33=triplet swing; odd 16th steps pushed by swing*stepDur
	bass: PatternStep[];
	chords: PatternStep[];
	description: string;
};

// Helper: total step count from time signature
export function totalSteps(ts: [number, number]): number {
	return ts[0] * (16 / ts[1]); // at 1/16th note resolution
}

// Helper: convert scheduler BPM + time signature to a human-readable musical BPM.
// Compound time (6/8, 12/8): scheduler runs at 1.5× the dotted-quarter BPM.
export function musicalBpm(bpm: number, ts: [number, number]): { value: number; unit: string } {
	if (ts[1] === 8) return { value: Math.round(bpm / 1.5), unit: '♩.' };
	return { value: bpm, unit: '♩' };
}

// ── Pattern definitions ──────────────────────────────────────────────────────
// Beat positions (4/4): beat1=0, beat2=4, beat3=8, beat4=12
// Semitone reference: [0]=root, [7]=P5, [0,3,7]=minor triad, [0,4,7]=major triad
// Inversions: [4,7,12]=major 1st inv, [7,12,16]=major 2nd inv, [3,7,12]=minor 1st inv
// 7ths: [0,4,7,11]=maj7, [0,3,7,10]=min7
// Open: [0,7]=power chord/open 5th

const tango: PatternDef = {
	bpm: 118,
	timeSignature: [4, 4],
	origin: 'Argentine',
	quality: 'Minor',
	swing: 0,
	description:
		'Strong downbeat on 1, syncopation on the "and" of 2. Bass walks root→fifth. Charged, deliberate forward motion.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 90 },
		{ step: 6, semitones: [7], octave: -1, duration: 2, velocity: 55 },
		{ step: 8, semitones: [0], octave: -1, duration: 4, velocity: 85 },
		{ step: 14, semitones: [7], octave: -1, duration: 2, velocity: 50 }
	],
	chords: [
		{ step: 4, semitones: [0, 3, 7], octave: 0, duration: 2, velocity: 75 },
		{ step: 10, semitones: [0, 3, 7], octave: 0, duration: 2, velocity: 70 }
	]
};

const waltz: PatternDef = {
	bpm: 138,
	timeSignature: [3, 4],
	origin: 'European',
	quality: 'Major',
	swing: 0,
	description:
		'Oom-pah-pah. Strong root bass on beat 1, light chord stabs on beats 2 and 3. Circular, flowing character.',
	bass: [{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 90 }],
	chords: [
		{ step: 4, semitones: [4, 7, 12], octave: 0, duration: 4, velocity: 60 }, // 1st inversion
		{ step: 8, semitones: [7, 12, 16], octave: 0, duration: 4, velocity: 55 } // 2nd inversion
	]
};

const bossa: PatternDef = {
	bpm: 120,
	timeSignature: [4, 4],
	origin: 'Brazilian',
	quality: 'Major',
	swing: 0.1,
	description:
		'Bossa nova clave. Bass on 1 and "and" of 3. Chord stabs follow the syncopated clave pattern. Relaxed but rhythmically precise.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 80 },
		{ step: 8, semitones: [4], octave: -1, duration: 2, velocity: 60 }, // passing 3rd before 5th
		{ step: 10, semitones: [7], octave: -1, duration: 2, velocity: 65 }
	],
	chords: [
		{ step: 3, semitones: [0, 4, 7, 11], octave: 0, duration: 2, velocity: 65 }, // maj7
		{ step: 6, semitones: [0, 4, 7, 11], octave: 0, duration: 2, velocity: 68 },
		{ step: 8, semitones: [0, 4, 7, 11], octave: 0, duration: 2, velocity: 72 },
		{ step: 13, semitones: [0, 4, 7, 11], octave: 0, duration: 2, velocity: 60 }
	]
};

const march: PatternDef = {
	bpm: 116,
	timeSignature: [2, 4],
	origin: 'Military',
	quality: 'Major',
	swing: 0,
	description: 'Duple meter. Strong bass on beat 1, chord on beat 2. Direct and assertive.',
	bass: [{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 90 }],
	chords: [{ step: 4, semitones: [0, 4, 7], octave: 0, duration: 4, velocity: 72 }]
};

const flamenco: PatternDef = {
	bpm: 160,
	timeSignature: [3, 4],
	origin: 'Andalusian',
	quality: 'Minor',
	swing: 0,
	description:
		'Bulería feel. Accents on 1, "and" of 1, and 2. Phrygian scale gives its characteristic tense, Andalusian color.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 2, velocity: 92 },
		{ step: 4, semitones: [7], octave: -1, duration: 2, velocity: 78 }
	],
	chords: [
		{ step: 2, semitones: [0, 3, 7], octave: 0, duration: 2, velocity: 80 },
		{ step: 6, semitones: [0, 3, 7], octave: 0, duration: 2, velocity: 72 },
		{ step: 8, semitones: [0, 3, 7], octave: 0, duration: 2, velocity: 85 }
	]
};

// Shuffle uses 12/8 time (4 dotted-quarter beats per bar = 24 steps at 16th resolution).
// bpm=162 scales the 16th-note scheduler to dotted-quarter≈108 (162 × 16/24 = 108).
// Bass: root (long, 2 8ths) → fifth (short, 1 8th) on beats 1 and 3 — the defining
// "long-short" triplet feel of blues/boogie shuffle.
const shuffle: PatternDef = {
	bpm: 162,
	timeSignature: [12, 8],
	origin: 'Blues / Swing',
	quality: 'Minor',
	swing: 0,
	description:
		'Shuffle feel: long-short triplet bass (root→fifth) on beats 1 and 3, chord backbeat on 2 and 4. The foundation of blues and early rock.',
	// Each beat = 6 steps (dotted quarter). Long = 4 steps (quarter), short = 2 steps (eighth).
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 88 }, // beat 1 long
		{ step: 4, semitones: [7], octave: -1, duration: 2, velocity: 72 }, // beat 1 short
		{ step: 12, semitones: [0], octave: -1, duration: 4, velocity: 84 }, // beat 3 long
		{ step: 16, semitones: [7], octave: -1, duration: 2, velocity: 68 } // beat 3 short
	],
	chords: [
		{ step: 6, semitones: [0, 3, 7, 10], octave: 0, duration: 6, velocity: 70 }, // beat 2, min7
		{ step: 18, semitones: [0, 3, 7, 10], octave: 0, duration: 6, velocity: 66 } // beat 4, min7
	]
};

// Reggae: bass anchors beats 1 and 3; chords skank on ALL offbeats (the "ands").
// The empty downbeats on 2 and 4 create the characteristic push-pull tension.
const reggae: PatternDef = {
	bpm: 80,
	timeSignature: [4, 4],
	origin: 'Jamaican',
	quality: 'Major',
	swing: 0,
	description:
		'Offbeat skank: short chord stabs on every "and", bass holds beats 1 and 3. The hypnotic push-pull of Jamaican reggae.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 90 }, // beat 1
		{ step: 8, semitones: [0], octave: -1, duration: 4, velocity: 85 } //  beat 3
	],
	chords: [
		{ step: 2, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 72 }, //  and of 1
		{ step: 6, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 70 }, //  and of 2
		{ step: 10, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 72 }, // and of 3
		{ step: 14, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 70 } //  and of 4
	]
};

const ballad: PatternDef = {
	bpm: 65,
	timeSignature: [4, 4],
	origin: 'Pop / Rock',
	quality: 'Major',
	swing: 0.05,
	description:
		'Slow and spacious. Sustained bass on 1 and 3, light chord breath on 2 and 4. Space is the melody.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 8, velocity: 75 },
		{ step: 8, semitones: [7], octave: -1, duration: 8, velocity: 68 }
	],
	chords: [
		{ step: 4, semitones: [0, 4, 7, 11], octave: 0, duration: 4, velocity: 58 }, // maj7 = lush
		{ step: 12, semitones: [0, 4, 7, 11], octave: 0, duration: 4, velocity: 55 }
	]
};

const polka: PatternDef = {
	bpm: 136,
	timeSignature: [2, 4],
	origin: 'Bohemian',
	quality: 'Major',
	swing: 0,
	description:
		'Fast duple bounce. Bass and chord alternate every eighth note — root on beat 1, fifth on beat 2. Irresistible hop.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 2, velocity: 88 },
		{ step: 4, semitones: [7], octave: -1, duration: 2, velocity: 80 }
	],
	chords: [
		{ step: 2, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 70 },
		{ step: 6, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 65 }
	]
};

// Samba: anticipation on the "and" of 2 and "and" of 4 (steps 6 and 14).
// The characteristic syncopated forward lean — the note lands a half-beat early.
const samba: PatternDef = {
	bpm: 120,
	timeSignature: [4, 4],
	origin: 'Brazilian',
	quality: 'Major',
	swing: 0,
	description:
		'Syncopated anticipation bass: root on 1, fifth on the "and" of 2, root on 3, fifth on the "and" of 4. Chord fills the offbeats. Irresistible forward lean.',
	bass: [
		{ step: 0, semitones: [0], octave: -1, duration: 4, velocity: 88 }, // beat 1
		{ step: 6, semitones: [7], octave: -1, duration: 2, velocity: 74 }, // and of 2 (anticipation)
		{ step: 8, semitones: [0], octave: -1, duration: 4, velocity: 85 }, // beat 3
		{ step: 14, semitones: [7], octave: -1, duration: 2, velocity: 70 } // and of 4 (anticipation)
	],
	chords: [
		{ step: 4, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 66 }, // beat 2
		{ step: 10, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 64 }, // and of 3
		{ step: 12, semitones: [0, 4, 7], octave: 0, duration: 2, velocity: 68 } //  beat 4
	]
};

// ── Pattern map — all 10 style keys ─────────────────────────────────────────

export const STYLE_PATTERNS: Record<Style, PatternDef> = {
	tango,
	waltz,
	bossa,
	march,
	shuffle,
	reggae,
	ballad,
	polka,
	samba,
	flamenco
};
