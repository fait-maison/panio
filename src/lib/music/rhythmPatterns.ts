// src/lib/music/rhythmPatterns.ts
import type { Rhythm } from './rhythms';

export type PatternStep = {
	step: number; // 0-based index into the step grid (0–15 for 4/4, 0–11 for 3/4)
	degree: 1 | 3 | 5; // scale degree: root, major third, perfect fifth
	octave: number; // relative octave offset from middle register (-1, 0, 1)
	duration: number; // length in steps (1 = 1/16th note)
	velocity: number; // 0–127 MIDI velocity
};

export type RhythmPattern = {
	bpm: number;
	timeSignature: [number, number]; // [beats, beat-value], e.g. [4, 4], [3, 4]
	style: string; // e.g. "Argentine", "Brazilian"
	bass: PatternStep[];
	chords: PatternStep[];
	description: string;
} | null; // null = "coming soon"

// Helper: total step count from time signature
export function totalSteps(ts: [number, number]): number {
	return ts[0] * (16 / ts[1]); // at 1/16th note resolution
}

// ── Pattern definitions ──────────────────────────────────────────────────────
// Beat positions (4/4): beat1=0, beat2=4, beat3=8, beat4=12
// Bass degree 1 = root note, degree 5 = perfect fifth (7 semitones up).

const tango: RhythmPattern = {
	bpm: 118,
	timeSignature: [4, 4],
	style: 'Argentine',
	description:
		'Strong downbeat on 1, syncopation on the "and" of 2. Bass walks root→fifth. Charged, deliberate forward motion.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 90 },
		{ step: 6, degree: 5, octave: -1, duration: 2, velocity: 55 },
		{ step: 8, degree: 1, octave: -1, duration: 4, velocity: 85 },
		{ step: 14, degree: 5, octave: -1, duration: 2, velocity: 50 }
	],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 2, velocity: 75 },
		{ step: 10, degree: 1, octave: 0, duration: 2, velocity: 70 }
	]
};

const waltz: RhythmPattern = {
	bpm: 138,
	timeSignature: [3, 4],
	style: 'European',
	description:
		'Oom-pah-pah. Strong root bass on beat 1, light chord stabs on beats 2 and 3. Circular, flowing character.',
	bass: [{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 90 }],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 4, velocity: 60 },
		{ step: 8, degree: 5, octave: 0, duration: 4, velocity: 55 }
	]
};

const bossa: RhythmPattern = {
	bpm: 120,
	timeSignature: [4, 4],
	style: 'Brazilian',
	description:
		'Bossa nova clave. Bass on 1 and "and" of 3. Chord stabs follow the syncopated clave pattern. Relaxed but rhythmically precise.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 80 },
		{ step: 10, degree: 5, octave: -1, duration: 2, velocity: 65 }
	],
	chords: [
		{ step: 3, degree: 1, octave: 0, duration: 2, velocity: 65 },
		{ step: 6, degree: 1, octave: 0, duration: 2, velocity: 68 },
		{ step: 8, degree: 1, octave: 0, duration: 2, velocity: 72 },
		{ step: 13, degree: 1, octave: 0, duration: 2, velocity: 60 }
	]
};

const march: RhythmPattern = {
	bpm: 116,
	timeSignature: [2, 4],
	style: 'Military',
	description: 'Duple meter. Strong bass on beat 1, chord on beat 2. Direct and assertive.',
	bass: [{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 90 }],
	chords: [{ step: 4, degree: 1, octave: 0, duration: 4, velocity: 72 }]
};

const bolero: RhythmPattern = {
	bpm: 72,
	timeSignature: [3, 4],
	style: 'Spanish',
	description:
		'Slow and hypnotic. Bass on 1, chord on 2 and "and" of 2. Intensity through accumulation, not speed.',
	bass: [{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 82 }],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 2, velocity: 65 },
		{ step: 6, degree: 5, octave: 0, duration: 2, velocity: 58 }
	]
};

const flamenco: RhythmPattern = {
	bpm: 160,
	timeSignature: [3, 4],
	style: 'Andalusian',
	description:
		'Bulería feel. Accents on 1, "and" of 1, and 2. Phrygian scale gives its characteristic tense, Andalusian color.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 2, velocity: 92 },
		{ step: 4, degree: 5, octave: -1, duration: 2, velocity: 78 }
	],
	chords: [
		{ step: 2, degree: 1, octave: 0, duration: 2, velocity: 80 },
		{ step: 6, degree: 1, octave: 0, duration: 2, velocity: 72 },
		{ step: 8, degree: 1, octave: 0, duration: 2, velocity: 85 }
	]
};

const ostinato: RhythmPattern = {
	bpm: 96,
	timeSignature: [4, 4],
	style: 'Contemporary',
	description:
		'Repeated eighth-note bass figure against chord stabs on 2 and 4. Hypnotic and minimalist.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 2, velocity: 80 },
		{ step: 2, degree: 1, octave: -1, duration: 2, velocity: 68 },
		{ step: 4, degree: 1, octave: -1, duration: 2, velocity: 75 },
		{ step: 6, degree: 5, octave: -1, duration: 2, velocity: 65 },
		{ step: 8, degree: 1, octave: -1, duration: 2, velocity: 78 },
		{ step: 10, degree: 1, octave: -1, duration: 2, velocity: 65 },
		{ step: 12, degree: 1, octave: -1, duration: 2, velocity: 72 },
		{ step: 14, degree: 5, octave: -1, duration: 2, velocity: 62 }
	],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 2, velocity: 60 },
		{ step: 12, degree: 1, octave: 0, duration: 2, velocity: 58 }
	]
};

const shuffle: RhythmPattern = {
	bpm: 108,
	timeSignature: [4, 4],
	style: 'Blues / Swing',
	description:
		'Shuffle feel: eighth notes swung to a long-short triplet ratio. Bass hits on 1 and 3, chord punctuates on 2 and 4. The foundation of blues and early rock.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 85 },
		{ step: 8, degree: 1, octave: -1, duration: 4, velocity: 80 }
	],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 2, velocity: 68 },
		{ step: 12, degree: 1, octave: 0, duration: 2, velocity: 65 }
	]
};

// ── Pattern map — all 23 rhythm keys ────────────────────────────────────────

export const RHYTHM_PATTERNS: Record<Rhythm, RhythmPattern> = {
	tango,
	waltz,
	bossa,
	march,
	bolero,
	flamenco,
	ostinato,
	shuffle,
	// Coming soon:
	ballad: null,
	rubato: null,
	lullaby: null,
	stride: null,
	reggae: null,
	blues: null,
	funk: null,
	polka: null,
	'funeral-march': null,
	minimalist: null,
	nocturne: null,
	fanfare: null,
	barcarolle: null,
	tarantella: null,
	samba: null
};
