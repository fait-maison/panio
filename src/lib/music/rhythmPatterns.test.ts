// src/lib/music/rhythmPatterns.test.ts
import { describe, it, expect } from 'vitest';
import { RHYTHM_PATTERNS, totalSteps } from './rhythmPatterns';
import { RHYTHMS } from './rhythms';

describe('RHYTHM_PATTERNS', () => {
	it('has an entry for every rhythm key', () => {
		for (const key of RHYTHMS) {
			expect(key in RHYTHM_PATTERNS).toBe(true);
		}
	});

	it('has exactly 23 keys matching RHYTHMS', () => {
		expect(Object.keys(RHYTHM_PATTERNS).length).toBe(RHYTHMS.length);
	});

	const defined = Object.entries(RHYTHM_PATTERNS).filter(([, p]) => p !== null) as [
		string,
		NonNullable<(typeof RHYTHM_PATTERNS)[keyof typeof RHYTHM_PATTERNS]>
	][];

	it('has 8 defined (non-null) patterns at launch', () => {
		expect(defined.length).toBe(8);
	});

	for (const [name, pattern] of defined) {
		describe(`pattern: ${name}`, () => {
			it('has BPM in range 40–240', () => {
				expect(pattern.bpm).toBeGreaterThanOrEqual(40);
				expect(pattern.bpm).toBeLessThanOrEqual(240);
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

					it(`${voiceLabel} step ${step.step} degree is a valid scale degree (1, 3, or 5)`, () => {
						expect([1, 3, 5].includes(step.degree)).toBe(true);
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
