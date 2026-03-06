<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';

	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';

	function skipAmbiance() {
		ambiance.next();
		timer.restart();
	}

	let hoveredChordNotes = $state<Set<number>>(new Set());
	let hoveredChordRoot = $state<number | null>(null);
	$effect(() => { ambiance.current; hoveredChordNotes = new Set(); hoveredChordRoot = null; });

	let wakeLock: WakeLockSentinel | null = null;

	async function requestWakeLock() {
		if (!('wakeLock' in navigator)) return;
		try { wakeLock = await navigator.wakeLock.request('screen'); }
		catch { /* permission denied or low battery — silently skip */ }
	}

	function onVisibilityChange() {
		if (document.visibilityState === 'visible') requestWakeLock();
	}

	onMount(() => {
		midi.init();
		requestWakeLock();
		document.addEventListener('visibilitychange', onVisibilityChange);
	});

	onDestroy(() => {
		midi.destroy();
		wakeLock?.release();
		document.removeEventListener('visibilitychange', onVisibilityChange);
	});
</script>

<main class="exercise">
	<div class="content">
		<AmbianceCard
			ambiance={ambiance.current}
			{timer}
			onChordHover={(notes, root) => { hoveredChordNotes = notes; hoveredChordRoot = root; }}
			onSkip={skipAmbiance}
		/>
	</div>
	<PianoKeyboard
		ambiance={ambiance.current}
		pressedNotes={midi.pressedNotes}
		hoverNotes={hoveredChordNotes}
		hoverRootNote={hoveredChordRoot}
	/>
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
