// src/lib/stores/rhythmPlayer.svelte.ts
import { getAudioContext, scheduleNote } from '$lib/audio';
import { Note } from 'tonal';
import type { RhythmPattern, PatternStep } from '$lib/music/rhythmPatterns';
import { totalSteps } from '$lib/music/rhythmPatterns';

const LOOKAHEAD_SEC = 0.1; // schedule 100ms ahead
const SCHEDULE_INTERVAL_MS = 25; // check every 25ms

// Scale degree → semitone offset from root
const DEGREE_SEMITONES: Record<1 | 3 | 5, number> = {
	1: 0, // root
	3: 4, // major third
	5: 7 // perfect fifth
};

function midiForStep(step: PatternStep, rootMidi: number): number {
	const semitones = DEGREE_SEMITONES[step.degree as 1 | 3 | 5] ?? 0;
	return rootMidi + semitones + step.octave * 12;
}

function stepDurationSec(bpm: number): number {
	return 60 / bpm / 4; // 1/16th note in seconds
}

// ── State ──────────────────────────────────────────────────────────────────

let _currentStep = $state(-1);
let _playing = $state(false);

let _pattern: NonNullable<RhythmPattern> | null = null;
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
	const allSteps = [..._pattern.bass, ..._pattern.chords];
	const steps = totalSteps(_pattern.timeSignature);
	const stepDur = stepDurationSec(_bpm);

	while (_nextStepTime < now + LOOKAHEAD_SEC) {
		const notesHere = allSteps.filter((s) => s.step === _stepIndex);
		for (const s of notesHere) {
			const midi = midiForStep(s, _rootMidi);
			const gain = (s.velocity / 127) * 0.9;
			scheduleNote(midi, _nextStepTime, gain);
		}
		_stepQueue.push({ stepIndex: _stepIndex, audioTime: _nextStepTime });
		_nextStepTime += stepDur;
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

export const rhythmPlayer = {
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
	start(pattern: NonNullable<RhythmPattern>, keyNote: string, bpm: number): void {
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
