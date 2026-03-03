export interface ModeInfo {
	name: string;
	tonalName: string; // name used in tonal.js Scale.get()
	mood: string;
	description: string;
}

export const MODES: ModeInfo[] = [
	{
			name: 'Major',
		tonalName: 'major',
		mood: 'Bright, safe',
		description: 'bright and safe'
	},
	{
		name: 'Minor',
		tonalName: 'aeolian',
		mood: 'Sad, dramatic',
		description: 'sad and dramatic'
	},
	{
		name: 'Harmonic Minor',
		tonalName: 'harmonic minor',
		mood: 'Dramatic, exotic',
		description: 'dramatic and exotic'
	},
	{
		name: 'Dorian',
		tonalName: 'dorian',
		mood: 'Melancholic, bittersweet',
		description: 'melancholic and bittersweet'
	},
	{
		name: 'Phrygian',
		tonalName: 'phrygian',
		mood: 'Dark, threatening',
		description: 'dark and threatening'
	},
	{
		name: 'Lydian',
		tonalName: 'lydian',
		mood: 'Magical, ethereal',
		description: 'magical and ethereal'
	},
	{
		name: 'Mixolydian',
		tonalName: 'mixolydian',
		mood: 'Heroic, open',
		description: 'heroic and open'
	},
	{
		name: 'Locrian',
		tonalName: 'locrian',
		mood: 'Dissonant, dread',
		description: 'dissonant with a sense of dread'
	}
];

export const ALL_MODE_NAMES = MODES.map((m) => m.name);

export const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
