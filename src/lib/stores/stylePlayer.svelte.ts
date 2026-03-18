// src/lib/stores/stylePlayer.svelte.ts
import { getAudioContext, scheduleNote } from '$lib/audio';
import { scheduleMidiNote } from '$lib/stores/midi.svelte';
import { settings } from '$lib/stores/settings.svelte';
import { Note } from 'tonal';
import type { PatternDef } from '$lib/music/stylePatterns';
import { totalSteps } from '$lib/music/stylePatterns';

const LOOKAHEAD_SEC = 0.1; // schedule 100ms ahead
const SCHEDULE_INTERVAL_MS = 25; // check every 25ms

function stepDurationSec(bpm: number): number {
	return 60 / bpm / 4; // 1/16th note in seconds
}

// ── State ──────────────────────────────────────────────────────────────────

let _currentStep = $state(-1);
let _playing = $state(false);

let _pattern: PatternDef | null = null;
let _rootMidi = 60; // C4
let _bpm = 120;

let _nextStepTime = 0;
let _stepIndex = 0;
let _schedulerTimer: ReturnType<typeof setInterval> | null = null;
let _stepQueue: Array<{ stepIndex: number; audioTime: number }> = [];

// ── Scheduler ──────────────────────────────────────────────────────────────

function scheduleAhead(): void {
	if (!_pattern) return;
	const ctx = getAudioContext();
	const now = ctx.currentTime;
	const steps = totalSteps(_pattern.timeSignature);
	const stepDur = stepDurationSec(_bpm);

	while (_nextStepTime < now + LOOKAHEAD_SEC) {
		const volume = settings.value.volume;
		const noteParams = (s: { velocity: number; duration: number }) => ({
			gain: (s.velocity / 127) * 0.9 * volume,
			dur: s.duration * stepDur * 0.9
		});

		// Bass: one note per semitone offset (single note for bass lines, occasionally multi)
		for (const s of _pattern.bass.filter((s) => s.step === _stepIndex)) {
			const { gain, dur } = noteParams(s);
			for (const semi of s.semitones) {
				const note = _rootMidi + semi + s.octave * 12;
				scheduleNote(note, _nextStepTime, gain, dur);
				scheduleMidiNote(note, s.velocity, _nextStepTime, now, dur);
			}
		}
		// Chords: play all semitone offsets (triad, 7th, inversion — whatever the pattern specifies)
		for (const s of _pattern.chords.filter((s) => s.step === _stepIndex)) {
			const { gain, dur } = noteParams(s);
			for (const semi of s.semitones) {
				const note = _rootMidi + semi + s.octave * 12;
				scheduleNote(note, _nextStepTime, gain, dur);
				scheduleMidiNote(note, s.velocity, _nextStepTime, now, dur);
			}
		}
		_stepQueue.push({ stepIndex: _stepIndex, audioTime: _nextStepTime });

		// Swing timing: odd steps land late (+sw), even steps land early (-sw).
		// Total bar duration is unchanged — every push is matched by a pull.
		const sw = _pattern.swing * stepDur;
		_nextStepTime += _stepIndex % 2 === 0 ? stepDur + sw : stepDur - sw;
		_stepIndex = (_stepIndex + 1) % steps;
	}

	// Advance playhead based on actual audio time (not schedule time)
	while (_stepQueue.length > 0 && _stepQueue[0].audioTime <= now) {
		_currentStep = _stepQueue[0].stepIndex; // $state write from setInterval — intentional, standard pattern for this codebase
		_stepQueue.shift();
	}
}

function startScheduler(): void {
	const ctx = getAudioContext();
	_nextStepTime = ctx.currentTime;
	_stepIndex = 0;
	_currentStep = 0;
	_schedulerTimer = setInterval(scheduleAhead, SCHEDULE_INTERVAL_MS);
}

function stopScheduler(): void {
	if (_schedulerTimer !== null) {
		clearInterval(_schedulerTimer);
		_schedulerTimer = null;
	}
	_currentStep = -1;
	_stepIndex = 0;
	_stepQueue = [];
}

// ── Public API ─────────────────────────────────────────────────────────────

export const stylePlayer = {
	get currentStep() {
		return _currentStep;
	},
	get playing() {
		return _playing;
	},

	/**
	 * Start playback. Pre-warms the soundfont player via getAudioContext()
	 * before launching the scheduler so timestamps are always in the future.
	 */
	start(pattern: PatternDef, keyNote: string, bpm: number): void {
		// Stop any running scheduler before restarting (prevents double-scheduling
		// if start() is called while already playing, e.g. on key change)
		stopScheduler();
		_pattern = pattern;
		// Note.midi returns e.g. 48 for C3 — left-hand piano register
		_rootMidi = Note.midi(`${keyNote}3`) ?? 48;
		_bpm = bpm;
		_playing = true;
		// Initialize AudioContext now (triggers lazy creation if needed)
		getAudioContext();
		startScheduler();
	},

	stop(): void {
		stopScheduler();
		_playing = false;
		_pattern = null;
	},

	/** Update BPM live — scheduler reads _bpm on next tick, no restart needed. */
	setBpm(bpm: number): void {
		_bpm = bpm;
	}
};
