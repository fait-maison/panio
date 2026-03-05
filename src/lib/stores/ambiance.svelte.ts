import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';

let _current = $state<Ambiance>(
	generateAmbiance(settings.value.modePool, settings.value.keyPool)
);

export const ambiance = {
	get current() { return _current; },
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.modePool, s.keyPool, _current);
	}
};
