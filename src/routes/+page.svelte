<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambianceStore } from '$lib/stores/ambiance';
	import { timerStore } from '$lib/stores/timer';
	import { midiStore } from '$lib/stores/midi';
	import { t } from '$lib/i18n';
	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';
	import SettingsPanel from '$lib/components/SettingsPanel.svelte';
	import MidiStatus from '$lib/components/MidiStatus.svelte';

	let hoveredChordNotes: Set<number> = new Set();
	// Clear stale highlights when ambiance changes (e.g. after auto-advance)
	$: if ($ambianceStore) hoveredChordNotes = new Set();

	onMount(() => {
		midiStore.init();
	});

	onDestroy(() => {
		midiStore.destroy();
	});
</script>

<main>
	<h1 class="app-title">{$t('app.title')}</h1>
	<AmbianceCard
		ambiance={$ambianceStore}
		timer={$timerStore}
		onChordHover={(notes) => { hoveredChordNotes = notes; }}
	/>
	<PianoKeyboard
		ambiance={$ambianceStore}
		pressedNotes={$midiStore}
		hoverNotes={hoveredChordNotes}
	/>
</main>

<AutoadvanceToast timer={$timerStore} onSnooze={() => timerStore.snooze()} />
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
