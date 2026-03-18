import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';
import type { Style } from '$lib/music/styles';

let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.moodPool,
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.difficultyPool
	)
);
let _lockedStyle = $state<Style | null>(null);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(s.moodPool, s.modePool, s.keyPool, s.difficultyPool, _current);
		if (_lockedStyle) _current = { ..._current, style: _lockedStyle };
	},
	lockStyle(style: Style | null): void {
		_lockedStyle = style;
		if (style) _current = { ..._current, style };
	},
	get lockedStyle() {
		return _lockedStyle;
	}
};
