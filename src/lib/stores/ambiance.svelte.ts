import { generateAmbiance, type Ambiance } from '$lib/music/generator';
import { settings } from './settings.svelte';
import type { Style } from '$lib/music/styles';
import type { Pattern } from '$lib/music/patterns';

function pickRandom<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function initialActivePattern(): Pattern | null {
	const pool = settings.value.patternPool;
	return pool.length > 0 ? pickRandom(pool) : null;
}

let _current = $state<Ambiance>(
	generateAmbiance(
		settings.value.moodPool,
		settings.value.modePool,
		settings.value.keyPool,
		settings.value.difficultyPool,
		settings.value.stylePool
	)
);
let _activePattern = $state<Pattern | null>(initialActivePattern());
let _lockedStyle = $state<Style | null>(null);
let _lockedPattern = $state<Pattern | null>(null);

export const ambiance = {
	get current() {
		return _current;
	},
	next() {
		const s = settings.value;
		_current = generateAmbiance(
			s.moodPool,
			s.modePool,
			s.keyPool,
			s.difficultyPool,
			s.stylePool,
			_current
		);
		if (_lockedStyle) _current = { ..._current, style: _lockedStyle };
		if (s.patternPool.length > 0) {
			_activePattern = pickRandom(s.patternPool);
		} else {
			_activePattern = null;
		}
	},
	get activePattern(): Pattern | null {
		return _lockedPattern ?? _activePattern;
	},
	lockStyle(style: Style | null): void {
		_lockedStyle = style;
		if (style) {
			_lockedPattern = null;
			_current = { ..._current, style };
		}
	},
	get lockedStyle() {
		return _lockedStyle;
	},
	lockPattern(pattern: Pattern | null): void {
		_lockedPattern = pattern;
		if (pattern) _lockedStyle = null;
	},
	get lockedPattern() {
		return _lockedPattern;
	}
};
