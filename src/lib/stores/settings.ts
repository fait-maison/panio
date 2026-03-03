import { writable } from 'svelte/store';
import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';

export type KeyboardSize = 's' | 'm' | 'l';

export interface Settings {
	intervalMin: number;
	modePool: string[];
	keyPool: string[];
	keyboardSize: KeyboardSize;
}

const DEFAULT_SETTINGS: Settings = {
	intervalMin: 3,
	modePool: ['Major', 'Harmonic Minor'],
	keyPool: KEYS,
	keyboardSize: 'm'
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

function createSettingsStore() {
	const { subscribe, set, update } = writable<Settings>(loadSettings());

	function save(s: Settings) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('piano-settings', JSON.stringify(s));
		}
	}

	return {
		subscribe,
		set(s: Settings) {
			save(s);
			set(s);
		},
		update(fn: (s: Settings) => Settings) {
			update((s) => {
				const next = fn(s);
				save(next);
				return next;
			});
		}
	};
}

export const settingsStore = createSettingsStore();
