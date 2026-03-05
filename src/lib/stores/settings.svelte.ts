import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';

export type KeyboardSize = 's' | 'm' | 'l';
export type ProgressionNotation = 'roman' | 'chord';

export interface Settings {
	intervalMin: number;
	modePool: string[];
	keyPool: string[];
	keyboardSize: KeyboardSize;
	progressionNotation: ProgressionNotation;
}

const DEFAULT_SETTINGS: Settings = {
	intervalMin: 3,
	modePool: ['Major', 'Harmonic Minor'],
	keyPool: KEYS,
	keyboardSize: 'm',
	progressionNotation: 'chord'
};

function loadSettings(): Settings {
	if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
	try {
		const raw = localStorage.getItem('piano-settings');
		if (!raw) return DEFAULT_SETTINGS;
		return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
	} catch {
		return DEFAULT_SETTINGS;
	}
}

let _s = $state<Settings>(loadSettings());

$effect.root(() => {
	$effect(() => {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('piano-settings', JSON.stringify(_s));
		}
	});
});

export const settings = {
	get value() { return _s; },
	set(s: Settings) { _s = s; },
	update(fn: (s: Settings) => Settings) { _s = fn(_s); }
};
