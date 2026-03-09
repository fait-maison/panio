import Soundfont from 'soundfont-player';
import type { Player } from 'soundfont-player';

let ctx: AudioContext | null = null;
let playerPromise: Promise<Player> | null = null;

function getCtx(): AudioContext {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}

function getPlayer(): Promise<Player> {
	if (!playerPromise) {
		playerPromise = Soundfont.instrument(getCtx(), 'acoustic_grand_piano');
	}
	return playerPromise;
}

export function playNote(midi: number, gain = 1): void {
	void getPlayer().then((player) => player.play(midi, undefined, { gain }));
}

/** Returns the shared AudioContext singleton. Browser-only — do not call during SSR. */
export function getAudioContext(): AudioContext {
	return getCtx();
}

/**
 * Schedule a note to play at a specific AudioContext time.
 * Used by rhythmPlayer for sample-accurate scheduling.
 * The soundfont player must already be loaded before calling with a future timestamp —
 * if the promise resolves after `when`, the note plays immediately or is dropped.
 * @param midi - MIDI note number (0–127)
 * @param when - AudioContext time in seconds (use audioCtx.currentTime + offset)
 * @param gain - volume 0–1
 */
export function scheduleNote(midi: number, when: number, gain = 0.8): void {
	void getPlayer().then((player) => player.play(midi, when, { gain }));
}
