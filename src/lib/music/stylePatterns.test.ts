// src/lib/music/stylePatterns.test.ts
import { describe, it, expect } from 'vitest';
import { STYLE_PATTERNS, totalSteps } from './stylePatterns';
import { STYLES } from './styles';

describe('STYLE_PATTERNS', () => {
	it('has an entry for every style key', () => {
		for (const key of STYLES) {
			expect(key in STYLE_PATTERNS).toBe(true);
		}
	});

	it('has exactly 10 keys matching STYLES', () => {
		expect(Object.keys(STYLE_PATTERNS).length).toBe(STYLES.length);
	});

	const defined = Object.entries(STYLE_PATTERNS) as [
		string,
		(typeof STYLE_PATTERNS)[keyof typeof STYLE_PATTERNS]
	][];

	it('has 10 defined (non-null) patterns', () => {
		expect(defined.length).toBe(10);
	});

	for (const [name, pattern] of defined) {
		describe(`pattern: ${name}`, () => {
			it('has BPM in range 40–240', () => {
				expect(pattern.bpm).toBeGreaterThanOrEqual(40);
				expect(pattern.bpm).toBeLessThanOrEqual(240);
			});

			it('has a valid ChordQuality', () => {
				expect(
					['Major', 'Minor', 'Augmented', 'Diminished', 'Unknown'].includes(pattern.quality)
				).toBe(true);
			});

			it('has swing in range 0–0.5', () => {
				expect(pattern.swing).toBeGreaterThanOrEqual(0);
				expect(pattern.swing).toBeLessThanOrEqual(0.5);
			});

			it('has a valid time signature', () => {
				const [beats, value] = pattern.timeSignature;
				expect(beats).toBeGreaterThan(0);
				expect([2, 4, 8, 16].includes(value)).toBe(true);
			});

			it('has at least one bass step', () => {
				expect(pattern.bass.length).toBeGreaterThan(0);
			});

			it('has at least one chord step', () => {
				expect(pattern.chords.length).toBeGreaterThan(0);
			});

			it('has a non-empty origin string', () => {
				expect(typeof pattern.origin).toBe('string');
				expect(pattern.origin.length).toBeGreaterThan(0);
			});

			const total = totalSteps(pattern.timeSignature);

			for (const [voiceLabel, voiceSteps] of [
				['bass', pattern.bass],
				['chords', pattern.chords]
			] as const) {
				for (const step of voiceSteps) {
					it(`${voiceLabel} step ${step.step} is within grid [0, ${total - 1}]`, () => {
						expect(step.step).toBeGreaterThanOrEqual(0);
						expect(step.step).toBeLessThan(total);
					});

					it(`${voiceLabel} step ${step.step} velocity is in range 1–127`, () => {
						expect(step.velocity).toBeGreaterThan(0);
						expect(step.velocity).toBeLessThanOrEqual(127);
					});

					it(`${voiceLabel} step ${step.step} duration >= 1`, () => {
						expect(step.duration).toBeGreaterThanOrEqual(1);
					});

					it(`${voiceLabel} step ${step.step} does not overflow the grid`, () => {
						expect(step.step + step.duration).toBeLessThanOrEqual(total);
					});

					it(`${voiceLabel} step ${step.step} semitones is a non-empty array of numbers in range -24 to 24`, () => {
						expect(Array.isArray(step.semitones)).toBe(true);
						expect(step.semitones.length).toBeGreaterThan(0);
						for (const s of step.semitones) {
							expect(s).toBeGreaterThanOrEqual(-24);
							expect(s).toBeLessThanOrEqual(24);
						}
					});

					it(`${voiceLabel} step ${step.step} octave is in range -2 to 2`, () => {
						expect(step.octave).toBeGreaterThanOrEqual(-2);
						expect(step.octave).toBeLessThanOrEqual(2);
					});
				}
			}
		});
	}
});

describe('totalSteps', () => {
	it('returns 16 for 4/4', () => expect(totalSteps([4, 4])).toBe(16));
	it('returns 12 for 3/4', () => expect(totalSteps([3, 4])).toBe(12));
	it('returns 8 for 2/4', () => expect(totalSteps([2, 4])).toBe(8));
});
