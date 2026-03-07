declare module 'soundfont-player' {
	interface Player {
		play(
			note: string | number,
			time?: number,
			options?: { gain?: number; duration?: number }
		): AudioBufferSourceNode;
		stop(): void;
	}
	interface Soundfont {
		instrument(ctx: AudioContext, name: string, options?: Record<string, unknown>): Promise<Player>;
	}
	const Soundfont: Soundfont;
	export default Soundfont;
	export type { Player };
}
