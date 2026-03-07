<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chord, Note } from 'tonal';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { chordToRoman } from '$lib/music/progressions';

	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';

	function skipAmbiance() {
		ambiance.next();
		timer.restart();
	}

	let hoveredChordNotes = $state<Set<number>>(new Set());
	let hoveredChordRoot = $state<number | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- read ambiance.current to track reactive dependency
	$effect(() => {
		ambiance.current;
		hoveredChordNotes = new Set();
		hoveredChordRoot = null;
	});

	// Chord detection from currently held MIDI notes
	// Sort by pitch so detection is consistent regardless of key press order
	let detectedChord = $derived.by(() => {
		const midiNotes = [...midi.pressedNotes];
		if (midiNotes.length < 2) return null;
		const noteNames = midiNotes.sort((a, b) => a - b).map((n) => Note.fromMidi(n));
		const symbols = Chord.detect(noteNames);
		if (!symbols.length) return null;
		// Prefer Major/Minor over exotic qualities (e.g. CM/E over Em#5)
		const best =
			symbols.find((s) => {
				const q = Chord.get(s).quality;
				return q === 'Major' || q === 'Minor';
			}) ?? symbols[0];
		const chord = Chord.get(best);
		// Format label to match app convention: C not CM, Dm not Dmin
		const afterTonic = best.slice(chord.tonic?.length ?? 0);
		const label = (chord.tonic ?? '') + afterTonic.replace(/^(M(?!aj|in)|\^)/, '');
		return { label, root: chord.tonic ? Note.chroma(chord.tonic) : null };
	});

	// Fade-out: keep label visible ~1s after all keys released
	let displayedChord = $state<typeof detectedChord>(null);
	let _fadeTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (detectedChord) {
			if (_fadeTimer) {
				clearTimeout(_fadeTimer);
				_fadeTimer = null;
			}
			displayedChord = detectedChord;
		} else {
			_fadeTimer = setTimeout(() => {
				displayedChord = null;
			}, 1000);
		}
		return () => {
			if (_fadeTimer) {
				clearTimeout(_fadeTimer);
				_fadeTimer = null;
			}
		};
	});

	let chordLabel = $derived(
		displayedChord
			? settings.value.progressionNotation === 'roman'
				? chordToRoman(displayedChord.label, ambiance.current.key, ambiance.current.mode.tonalName)
				: displayedChord.label
			: null
	);

	let wakeLock: WakeLockSentinel | null = null;

	async function requestWakeLock() {
		if (!('wakeLock' in navigator)) return;
		try {
			wakeLock = await navigator.wakeLock.request('screen');
		} catch {
			/* permission denied or low battery — silently skip */
		}
	}

	function onVisibilityChange() {
		if (document.visibilityState === 'visible') void requestWakeLock();
	}

	onMount(() => {
		void midi.init();
		void requestWakeLock();
		document.addEventListener('visibilitychange', onVisibilityChange);
	});

	onDestroy(() => {
		midi.destroy();
		if (typeof document !== 'undefined') {
			void wakeLock?.release();
			document.removeEventListener('visibilitychange', onVisibilityChange);
		}
	});
</script>

<main class="exercise">
	<div class="content">
		<AmbianceCard
			ambiance={ambiance.current}
			{timer}
			onChordHover={(notes: Set<number>, root: number | null) => {
				hoveredChordNotes = notes;
				hoveredChordRoot = root;
			}}
			onSkip={skipAmbiance}
		/>
	</div>
	<div class="keyboard-wrapper">
		{#if chordLabel}
			<div class="chord-label" class:fading={!detectedChord}>
				{chordLabel}
			</div>
		{/if}
		<PianoKeyboard
			ambiance={ambiance.current}
			pressedNotes={midi.pressedNotes}
			hoverNotes={hoveredChordNotes}
			hoverRootNote={hoveredChordRoot}
		/>
	</div>
</main>

<AutoadvanceToast {timer} onSnooze={() => timer.snooze()} />

<style>
	.exercise {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100dvh;
		padding-top: 52px;
	}

	.content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow-y: auto;
		min-height: 0;
		padding-bottom: var(--sp-8);
	}

	.keyboard-wrapper {
		position: relative;
		width: 100%;
	}

	.chord-label {
		position: absolute;
		top: -2.2rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text);
		background: var(--surface);
		border: 1px solid var(--border-key);
		border-radius: var(--radius);
		padding: 0.2rem 0.75rem;
		pointer-events: none;
		white-space: nowrap;
		z-index: var(--z-fab);
		opacity: 1;
		transition: opacity 0.4s ease;
	}

	.chord-label.fading {
		opacity: 0;
		transition: opacity 0.6s ease;
	}

	@media (max-width: 480px), (max-height: 500px) and (orientation: landscape) {
		.exercise {
			padding-top: 0;
			height: 100dvh;
			overflow: hidden;
		}

		.content {
			padding: 48px var(--sp-2) var(--sp-2);
			overflow-y: auto;
			min-height: 0;
		}
	}
</style>
