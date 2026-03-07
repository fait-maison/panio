import { Scale, Chord, Note } from 'tonal';

export type RomanProgression = string[];
export type Difficulty = 'simple' | 'rich' | 'complex';

const PROGRESSIONS: Record<string, Record<Difficulty, RomanProgression[]>> = {
	Major: {
		simple: [
			['I', 'V', 'vi', 'IV'],
			['I', 'IV', 'V', 'I'],
			['vi', 'IV', 'I', 'V'],
			['I', 'vi', 'IV', 'V'],
			['ii', 'V', 'I', 'IV'],
			['I', 'vi', 'ii', 'V'],
			['I', 'V', 'vi', 'iii'],
			['iii', 'IV', 'I', 'V'],
			['IV', 'I', 'V', 'vi'],
			['I', 'IV', 'vi', 'V']
		],
		rich: [
			['Imaj7', 'V7', 'vim7', 'IVmaj7'],
			['Imaj7', 'IVmaj7', 'iim7', 'V7'],
			['vim7', 'IVmaj7', 'Imaj7', 'V7'],
			['iim7', 'V7', 'Imaj7', 'IVmaj7'],
			['Imaj7', 'iiim7', 'IVmaj7', 'V7'],
			['Imaj7', 'vim7', 'iim7', 'V7'],
			['Imaj7', 'V7', 'vim7', 'iiim7'],
			['iiim7', 'IVmaj7', 'Imaj7', 'V7'],
			['IVmaj7', 'Imaj7', 'V7', 'vim7'],
			['Imaj7', 'IVmaj7', 'vim7', 'V7']
		],
		complex: [
			['Imaj9', 'V9', 'vim9', 'IVmaj9'],
			['Imaj9', 'IVmaj9', 'iim9', 'V9'],
			['vim9', 'IVmaj9', 'Imaj9', 'V9'],
			['iim9', 'V9', 'Imaj9', 'IVsus4'],
			['Imaj9', 'iiim7', 'IVmaj9', 'V9'],
			['Imaj9', 'vim9', 'iim9', 'V9'],
			['Imaj9', 'V9', 'vim9', 'iiim7'],
			['iiim7', 'IVmaj9', 'Imaj9', 'V9'],
			['IVmaj9', 'Imaj9', 'V9', 'vim9'],
			['Imaj9', 'IVmaj9', 'vim9', 'V9']
		]
	},
	Minor: {
		simple: [
			['i', 'bVI', 'bIII', 'bVII'],
			['i', 'iv', 'bVII', 'bIII'],
			['i', 'bVII', 'bVI', 'bVII'],
			['i', 'ii°', 'bIII', 'iv'],
			['i', 'bVI', 'bVII', 'i']
		],
		rich: [
			['im7', 'bVImaj7', 'bIIImaj7', 'bVII7'],
			['im7', 'ivm7', 'bVII7', 'bIIImaj7'],
			['im7', 'bVII7', 'bVImaj7', 'bVII7'],
			['im7', 'ii°', 'bIIImaj7', 'ivm7'],
			['im7', 'bVImaj7', 'bVII7', 'im7']
		],
		complex: [
			['im9', 'bVImaj9', 'bIIImaj9', 'bVII9'],
			['im9', 'ivm9', 'bVII9', 'bIIImaj9'],
			['im9', 'bVII9', 'bVImaj9', 'bVII9'],
			['im9', 'ivm9', 'bVIsus4', 'bVII9'],
			['im9', 'bVImaj9', 'bVII9', 'im9']
		]
	},
	'Harmonic Minor': {
		simple: [
			['i', 'V', 'i', 'V'],
			['i', 'iv', 'V', 'i'],
			['i', 'bVI', 'V', 'i'],
			['i', 'ii°', 'V', 'i'],
			['i', 'iv', 'bVI', 'V'],
			['i', 'vii°', 'V', 'i'],
			['bVI', 'V', 'i', 'V'],
			['i', 'iv', 'vii°', 'V'],
			['i', 'bVI', 'iv', 'V'],
			['i', 'III+', 'bVI', 'V']
		],
		rich: [
			['im7', 'ivm7', 'V7', 'im7'],
			['im7', 'V7', 'im7', 'V7'],
			['im7', 'bVImaj7', 'V7', 'im7'],
			['im7', 'ii°', 'V7', 'im7'],
			['im7', 'ivm7', 'bVImaj7', 'V7'],
			['im7', 'vii°', 'V7', 'im7'],
			['bVImaj7', 'V7', 'im7', 'V7'],
			['im7', 'ivm7', 'vii°', 'V7'],
			['im7', 'bVImaj7', 'ivm7', 'V7'],
			['im7', 'ii°', 'bVImaj7', 'V7']
		],
		complex: [
			['im9', 'ivm9', 'V9', 'im9'],
			['im9', 'V9', 'bVImaj9', 'im9'],
			['im9', 'bVImaj9', 'V9', 'im9'],
			['im9', 'ii°7', 'V9', 'im9'],
			['im9', 'ivm9', 'bVImaj9', 'V9'],
			['im9', 'vii°', 'V9', 'im9'],
			['bVImaj9', 'V9', 'im9', 'V9'],
			['im9', 'ivm9', 'vii°', 'V9'],
			['im9', 'bVImaj9', 'ivm9', 'V9'],
			['im9', 'ii°7', 'bVImaj9', 'V9']
		]
	},
	Dorian: {
		simple: [
			['i', 'IV', 'i', 'IV'],
			['i', 'bVII', 'IV', 'i'],
			['i', 'ii', 'bVII', 'i'],
			['i', 'bIII', 'bVII', 'IV'],
			['i', 'IV', 'bVII', 'bIII']
		],
		rich: [
			['im7', 'IVmaj7', 'im7', 'IVmaj7'],
			['im7', 'bVIImaj7', 'IVmaj7', 'im7'],
			['im7', 'iim7', 'bVIImaj7', 'im7'],
			['im7', 'bIIImaj7', 'bVIImaj7', 'IVmaj7'],
			['im7', 'IVmaj7', 'bVIImaj7', 'bIIImaj7']
		],
		complex: [
			['im9', 'IVmaj9', 'im9', 'IVmaj9'],
			['im9', 'bVIImaj9', 'IVmaj9', 'im9'],
			['im9', 'iim9', 'bVIImaj9', 'im9'],
			['im9', 'bIIImaj9', 'bVIImaj9', 'IVmaj9'],
			['im9', 'IVmaj9', 'bVIImaj9', 'bIIImaj9']
		]
	},
	Phrygian: {
		simple: [
			['i', 'bII', 'i', 'bII'],
			['i', 'bVII', 'bVI', 'bVII'],
			['i', 'bII', 'bVII', 'i'],
			['i', 'bVI', 'bVII', 'i'],
			['i', 'bIII', 'bVI', 'bII']
		],
		rich: [
			['im7', 'bIImaj7', 'im7', 'bIImaj7'],
			['im7', 'bVII7', 'bVImaj7', 'bVII7'],
			['im7', 'bIImaj7', 'bVII7', 'im7'],
			['im7', 'bVImaj7', 'bVII7', 'im7'],
			['im7', 'bIIImaj7', 'bVImaj7', 'bIImaj7']
		],
		complex: [
			['im9', 'bIImaj9', 'im9', 'bIImaj9'],
			['im9', 'bVIIsus4', 'bVImaj9', 'bVIIsus4'],
			['im9', 'bIImaj9', 'bVIIsus4', 'im9'],
			['im9', 'bVImaj9', 'bVIImaj7', 'im9'],
			['im9', 'bIIImaj9', 'bVImaj9', 'bIImaj9']
		]
	},
	Lydian: {
		simple: [
			['I', 'II', 'I', 'II'],
			['I', 'II', 'vii', 'I'],
			['I', 'vi', 'II', 'V'],
			['I', 'vii', 'II', 'I'],
			['I', 'II', 'vi', 'I']
		],
		rich: [
			['Imaj7', 'IImaj7', 'Imaj7', 'IImaj7'],
			['Imaj7', 'IImaj7', 'viim7', 'Imaj7'],
			['Imaj7', 'vim7', 'IImaj7', 'V7'],
			['Imaj7', 'viim7', 'IImaj7', 'Imaj7'],
			['Imaj7', 'IImaj7', 'vim7', 'Imaj7']
		],
		complex: [
			['Imaj9', 'IImaj9', 'Imaj9', 'IImaj9'],
			['Imaj9', 'IImaj9', 'viim9', 'Imaj9'],
			['Imaj9', 'vim9', 'IImaj9', 'V9'],
			['Imaj9', 'viim9', 'IImaj9', 'Imaj9'],
			['Imaj9', 'IIsus4', 'vim9', 'Imaj9']
		]
	},
	Mixolydian: {
		simple: [
			['I', 'bVII', 'IV', 'I'],
			['I', 'bVII', 'I', 'bVII'],
			['I', 'IV', 'bVII', 'I'],
			['I', 'v', 'bVII', 'IV'],
			['I', 'ii', 'bVII', 'I']
		],
		rich: [
			['Imaj7', 'bVIImaj7', 'IVmaj7', 'Imaj7'],
			['Imaj7', 'bVIImaj7', 'Imaj7', 'bVIImaj7'],
			['Imaj7', 'IVmaj7', 'bVIImaj7', 'Imaj7'],
			['Imaj7', 'vm7', 'bVIImaj7', 'IVmaj7'],
			['Imaj7', 'iim7', 'bVIImaj7', 'Imaj7']
		],
		complex: [
			['Imaj9', 'bVIImaj9', 'IVmaj9', 'Imaj9'],
			['Imaj9', 'bVIImaj9', 'Imaj9', 'bVIImaj9'],
			['Imaj9', 'IVmaj9', 'bVIImaj9', 'Imaj9'],
			['Imaj9', 'vm9', 'bVIImaj9', 'IVmaj9'],
			['Imaj9', 'iim9', 'bVIIsus4', 'Imaj9']
		]
	},
	Locrian: {
		simple: [
			['i°', 'bII', 'bVII', 'bVI'],
			['i°', 'bVI', 'bVII', 'bII'],
			['i°', 'bVII', 'bVI', 'bVII'],
			['i°', 'bII', 'bIII', 'bVI'],
			['bII', 'i°', 'bII', 'i°']
		],
		rich: [
			['i°', 'bIImaj7', 'bVII7', 'bVImaj7'],
			['i°', 'bVImaj7', 'bVII7', 'bIImaj7'],
			['i°', 'bVII7', 'bVImaj7', 'bVII7'],
			['i°', 'bIImaj7', 'bIIImaj7', 'bVImaj7'],
			['bIImaj7', 'i°', 'bIImaj7', 'i°']
		],
		complex: [
			['i°7', 'bIImaj9', 'bVII9', 'bVImaj9'],
			['i°7', 'bVImaj9', 'bVII9', 'bIImaj9'],
			['i°', 'bVII9', 'bVImaj9', 'bVII9'],
			['i°7', 'bIImaj9', 'bIIImaj9', 'bVImaj9'],
			['bIImaj9', 'i°7', 'bIImaj9', 'i°7']
		]
	}
};

export { PROGRESSIONS };

export function pickProgression(
	modeName: string,
	difficulty: Difficulty,
	previous?: RomanProgression
): RomanProgression {
	const modeEntry = PROGRESSIONS[modeName] ?? PROGRESSIONS['Major'];
	const pool = modeEntry[difficulty];
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

	// Extract numeral letters (I/V/i/v) and any suffix (°, +, extension, etc.)
	const numeralMatch = r.match(/^([IViv]+)(.*)/);
	if (!numeralMatch) return roman; // fallback: return as-is

	const numeralRaw = numeralMatch[1];
	const rawSuffix = numeralMatch[2]; // e.g. '°', '°7', 'maj7', 'm7', '7', 'sus4', ''
	const numeralUpper = numeralRaw.toUpperCase();
	const isMajor = numeralRaw[0] === numeralRaw[0].toUpperCase() && numeralRaw[0] !== numeralRaw[0].toLowerCase();

	const notes = Scale.get(`${key} ${tonalModeName}`).notes;
	const root = notes[DEGREE_MAP[numeralUpper]];
	if (!root) return roman; // fallback if degree not found

	// Determine base quality and extract the extension suffix
	let baseQuality: string;
	let extension: string;

	if (rawSuffix.startsWith('°')) {
		baseQuality = 'dim';
		extension = rawSuffix.slice(1); // e.g. '7' from '°7', '' from '°'
	} else if (rawSuffix.startsWith('+')) {
		baseQuality = 'aug';
		extension = rawSuffix.slice(1);
	} else {
		baseQuality = isMajor ? '' : 'm';
		extension = rawSuffix; // e.g. 'maj7', 'm7', '7', 'sus4', ''
	}

	// Strip redundant quality prefix from extension when chord is already minor
	// e.g. im7 → quality 'm', extension 'm7' → strip 'm' → '7' → 'Dm7' (not 'Dmm7')
	if (baseQuality === 'm' && /^m\d/.test(extension)) {
		extension = extension.slice(1);
	}

	return root + baseQuality + extension;
}

export function getChordPitchClasses(key: string, tonalModeName: string, roman: string): Set<number> {
	const symbol = toChordSymbol(key, tonalModeName, roman);
	return new Set(
		Chord.get(symbol).notes.map((n) => Note.chroma(n) as number)
	);
}

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

function chromaToNumeral(chroma: number, chromas: number[]): string | null {
	const idx = chromas.indexOf(chroma);
	if (idx >= 0) return NUMERALS[idx];
	const aboveIdx = chromas.indexOf((chroma + 1) % 12);
	if (aboveIdx >= 0) return 'b' + NUMERALS[aboveIdx];
	const belowIdx = chromas.indexOf((chroma + 11) % 12);
	if (belowIdx >= 0) return '#' + NUMERALS[belowIdx];
	return null;
}

export function chordToRoman(chordLabel: string, key: string, tonalModeName: string): string {
	const slashIdx = chordLabel.indexOf('/');
	const baseLabel = slashIdx >= 0 ? chordLabel.slice(0, slashIdx) : chordLabel;
	const chord = Chord.get(baseLabel);
	if (!chord.tonic) return chordLabel;
	const scale = Scale.get(`${key} ${tonalModeName}`);
	if (!scale.notes.length) return chordLabel;
	const chromas = scale.notes.map((n) => Note.chroma(n) as number);
	const rootNumeral = chromaToNumeral(Note.chroma(chord.tonic) as number, chromas);
	if (!rootNumeral) return chordLabel;
	const isMinor = chord.quality === 'Minor' || chord.quality === 'Diminished';
	const numeral = isMinor ? rootNumeral.toLowerCase() : rootNumeral;
	let suffix = baseLabel.slice(chord.tonic.length);
	if (suffix.startsWith('dim')) suffix = '°' + suffix.slice(3);
	else if (suffix.startsWith('aug')) suffix = '+' + suffix.slice(3);
	else if (suffix === 'm') suffix = '';
	let result = numeral + suffix;
	if (slashIdx >= 0) {
		const bassNote = chordLabel.slice(slashIdx + 1);
		const bassNumeral = chromaToNumeral(Note.chroma(bassNote) as number, chromas);
		result += '/' + (bassNumeral ?? bassNote);
	}
	return result;
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
