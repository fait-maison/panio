<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Ambiance } from '$lib/music/generator';
	import type { TimerStore } from '$lib/stores/timer';
	import { t } from '$lib/i18n';
	import { settingsStore } from '$lib/stores/settings';
	import { formatProgression, getChordPitchClasses } from '$lib/music/progressions';

	export let ambiance: Ambiance;
	export let timer: TimerStore;
	export let onChordHover: (notes: Set<number>) => void = () => {};

	$: progress = timer.state === 'counting'
		? 100
		: timer.totalSeconds > 0
			? ((timer.totalSeconds - timer.secondsLeft) / timer.totalSeconds) * 100
			: 0;

	$: chords = formatProgression(
		ambiance.progression,
		ambiance.key,
		ambiance.mode.tonalName,
		$settingsStore.progressionNotation
	);

	$: chordNoteSets = ambiance.progression.map((roman) =>
		getChordPitchClasses(ambiance.key, ambiance.mode.tonalName, roman)
	);
</script>

<Card.Root class="ambiance-card">
	<Card.Content class="p-0">
		<div class="card-content">
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger class="badge">
						<span class="key">{ambiance.key}</span>
						<span class="separator">·</span>
						<span class="mode">{$t('mode.' + ambiance.mode.name).toUpperCase()}</span>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content>{$t('mood.' + ambiance.mode.mood)}</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<div class="texture">{$t('texture.' + ambiance.texture)}</div>
		<div class="progression-sep"></div>
		<div
			class="progression"
			role="group"
			aria-label="suggested progression"
			on:mouseleave={() => onChordHover(new Set())}
			on:focusout={() => onChordHover(new Set())}
		>
			{#each chords as chord, i}
				<span
					class="chord"
					class:tonic={i === 0}
					role="button"
					tabindex="0"
					on:mouseenter={() => onChordHover(chordNoteSets[i])}
					on:focus={() => onChordHover(chordNoteSets[i])}
				>{chord}</span>
				{#if i < chords.length - 1}
					<span class="arrow" aria-hidden="true">›</span>
				{/if}
			{/each}
		</div>
		</div>
	</Card.Content>
	<div class="progress-bar">
		<div class="progress-fill" style="width:{progress}%"></div>
	</div>
</Card.Root>

<style>
	/* Override shadcn Card defaults to match original layout */
	:global(.ambiance-card) {
		overflow: hidden;
		gap: 0;
		padding: 0;
		box-shadow: var(--shadow-card);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-8) var(--sp-6) var(--sp-6);
	}

	:global(.badge) {
		display: flex;
		align-items: baseline;
		gap: var(--sp-2);
		font-weight: 800;
		letter-spacing: 0.04em;
		background: none;
		border: none;
		padding: 0;
		cursor: default;
	}

	.key {
		font-size: 1.5rem;
		color: var(--red);
	}

	.separator {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	.mode {
		font-size: 1.75rem;
		color: var(--text);
	}

	.texture {
		font-size: 1rem;
		color: var(--text-muted);
		font-style: italic;
		letter-spacing: 0.02em;
	}

	.progression-sep {
		width: calc(100% - 2 * var(--sp-4));
		height: 1px;
		background: var(--border-subtle);
		margin-top: var(--sp-2);
	}

	.progression {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		white-space: nowrap;
		overflow-x: auto;
		padding-bottom: var(--sp-1);
	}

	.chord { color: var(--text); cursor: pointer; }
	.chord.tonic { color: var(--red); }
	.arrow { color: var(--text-muted); font-weight: 400; }

	.progress-bar {
		height: var(--progress-h);
		background: var(--border-subtle);
	}

	.progress-fill {
		height: 100%;
		background: var(--red);
		transition: width 0.1s linear;
	}
</style>
