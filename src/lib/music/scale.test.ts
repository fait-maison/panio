import { describe, it, expect } from 'vitest';
import { Note } from 'tonal';
import { getScaleNotes } from './scale';
import { MODES } from './modes';
import { MOODS } from './moods';

// Pitch-class integers for all white keys
const WHITE_KEY_CHROMAS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((n) => Note.chroma(n));

function mode(name: string) {
	const found = MODES.find((m) => m.name === name);
	if (!found) throw new Error(`Mode "${name}" not found`);
	return found;
}

function chroma(note: string) {
	return Note.chroma(note);
}

describe('getScaleNotes', () => {
	it('C Major contains all 7 white-key chromas', () => {
		const notes = getScaleNotes({
			mode: mode('Major'),
			key: 'C',
			rhythm: '',
			mood: MOODS[0],
			progression: []
		});
		for (const pc of WHITE_KEY_CHROMAS) {
			expect(notes.has(pc), `expected chroma ${String(pc)} in C Major`).toBe(true);
		}
		expect(notes.size).toBe(7);
	});

	it('A Minor contains all 7 white-key chromas', () => {
		const notes = getScaleNotes({
			mode: mode('Minor'),
			key: 'A',
			rhythm: '',
			mood: MOODS[0],
			progression: []
		});
		for (const pc of WHITE_KEY_CHROMAS) {
			expect(notes.has(pc), `expected chroma ${String(pc)} in A Minor`).toBe(true);
		}
		expect(notes.size).toBe(7);
	});

	it('A Harmonic Minor raises the 7th (G# chroma 8), drops G (chroma 7)', () => {
		const notes = getScaleNotes({
			mode: mode('Harmonic Minor'),
			key: 'A',
			rhythm: '',
			mood: MOODS[0],
			progression: []
		});
		expect(notes.has(chroma('G#'))).toBe(true);
		expect(notes.has(chroma('G'))).toBe(false);
		expect(notes.size).toBe(7);
	});

	it('C Dorian includes Eb/D# (chroma 3) and Bb/A# (chroma 10), excludes E (4) and B (11)', () => {
		const notes = getScaleNotes({
			mode: mode('Dorian'),
			key: 'C',
			rhythm: '',
			mood: MOODS[0],
			progression: []
		});
		expect(notes.has(chroma('Eb'))).toBe(true); // enharmonic with D#
		expect(notes.has(chroma('D#'))).toBe(true); // same chroma, different spelling
		expect(notes.has(chroma('Bb'))).toBe(true);
		expect(notes.has(chroma('E'))).toBe(false);
		expect(notes.has(chroma('B'))).toBe(false);
	});

	it('returns exactly 7 notes for every mode and key', () => {
		for (const m of MODES) {
			for (const key of ['C', 'F#', 'Bb']) {
				const notes = getScaleNotes({ mode: m, key, rhythm: '', mood: MOODS[0], progression: [] });
				expect(notes.size, `${key} ${m.name} should have 7 notes`).toBe(7);
			}
		}
	});
});
