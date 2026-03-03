let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
	if (!ctx) ctx = new AudioContext();
	return ctx;
}

export function playNote(midi: number): void {
	const audioCtx = getCtx();
	const freq = 440 * Math.pow(2, (midi - 69) / 12);
	const now = audioCtx.currentTime;

	// Longer decay for lower notes, shorter for higher
	const decay = 1.5 + ((108 - midi) / 87) * 1.5;

	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();

	osc.type = 'triangle';
	osc.frequency.value = freq;
	osc.connect(gain);
	gain.connect(audioCtx.destination);

	gain.gain.setValueAtTime(0.5, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

	osc.start(now);
	osc.stop(now + decay);
}
