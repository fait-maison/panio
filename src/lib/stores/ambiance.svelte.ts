import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';
import type { Rhythm } from '$lib/music/rhythms';

let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.moodPool,
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.difficultyPool
	)
);
let _lockedRhythm = $state<Rhythm | null>(null);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.moodPool, s.modePool, s.keyPool, s.difficultyPool, _current);
		if (_lockedRhythm) _current = { ..._current, rhythm: _lockedRhythm };
	},
	lockRhythm(rhythm: Rhythm | null): void {
		_lockedRhythm = rhythm;
		if (rhythm) _current = { ..._current, rhythm };
	}
};
