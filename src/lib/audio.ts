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
	getPlayer().then((player) => player.play(midi, undefined, { gain }));
}
