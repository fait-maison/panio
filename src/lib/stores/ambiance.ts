import { writable, get } from 'svelte/store';
import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settingsStore } from './settings';

function createAmbianceStore() {
	const settings = get(settingsStore);
	const initial = generateAmbiance(settings.modePool, settings.keyPool);
	const { subscribe, set } = writable<Ambiance>(initial);

	return {
		subscribe,
		next() {
			const s = get(settingsStore);
			const current = get({ subscribe });
			set(generateAmbiance(s.modePool, s.keyPool, current));
		}
	};
}

export const ambianceStore = createAmbianceStore();
