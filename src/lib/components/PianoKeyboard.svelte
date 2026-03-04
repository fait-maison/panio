<script lang="ts">
	import { Note } from 'tonal';
	import { settingsStore } from '$lib/stores/settings';
	import { getScaleNotes } from '$lib/music/scale';
	import { midiStore } from '$lib/stores/midi';
	import type { Ambiance } from '$lib/music/generator';

	export let ambiance: Ambiance;
	export let pressedNotes: Set<number> = new Set();

	$: scaleNotes = getScaleNotes(ambiance);
	$: rootChroma = Note.chroma(ambiance.key) as number;

	// MIDI range: A0 = 21, C8 = 108
	const MIDI_START = 21;
	const MIDI_END = 108;
	const GAP = 1; // px between white keys

	const SIZE_SCALES: Record<string, number> = { s: 0.65, m: 1.0, l: 1.4 };

	$: scale = SIZE_SCALES[$settingsStore.keyboardSize] ?? 1.0;
	$: WHITE_W = Math.round(28 * scale);
	$: WHITE_H = Math.round(120 * scale);
	$: BLACK_W = Math.round(16 * scale);
	$: BLACK_H = Math.round(74 * scale);

	// Black key semitone positions within an octave (midi % 12): C#=1, D#=3, F#=6, G#=8, A#=10
	const BLACK_KEY_POSITIONS = new Set([1, 3, 6, 8, 10]);

	interface WhiteKey { midi: number; noteName: string; isBlack: false; left: number }
	interface BlackKey { midi: number; noteName: string; isBlack: true;  left: number }

	function buildKeys(whiteW: number, blackW: number): { whites: WhiteKey[]; blacks: BlackKey[] } {
		const whites: WhiteKey[] = [];
		const blacks: BlackKey[] = [];
		let whiteIndex = 0;
		let lastWhiteLeft = 0;
		for (let midi = MIDI_START; midi <= MIDI_END; midi++) {
			const pc = Note.pitchClass(Note.fromMidi(midi));
			if (!BLACK_KEY_POSITIONS.has(midi % 12)) {
				const left = whiteIndex * (whiteW + GAP);
				whites.push({ midi, noteName: pc, isBlack: false, left });
				lastWhiteLeft = left;
				whiteIndex++;
			} else {
				const left = lastWhiteLeft + whiteW - blackW / 2;
				blacks.push({ midi, noteName: pc, isBlack: true, left });
			}
		}
		return { whites, blacks };
	}

	$: ({ whites, blacks } = buildKeys(WHITE_W, BLACK_W));
	$: KEYBOARD_W = 52 * (WHITE_W + GAP) - GAP;

</script>

<div class="keyboard-scroll">
	<div class="keyboard" style="width:{KEYBOARD_W}px; height:{WHITE_H}px; --white-w:{WHITE_W}px; --white-h:{WHITE_H}px; --black-w:{BLACK_W}px; --black-h:{BLACK_H}px;">
		{#each whites as key (key.midi)}
			<div
				class="key white"
				class:in-scale={scaleNotes.has(key.midi % 12)}
				class:is-root={key.midi % 12 === rootChroma}
				class:pressed={pressedNotes.has(key.midi)}
				style="left:{key.left}px"
				role="button"
				tabindex="0"
				aria-label={key.noteName}
				on:pointerdown={() => midiStore.sendNoteOn(key.midi)}
				on:pointerup={() => midiStore.sendNoteOff(key.midi)}
				on:pointerleave={() => midiStore.sendNoteOff(key.midi)}
				on:pointercancel={() => midiStore.sendNoteOff(key.midi)}
			></div>
		{/each}
		{#each blacks as key (key.midi)}
			<div
				class="key black"
				class:in-scale={scaleNotes.has(key.midi % 12)}
				class:is-root={key.midi % 12 === rootChroma}
				class:pressed={pressedNotes.has(key.midi)}
				style="left:{key.left}px"
				role="button"
				tabindex="0"
				aria-label={key.noteName}
				on:pointerdown={() => midiStore.sendNoteOn(key.midi)}
				on:pointerup={() => midiStore.sendNoteOff(key.midi)}
				on:pointerleave={() => midiStore.sendNoteOff(key.midi)}
				on:pointercancel={() => midiStore.sendNoteOff(key.midi)}
			></div>
		{/each}
	</div>
</div>

<style>
	.keyboard-scroll {
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: var(--sp-2);
		display: flex;
		justify-content: center;
	}

	.keyboard {
		position: relative;
	}

	.key {
		position: absolute;
		top: 0;
		border-radius: 0 0 var(--radius-key) var(--radius-key);
		cursor: pointer;
		touch-action: none;
		user-select: none;
	}

	.white {
		width: var(--white-w);
		height: var(--white-h);
		background: var(--key-white);
		border: 1px solid var(--border-key);
		z-index: var(--z-keys);
	}

	.black {
		width: var(--black-w);
		height: var(--black-h);
		background: var(--key-black);
		z-index: 2;
	}

	/* Scale tint */
	.white.in-scale { background: var(--key-scale-white); }
	.black.in-scale { background: var(--key-scale-black); }

	/* Root — overrides scale tint */
	.white.is-root { background: var(--key-root-white); }
	.black.is-root { background: var(--key-root-black); }

	/* Pressed — overrides everything */
	.white.pressed,
	.black.pressed {
		background: var(--key-pressed);
	}
</style>
