<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';

	function skipAmbiance() {
		ambiance.next();
		timer.restart();
	}
	import AmbianceCard from '$lib/components/AmbianceCard.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import AutoadvanceToast from '$lib/components/AutoadvanceToast.svelte';
	import ExerciseSettingsFab from '$lib/components/ExerciseSettingsFab.svelte';
	import MidiStatus from '$lib/components/MidiStatus.svelte';

	let hoveredChordNotes = $state<Set<number>>(new Set());
	let hoveredChordRoot = $state<number | null>(null);
	// Clear stale highlights when ambiance changes (e.g. after auto-advance)
	$effect(() => { ambiance.current; hoveredChordNotes = new Set(); hoveredChordRoot = null; });

	onMount(() => midi.init());
	onDestroy(() => midi.destroy());
</script>

<main>
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
<ExerciseSettingsFab />
<MidiStatus />

<style>
	main {
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
	}

	@media (max-width: 480px) {
		.content {
			padding: var(--sp-2);
		}
	}

</style>
