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

export function getAudioContext(): AudioContext {
	return getCtx();
}

/**
 * Schedule a note to play at a specific AudioContext time.
 * Used by rhythmPlayer for sample-accurate scheduling.
 * @param midi - MIDI note number (0–127)
 * @param when - AudioContext time in seconds (use audioCtx.currentTime + offset)
 * @param gain - volume 0–1
 */
export function scheduleNote(midi: number, when: number, gain = 0.8): void {
	void getPlayer().then((player) => player.play(midi, when, { gain }));
}
