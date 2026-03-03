import { writable, get } from 'svelte/store';
import { settingsStore } from './settings';
import { ambianceStore } from './ambiance';

export type TimerState = 'idle' | 'counting';

export interface TimerStore {
	state: TimerState;
	secondsLeft: number; // seconds remaining in current interval (idle) or countdown (counting)
	totalSeconds: number; // total duration of current interval (for progress computation)
}

function createTimerStore() {
	const initialSecs = get(settingsStore).intervalMin * 60;
	const { subscribe, set, update } = writable<TimerStore>({
		state: 'idle',
		secondsLeft: initialSecs,
		totalSeconds: initialSecs
	});

	let intervalId: ReturnType<typeof setInterval> | null = null;

	function clearTimer() {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function startInterval() {
		clearTimer();
		const secs = get(settingsStore).intervalMin * 60;
		set({ state: 'idle', secondsLeft: secs, totalSeconds: secs });

		intervalId = setInterval(() => {
			update((s) => {
				if (s.state === 'idle') {
					if (s.secondsLeft <= 1) {
						// Transition to countdown
						return { state: 'counting', secondsLeft: 5, totalSeconds: s.totalSeconds };
					}
					return { ...s, secondsLeft: s.secondsLeft - 1 };
				} else {
					// counting state
					if (s.secondsLeft <= 1) {
						// Auto-advance
						ambianceStore.next();
						clearTimer();
						// Restart after advancing
						setTimeout(() => startInterval(), 0);
						const nextSecs = get(settingsStore).intervalMin * 60;
					return { state: 'idle', secondsLeft: nextSecs, totalSeconds: nextSecs };
					}
					return { ...s, secondsLeft: s.secondsLeft - 1 };
				}
			});
		}, 1000);
	}

	function snooze() {
		clearTimer();
		startInterval();
	}

	// Start automatically
	startInterval();

	// Restart when interval setting changes
	settingsStore.subscribe((s) => {
		const current = get({ subscribe });
		if (current.state === 'idle') {
			clearTimer();
			const secs = s.intervalMin * 60;
			set({ state: 'idle', secondsLeft: secs, totalSeconds: secs });
			startInterval();
		}
	});

	return {
		subscribe,
		snooze,
		restart: startInterval
	};
}

export const timerStore = createTimerStore();
