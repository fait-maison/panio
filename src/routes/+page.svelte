<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { ambiance } from '$lib/stores/ambiance.svelte';
	import { timer } from '$lib/stores/timer.svelte';
	import { midi } from '$lib/stores/midi.svelte';
	import { exercise } from '$lib/stores/exercise.svelte';
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

	onMount(() => midi.init());
	onDestroy(() => midi.destroy());

	const exercises = [
		{ key: 'sandbox', active: true },
		{ key: 'scenes', active: false },
		{ key: 'ear', active: false },
		{ key: 'rhythm', active: false }
	] as const;
</script>

{#if exercise.current === null}
	<!-- Landing page -->
	<main class="landing">
		<div class="hero">
			<h1>{t('landing.title')}</h1>
			<p>{t('landing.subtitle')}</p>
		</div>
		<div class="exercise-grid">
			{#each exercises as ex}
				<button
					class="exercise-card"
					class:disabled={!ex.active}
					disabled={!ex.active}
					onclick={() => exercise.set(ex.key)}
				>
					<span class="exercise-name">{t('exercise.' + ex.key)}</span>
					<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
					{#if !ex.active}
						<span class="badge-soon">{t('badge.soon')}</span>
					{/if}
				</button>
			{/each}
		</div>
	</main>
{:else}
	<!-- Exercise view (sandbox) -->
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
{/if}


<style>
	/* Landing page */
	.landing {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100dvh;
		padding-top: 52px;
		gap: var(--sp-8);
	}

	.hero {
		text-align: center;
		padding: var(--sp-8) var(--sp-4) 0;
	}

	.hero h1 {
		font-family: var(--font-display);
		font-size: 2.4rem;
		color: var(--text);
		line-height: 1.2;
		margin-bottom: var(--sp-3);
	}

	.hero p {
		font-size: 1rem;
		color: var(--text-muted);
		max-width: 360px;
		margin: 0 auto;
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-4);
		max-width: 520px;
		width: 100%;
		padding: 0 var(--sp-4);
	}

	.exercise-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--sp-2);
		padding: var(--sp-6) var(--sp-5);
		background: var(--surface);
		border: none;
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card);
		cursor: pointer;
		text-align: left;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
		position: relative;
	}

	@media (hover: hover) {
		.exercise-card:not(.disabled):hover {
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-2px);
		}
	}

	.exercise-card.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.exercise-name {
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: var(--text);
	}

	.exercise-desc {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.4;
	}

	.badge-soon {
		position: absolute;
		top: var(--sp-3);
		right: var(--sp-3);
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		background: rgba(0, 0, 0, 0.06);
		padding: 2px 8px;
		border-radius: var(--radius-pill);
	}

	@media (max-width: 480px) {
		.landing {
			padding-top: var(--sp-2);
		}

		.hero h1 {
			font-size: 1.8rem;
		}

		.exercise-grid {
			grid-template-columns: 1fr;
		}

		.exercise {
			padding-top: 0;
		}
	}

	/* Exercise view */
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
	}

	@media (max-width: 480px) {
		.content {
			padding: var(--sp-2);
		}
	}
</style>
