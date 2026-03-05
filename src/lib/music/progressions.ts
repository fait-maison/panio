import { Scale, Chord, Note } from 'tonal';

export type RomanProgression = string[];

export const PROGRESSIONS: Record<string, RomanProgression[]> = {
	Major: [
		['I', 'V', 'vi', 'IV'],
		['I', 'IV', 'V', 'I'],
		['vi', 'IV', 'I', 'V'],
		['I', 'vi', 'IV', 'V'],
		['ii', 'V', 'I', 'IV']
	],
	Dorian: [
		['i', 'IV', 'i', 'IV'],
		['i', 'bVII', 'IV', 'i'],
		['i', 'ii', 'bVII', 'i'],
		['i', 'bIII', 'bVII', 'IV'],
		['i', 'IV', 'bVII', 'bIII']
	],
	Phrygian: [
		['i', 'bII', 'i', 'bII'],
		['i', 'bVII', 'bVI', 'bVII'],
		['i', 'bII', 'bVII', 'i'],
		['i', 'bVI', 'bVII', 'i'],
		['i', 'bIII', 'bVI', 'bII']
	],
	Lydian: [
		['I', 'II', 'I', 'II'],
		['I', 'II', 'vii', 'I'],
		['I', 'vi', 'II', 'V'],
		['I', 'vii', 'II', 'I'],
		['I', 'II', 'vi', 'I']
	],
	Mixolydian: [
		['I', 'bVII', 'IV', 'I'],
		['I', 'bVII', 'I', 'bVII'],
		['I', 'IV', 'bVII', 'I'],
		['I', 'v', 'bVII', 'IV'],
		['I', 'ii', 'bVII', 'I']
	],
	Minor: [
		['i', 'bVI', 'bIII', 'bVII'],
		['i', 'iv', 'bVII', 'bIII'],
		['i', 'bVII', 'bVI', 'bVII'],
		['i', 'ii°', 'bIII', 'iv'],
		['i', 'bVI', 'bVII', 'i']
	],
	Locrian: [
		['i°', 'bII', 'bVII', 'bVI'],
		['i°', 'bVI', 'bVII', 'bII'],
		['i°', 'bVII', 'bVI', 'bVII'],
		['i°', 'bII', 'bIII', 'bVI'],
		['bII', 'i°', 'bII', 'i°']
	],
	'Harmonic Minor': [
		['i', 'V', 'i', 'V'],
		['i', 'iv', 'V', 'i'],
		['i', 'bVI', 'V', 'i'],
		['i', 'ii°', 'V', 'i'],
		['i', 'iv', 'bVI', 'V']
	]
};

export function pickProgression(modeName: string, previous?: RomanProgression): RomanProgression {
	const pool = PROGRESSIONS[modeName] ?? PROGRESSIONS['Major'];
	const candidates = previous !== undefined ? pool.filter((p) => p !== previous) : pool;
	const resolved = candidates.length > 0 ? candidates : pool;
	return resolved[Math.floor(Math.random() * resolved.length)];
}

const DEGREE_MAP: Record<string, number> = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };

export function toChordSymbol(key: string, tonalModeName: string, roman: string): string {
	let r = roman;
	// Strip leading 'b' prefix — it's a theory label, not a flat operation.
	// Mode.notes / Scale.get already return the correct enharmonic pitch at each degree.
	if (r.startsWith('b')) r = r.slice(1);

	// Extract numeral letters (I/V/i/v) and any quality suffix (° + etc.)
	const numeralMatch = r.match(/^([IViv]+)(.*)/);
	if (!numeralMatch) return roman; // fallback: return as-is

	const numeralRaw = numeralMatch[1];
	const suffix = numeralMatch[2]; // '°', '+', '' etc.
	const numeralUpper = numeralRaw.toUpperCase();
	const isMajor = numeralRaw[0] === numeralRaw[0].toUpperCase() && numeralRaw[0] !== numeralRaw[0].toLowerCase();

	const notes = Scale.get(`${key} ${tonalModeName}`).notes;
	const root = notes[DEGREE_MAP[numeralUpper]];
	if (!root) return roman; // fallback if degree not found

	const quality = suffix === '°' ? 'dim' : suffix === '+' ? 'aug' : isMajor ? '' : 'm';
	return root + quality;
}

export function getChordPitchClasses(key: string, tonalModeName: string, roman: string): Set<number> {
	const symbol = toChordSymbol(key, tonalModeName, roman);
	return new Set(
		Chord.get(symbol).notes.map((n) => Note.chroma(n) as number)
	);
}

export function formatProgression(
	progression: RomanProgression,
	key: string,
	tonalModeName: string,
	notation: 'roman' | 'chord'
): string[] {
	if (notation === 'roman') return progression;
	return progression.map((r) => toChordSymbol(key, tonalModeName, r));
}
