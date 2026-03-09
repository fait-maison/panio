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

// Shuffle uses 12/8 time (4 dotted-quarter beats per bar = 24 steps at 16th resolution).
// bpm=162 scales the 16th-note scheduler to dotted-quarter≈108 (162 × 16/24 = 108).
// Bass: root (long, 2 8ths) → fifth (short, 1 8th) on beats 1 and 3 — the defining
// "long-short" triplet feel of blues/boogie shuffle.
const shuffle: RhythmPattern = {
	bpm: 162,
	timeSignature: [12, 8],
	style: 'Blues / Swing',
	description:
		'Shuffle feel: long-short triplet bass (root→fifth) on beats 1 and 3, chord backbeat on 2 and 4. The foundation of blues and early rock.',
	// Each beat = 6 steps (dotted quarter). Long = 4 steps (quarter), short = 2 steps (eighth).
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 88 }, // beat 1 long
		{ step: 4, degree: 5, octave: -1, duration: 2, velocity: 72 }, // beat 1 short
		{ step: 12, degree: 1, octave: -1, duration: 4, velocity: 84 }, // beat 3 long
		{ step: 16, degree: 5, octave: -1, duration: 2, velocity: 68 } // beat 3 short
	],
	chords: [
		{ step: 6, degree: 1, octave: 0, duration: 6, velocity: 70 }, // beat 2
		{ step: 18, degree: 1, octave: 0, duration: 6, velocity: 66 } // beat 4
	]
};

// Reggae: bass anchors beats 1 and 3; chords skank on ALL offbeats (the "ands").
// The empty downbeats on 2 and 4 create the characteristic push-pull tension.
const reggae: RhythmPattern = {
	bpm: 80,
	timeSignature: [4, 4],
	style: 'Jamaican',
	description:
		'Offbeat skank: short chord stabs on every "and", bass holds beats 1 and 3. The hypnotic push-pull of Jamaican reggae.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 90 }, // beat 1
		{ step: 8, degree: 1, octave: -1, duration: 4, velocity: 85 } //  beat 3
	],
	chords: [
		{ step: 2, degree: 1, octave: 0, duration: 2, velocity: 72 }, //  and of 1
		{ step: 6, degree: 1, octave: 0, duration: 2, velocity: 70 }, //  and of 2
		{ step: 10, degree: 1, octave: 0, duration: 2, velocity: 72 }, // and of 3
		{ step: 14, degree: 1, octave: 0, duration: 2, velocity: 70 } //  and of 4
	]
};

const ballad: RhythmPattern = {
	bpm: 65,
	timeSignature: [4, 4],
	style: 'Pop / Rock',
	description:
		'Slow and spacious. Sustained bass on 1 and 3, light chord breath on 2 and 4. Space is the melody.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 8, velocity: 75 },
		{ step: 8, degree: 5, octave: -1, duration: 8, velocity: 68 }
	],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 4, velocity: 58 },
		{ step: 12, degree: 1, octave: 0, duration: 4, velocity: 55 }
	]
};

const lullaby: RhythmPattern = {
	bpm: 84,
	timeSignature: [3, 4],
	style: 'Classical',
	description:
		'Soft oom-pah-pah in 3. Bass floats on beat 1, gentle chord whispers on 2 and 3. Rocking cradle motion.',
	bass: [{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 68 }],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 4, velocity: 46 },
		{ step: 8, degree: 5, octave: 0, duration: 4, velocity: 42 }
	]
};

const polka: RhythmPattern = {
	bpm: 136,
	timeSignature: [2, 4],
	style: 'Bohemian',
	description:
		'Fast duple bounce. Bass and chord alternate every eighth note — root on beat 1, fifth on beat 2. Irresistible hop.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 2, velocity: 88 },
		{ step: 4, degree: 5, octave: -1, duration: 2, velocity: 80 }
	],
	chords: [
		{ step: 2, degree: 1, octave: 0, duration: 2, velocity: 70 },
		{ step: 6, degree: 1, octave: 0, duration: 2, velocity: 65 }
	]
};

// Funeral march: dotted quarter (6 steps) + eighth (2 steps) = classic Chopin cell.
// Slow heavy tread in 4/4. First two beats carry the motif, second pair echoes it.
const funeralMarch: RhythmPattern = {
	bpm: 52,
	timeSignature: [4, 4],
	style: 'Classical',
	description:
		'Dotted-quarter + eighth bass motif (the Chopin cell). Solemn downbeat chord on 1 and 3. Weight in every step.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 6, velocity: 92 }, // dotted quarter
		{ step: 6, degree: 1, octave: -1, duration: 2, velocity: 75 }, // eighth
		{ step: 8, degree: 5, octave: -1, duration: 6, velocity: 86 }, // dotted quarter
		{ step: 14, degree: 5, octave: -1, duration: 2, velocity: 68 } // eighth
	],
	chords: [
		{ step: 0, degree: 1, octave: 0, duration: 4, velocity: 65 },
		{ step: 8, degree: 1, octave: 0, duration: 4, velocity: 60 }
	]
};

// Barcarolle: 6/8, sched_bpm = 108 (1.5 × d.q.=72).
// 12 steps total. Each dotted-quarter beat = 6 steps (3 eighths of 2 steps each).
// Oom = bass on first eighth of each beat; pah-pah = chord on 2nd and 3rd eighths.
const barcarolle: RhythmPattern = {
	bpm: 108,
	timeSignature: [6, 8],
	style: 'Venetian',
	description:
		'Rocking gondola rhythm. Bass on the first eighth of each dotted-quarter beat, chord on the two that follow. Lilting and hypnotic.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 2, velocity: 82 }, // beat 1 oom
		{ step: 6, degree: 1, octave: -1, duration: 2, velocity: 75 } //  beat 2 oom
	],
	chords: [
		{ step: 2, degree: 1, octave: 0, duration: 2, velocity: 60 }, // beat 1 pah
		{ step: 4, degree: 5, octave: 0, duration: 2, velocity: 56 }, // beat 1 pah
		{ step: 8, degree: 1, octave: 0, duration: 2, velocity: 58 }, // beat 2 pah
		{ step: 10, degree: 5, octave: 0, duration: 2, velocity: 54 } //  beat 2 pah
	]
};

// Tarantella: same 6/8 cell as barcarolle, three times the urgency.
// sched_bpm = 189 (1.5 × d.q.=126).
const tarantella: RhythmPattern = {
	bpm: 189,
	timeSignature: [6, 8],
	style: 'Southern Italian',
	description:
		'Frantic 6/8 spin. Identical cell to barcarolle — bass + pah-pah — but at breakneck speed. Folk legend: the only cure for a tarantula bite.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 2, velocity: 90 },
		{ step: 6, degree: 1, octave: -1, duration: 2, velocity: 83 }
	],
	chords: [
		{ step: 2, degree: 1, octave: 0, duration: 2, velocity: 68 },
		{ step: 4, degree: 5, octave: 0, duration: 2, velocity: 62 },
		{ step: 8, degree: 1, octave: 0, duration: 2, velocity: 66 },
		{ step: 10, degree: 5, octave: 0, duration: 2, velocity: 60 }
	]
};

const fanfare: RhythmPattern = {
	bpm: 120,
	timeSignature: [4, 4],
	style: 'Ceremonial',
	description:
		'Bold quarter-note bass on all 4 beats: root–fifth–root–fifth. Chord punches reinforce beats 1 and 3. Triumphant proclamation.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 92 },
		{ step: 4, degree: 5, octave: -1, duration: 4, velocity: 84 },
		{ step: 8, degree: 1, octave: -1, duration: 4, velocity: 90 },
		{ step: 12, degree: 5, octave: -1, duration: 4, velocity: 82 }
	],
	chords: [
		{ step: 0, degree: 1, octave: 0, duration: 4, velocity: 75 },
		{ step: 8, degree: 1, octave: 0, duration: 4, velocity: 72 }
	]
};

// Samba: anticipation on the "and" of 2 and "and" of 4 (steps 6 and 14).
// The characteristic syncopated forward lean — the note lands a half-beat early.
const samba: RhythmPattern = {
	bpm: 120,
	timeSignature: [4, 4],
	style: 'Brazilian',
	description:
		'Syncopated anticipation bass: root on 1, fifth on the "and" of 2, root on 3, fifth on the "and" of 4. Chord fills the offbeats. Irresistible forward lean.',
	bass: [
		{ step: 0, degree: 1, octave: -1, duration: 4, velocity: 88 }, // beat 1
		{ step: 6, degree: 5, octave: -1, duration: 2, velocity: 74 }, // and of 2 (anticipation)
		{ step: 8, degree: 1, octave: -1, duration: 4, velocity: 85 }, // beat 3
		{ step: 14, degree: 5, octave: -1, duration: 2, velocity: 70 } // and of 4 (anticipation)
	],
	chords: [
		{ step: 4, degree: 1, octave: 0, duration: 2, velocity: 66 }, // beat 2
		{ step: 10, degree: 1, octave: 0, duration: 2, velocity: 64 }, // and of 3
		{ step: 12, degree: 1, octave: 0, duration: 2, velocity: 68 } //  beat 4
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
	ballad,
	rubato: null,
	lullaby,
	stride: null,
	reggae,
	blues: null,
	funk: null,
	polka,
	'funeral-march': funeralMarch,
	minimalist: null,
	nocturne: null,
	fanfare,
	barcarolle,
	tarantella,
	samba
};
