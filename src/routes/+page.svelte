<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';
	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import MidiStatus from '$lib/components/MidiStatus.svelte';

	let hoveredChordNotes = $state<Set<number>>(new Set());
	// Clear stale highlights when ambiance changes (e.g. after auto-advance)
	$effect(() => { ambiance.current; hoveredChordNotes = new Set(); });

	onMount(() => midi.init());
	onDestroy(() => midi.destroy());
</script>

<main>
	<h1 class="app-title">{t('app.title')}</h1>
	<AmbianceCard
		ambiance={ambiance.current}
		{timer}
		onChordHover={(notes) => { hoveredChordNotes = notes; }}
	/>
	<PianoKeyboard
		ambiance={ambiance.current}
		pressedNotes={midi.pressedNotes}
		hoverNotes={hoveredChordNotes}
	/>
</main>

<AutoadvanceToast {timer} onSnooze={() => timer.snooze()} />
<SettingsPanel />
<MidiStatus />

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100dvh;
		padding: var(--sp-8) 0 6rem;
		gap: var(--sp-8);
	}

	.app-title {
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		margin: 0;
	}
</style>
