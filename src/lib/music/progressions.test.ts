import { describe, it, expect } from 'vitest';
import { Note } from 'tonal';
import {
	toChordSymbol,
	chordToRoman,
	pickProgression,
	PROGRESSIONS,
	getChordPitchClasses
} from './progressions';

describe('toChordSymbol', () => {
	it('D dorian i → Dm', () => {
		expect(toChordSymbol('D', 'dorian', 'i')).toBe('Dm');
	});

	it('D dorian IV → G', () => {
		expect(toChordSymbol('D', 'dorian', 'IV')).toBe('G');
	});

	it('D dorian bVII → C', () => {
		expect(toChordSymbol('D', 'dorian', 'bVII')).toBe('C');
	});

	it('A harmonic minor V → E (major V, exotic chord)', () => {
		expect(toChordSymbol('A', 'harmonic minor', 'V')).toBe('E');
	});

	it('D phrygian bII → Eb', () => {
		expect(toChordSymbol('D', 'phrygian', 'bII')).toBe('Eb');
	});

	it('B locrian i° → Bdim', () => {
		expect(toChordSymbol('B', 'locrian', 'i°')).toBe('Bdim');
	});

	it('C major I → C', () => {
		expect(toChordSymbol('C', 'major', 'I')).toBe('C');
	});

	it('C major vi → Am', () => {
		expect(toChordSymbol('C', 'major', 'vi')).toBe('Am');
	});
});

describe('pickProgression', () => {
	it('returns an array for a known mode', () => {
		const p = pickProgression('Major', 'simple');
		expect(Array.isArray(p)).toBe(true);
		expect(p.length).toBeGreaterThanOrEqual(4);
	});

	it('avoids returning the same progression as previous (by reference)', () => {
		const p1 = pickProgression('Major', 'simple');
		// Run many times — should eventually differ
		let differs = false;
		for (let i = 0; i < 50; i++) {
			const p2 = pickProgression('Major', 'simple', p1);
			if (p2 !== p1) {
				differs = true;
				break;
			}
		}
		expect(differs).toBe(true);
	});

	it('returns rich progressions with 7th chord notation', () => {
		const p = pickProgression('Major', 'rich');
		expect(p.some((r) => r.includes('maj7') || r.includes('m7') || r.includes('7'))).toBe(true);
	});

	it('returns complex progressions with extended chord notation', () => {
		const p = pickProgression('Major', 'complex');
		expect(
			p.some((r) => r.includes('maj9') || r.includes('m9') || r.includes('9') || r.includes('sus4'))
		).toBe(true);
	});
});

describe('getChordPitchClasses', () => {
	it('D dorian i → Dm → {D,F,A} = {2,5,9}', () => {
		expect(getChordPitchClasses('D', 'dorian', 'i')).toEqual(new Set([2, 5, 9]));
	});

	it('D dorian IV → G → {G,B,D} = {7,11,2}', () => {
		expect(getChordPitchClasses('D', 'dorian', 'IV')).toEqual(new Set([7, 11, 2]));
	});

	it('D dorian bVII → C → {C,E,G} = {0,4,7}', () => {
		expect(getChordPitchClasses('D', 'dorian', 'bVII')).toEqual(new Set([0, 4, 7]));
	});

	it('B locrian i° → Bdim → {B,D,F} = {11,2,5}', () => {
		expect(getChordPitchClasses('B', 'locrian', 'i°')).toEqual(new Set([11, 2, 5]));
	});

	it('D phrygian bII → Eb → {Eb,G,Bb} = {3,7,10}', () => {
		expect(getChordPitchClasses('D', 'phrygian', 'bII')).toEqual(new Set([3, 7, 10]));
	});

	it('always returns a triad (exactly 3 members)', () => {
		expect(getChordPitchClasses('D', 'dorian', 'i').size).toBe(3);
	});
});

describe('toChordSymbol — 7th extensions', () => {
	it('im7 in D dorian → Dm7', () => {
		expect(toChordSymbol('D', 'dorian', 'im7')).toBe('Dm7');
	});
	it('IVmaj7 in D dorian → Gmaj7', () => {
		expect(toChordSymbol('D', 'dorian', 'IVmaj7')).toBe('Gmaj7');
	});
	it('bVIImaj7 in D dorian → Cmaj7', () => {
		expect(toChordSymbol('D', 'dorian', 'bVIImaj7')).toBe('Cmaj7');
	});
	it('V7 in G mixolydian → D7', () => {
		expect(toChordSymbol('G', 'mixolydian', 'V7')).toBe('D7');
	});
});

describe('toChordSymbol — extended chords', () => {
	it('Imaj9 in C major → Cmaj9', () => {
		expect(toChordSymbol('C', 'major', 'Imaj9')).toBe('Cmaj9');
	});
	it('V9 in C major → G9', () => {
		expect(toChordSymbol('C', 'major', 'V9')).toBe('G9');
	});
	it('im9 in D dorian → Dm9', () => {
		expect(toChordSymbol('D', 'dorian', 'im9')).toBe('Dm9');
	});
	it('IVsus4 in C major → Fsus4', () => {
		expect(toChordSymbol('C', 'major', 'IVsus4')).toBe('Fsus4');
	});
	it('i°7 in B locrian → Bdim7', () => {
		expect(toChordSymbol('B', 'locrian', 'i°7')).toBe('Bdim7');
	});
	it('i° in B locrian → Bdim (unchanged)', () => {
		expect(toChordSymbol('B', 'locrian', 'i°')).toBe('Bdim');
	});
});

describe('getChordPitchClasses — extended', () => {
	it('im7 in D dorian → 4 notes (D F A C)', () => {
		const dm7 = getChordPitchClasses('D', 'dorian', 'im7');
		expect(dm7.size).toBe(4);
		expect(dm7.has(Note.chroma('C'))).toBe(true);
	});
});

describe('chordToRoman', () => {
	it('C major diatonic triads', () => {
		expect(chordToRoman('C', 'C', 'major')).toBe('I');
		expect(chordToRoman('Dm', 'C', 'major')).toBe('ii');
		expect(chordToRoman('Em', 'C', 'major')).toBe('iii');
		expect(chordToRoman('F', 'C', 'major')).toBe('IV');
		expect(chordToRoman('G', 'C', 'major')).toBe('V');
		expect(chordToRoman('Am', 'C', 'major')).toBe('vi');
	});

	it('diminished chord → °', () => {
		expect(chordToRoman('Bdim', 'C', 'major')).toBe('vii°');
	});

	it('7th extensions preserved', () => {
		expect(chordToRoman('Dm7', 'C', 'major')).toBe('iim7');
		expect(chordToRoman('Cmaj7', 'C', 'major')).toBe('Imaj7');
		expect(chordToRoman('G7', 'C', 'major')).toBe('V7');
	});

	it('9th and sus extensions preserved', () => {
		expect(chordToRoman('Cmaj9', 'C', 'major')).toBe('Imaj9');
		expect(chordToRoman('Fsus4', 'C', 'major')).toBe('IVsus4');
	});

	it('chromatic chords get flat prefix', () => {
		expect(chordToRoman('Ab', 'C', 'major')).toBe('bVI');
		expect(chordToRoman('Eb', 'C', 'major')).toBe('bIII');
		expect(chordToRoman('Bb', 'C', 'major')).toBe('bVII');
	});

	it('chromatic minor chords', () => {
		expect(chordToRoman('Bbm', 'C', 'major')).toBe('bvii');
	});

	it('diatonic chords in dorian', () => {
		expect(chordToRoman('Dm', 'D', 'dorian')).toBe('i');
		expect(chordToRoman('G', 'D', 'dorian')).toBe('IV');
		expect(chordToRoman('C', 'D', 'dorian')).toBe('VII');
	});

	it('slash chords — bass degree resolved', () => {
		expect(chordToRoman('C/E', 'C', 'major')).toBe('I/III');
		expect(chordToRoman('C/G', 'C', 'major')).toBe('I/V');
	});

	it('slash chords — chromatic bass gets flat prefix', () => {
		expect(chordToRoman('C/Bb', 'C', 'major')).toBe('I/bVII');
	});

	it('returns chord symbol as-is for unrecognized input', () => {
		expect(chordToRoman('???', 'C', 'major')).toBe('???');
	});
});

describe('chordToRoman ↔ toChordSymbol roundtrip', () => {
	const cases: [string, string, string][] = [
		['C', 'major', 'I'],
		['C', 'major', 'vi'],
		['D', 'dorian', 'i'],
		['D', 'dorian', 'IV'],
		['C', 'major', 'V7'],
		['C', 'major', 'Imaj7'],
		['C', 'major', 'iim7'],
		['C', 'major', 'IVsus4']
	];

	for (const [key, mode, roman] of cases) {
		it(`${key} ${mode}: ${roman} → chord → roman`, () => {
			const chord = toChordSymbol(key, mode, roman);
			expect(chordToRoman(chord, key, mode)).toBe(roman);
		});
	}
});

describe('PROGRESSIONS coverage', () => {
	const REQUIRED_MODES = [
		'Major',
		'Dorian',
		'Phrygian',
		'Lydian',
		'Mixolydian',
		'Minor',
		'Locrian',
		'Harmonic Minor'
	];

	for (const mode of REQUIRED_MODES) {
		it(`${mode} has at least 4 progressions per difficulty`, () => {
			expect(PROGRESSIONS[mode]).toBeDefined();
			expect(PROGRESSIONS[mode].simple.length).toBeGreaterThanOrEqual(4);
			expect(PROGRESSIONS[mode].rich.length).toBeGreaterThanOrEqual(4);
			expect(PROGRESSIONS[mode].complex.length).toBeGreaterThanOrEqual(4);
		});
	}
});
