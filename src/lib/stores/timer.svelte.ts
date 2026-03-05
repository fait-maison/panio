import { untrack } from 'svelte';
import { settings } from './settings.svelte';
import { ambiance } from './ambiance.svelte';

export type TimerState = 'idle' | 'counting';

export interface TimerSnapshot {
	state: TimerState;
	secondsLeft: number;
	totalSeconds: number;
}

const initialSecs = settings.value.intervalMin * 60;
let _t = $state<TimerSnapshot>({
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
	const secs = settings.value.intervalMin * 60;
	_t = { state: 'idle', secondsLeft: secs, totalSeconds: secs };

	intervalId = setInterval(() => {
		if (_t.state === 'idle') {
			if (_t.secondsLeft <= 1) {
				_t = { state: 'counting', secondsLeft: 5, totalSeconds: _t.totalSeconds };
			} else {
				_t = { ..._t, secondsLeft: _t.secondsLeft - 1 };
			}
		} else {
			// counting state
			if (_t.secondsLeft <= 1) {
				// Auto-advance
				ambiance.next();
				clearTimer();
				setTimeout(() => startInterval(), 0);
				const nextSecs = settings.value.intervalMin * 60;
				_t = { state: 'idle', secondsLeft: nextSecs, totalSeconds: nextSecs };
			} else {
				_t = { ..._t, secondsLeft: _t.secondsLeft - 1 };
			}
		}
	}, 1000);
}

function snooze() {
	clearTimer();
	startInterval();
}

// Auto-start on module load
startInterval();

// Restart when interval setting changes (untrack _t to avoid re-running every tick)
$effect.root(() => {
	$effect(() => {
		const mins = settings.value.intervalMin; // tracked dependency
		if (untrack(() => _t.state === 'idle')) {
			clearTimer();
			const secs = mins * 60;
			_t = { state: 'idle', secondsLeft: secs, totalSeconds: secs };
			startInterval();
		}
	});
});

export const timer = {
	get state()        { return _t.state; },
	get secondsLeft()  { return _t.secondsLeft; },
	get totalSeconds() { return _t.totalSeconds; },
	snooze,
	restart: startInterval
};
