import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';

let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.moodPool,
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.difficultyPool
	)
);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.moodPool, s.modePool, s.keyPool, s.difficultyPool, _current);
	}
};
