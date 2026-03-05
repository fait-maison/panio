import { describe, it, expect } from 'vitest';
import { toChordSymbol, pickProgression, PROGRESSIONS, getChordPitchClasses } from './progressions';

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
		const p = pickProgression('Major');
		expect(Array.isArray(p)).toBe(true);
		expect(p.length).toBeGreaterThanOrEqual(4);
	});

	it('avoids returning the same progression as previous (by reference)', () => {
		const p1 = pickProgression('Major');
		// Run many times — should eventually differ
		let differs = false;
		for (let i = 0; i < 50; i++) {
			const p2 = pickProgression('Major', p1);
			if (p2 !== p1) { differs = true; break; }
		}
		expect(differs).toBe(true);
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

describe('PROGRESSIONS coverage', () => {
	const REQUIRED_MODES = [
		'Major', 'Dorian', 'Phrygian', 'Lydian',
		'Mixolydian', 'Minor', 'Locrian', 'Harmonic Minor'
	];

	for (const mode of REQUIRED_MODES) {
		it(`${mode} has at least 4 progressions`, () => {
			expect(PROGRESSIONS[mode]).toBeDefined();
			expect(PROGRESSIONS[mode].length).toBeGreaterThanOrEqual(4);
		});
	}
});
