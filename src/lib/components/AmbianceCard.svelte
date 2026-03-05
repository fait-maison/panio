<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Ambiance } from '$lib/music/generator';
	import { timer } from '$lib/stores/timer.svelte';
	import { t } from '$lib/i18n.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { formatProgression, getChordPitchClasses, toChordSymbol } from '$lib/music/progressions';
	import { Chord, Note } from 'tonal';

	let {
		ambiance,
		timer: timerProp,
		onChordHover = () => {},
		onSkip = () => {}
	}: {
		ambiance: Ambiance;
		timer: typeof timer;
		onChordHover?: (notes: Set<number>, root: number | null) => void;
		onSkip?: () => void;
	} = $props();

	let progress = $derived(
		timerProp.state === 'counting'
			? 100
			: timerProp.totalSeconds > 0
				? ((timerProp.totalSeconds - timerProp.secondsLeft) / timerProp.totalSeconds) * 100
				: 0
	);

	let chords = $derived(
		formatProgression(
			ambiance.progression,
			ambiance.key,
			ambiance.mode.tonalName,
			settings.value.progressionNotation
		)
	);

	let chordNoteSets = $derived(
		ambiance.progression.map((roman) =>
			getChordPitchClasses(ambiance.key, ambiance.mode.tonalName, roman)
		)
	);

	let chordRoots = $derived(
		ambiance.progression.map((roman) => {
			const symbol = toChordSymbol(ambiance.key, ambiance.mode.tonalName, roman);
			const tonic = Chord.get(symbol).tonic;
			return tonic ? Note.chroma(tonic) as number : null;
		})
	);
</script>

<Card.Root class="ambiance-card">
	<Card.Content class="p-0">
		<div class="card-content">
		<button class="skip-btn" onclick={onSkip} aria-label="Next ambiance">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polygon points="5 4 15 12 5 20 5 4"/>
				<line x1="19" y1="5" x2="19" y2="19"/>
			</svg>
		</button>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger class="badge">
						<span class="key">{ambiance.key}</span>
						<span class="separator">·</span>
						<span class="mode">{t('mode.' + ambiance.mode.name).toUpperCase()}</span>
					</Tooltip.Trigger>
					<Tooltip.Portal>
						<Tooltip.Content>{t('mood.' + ambiance.mode.mood)}</Tooltip.Content>
					</Tooltip.Portal>
				</Tooltip.Root>
			</Tooltip.Provider>
			<div class="texture">{t('texture.' + ambiance.texture)}</div>
		<div class="progression-sep"></div>
		<div
			class="progression"
			role="group"
			aria-label="suggested progression"
			onmouseleave={() => onChordHover(new Set(), null)}
			onfocusout={() => onChordHover(new Set(), null)}
		>
			{#each chords as chord, i}
				<span
					class="chord"
					class:tonic={i === 0}
					role="button"
					tabindex="0"
					onmouseenter={() => onChordHover(chordNoteSets[i], chordRoots[i])}
					onfocus={() => onChordHover(chordNoteSets[i], chordRoots[i])}
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
		min-width: 430px;
	}

	.card-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-8) var(--sp-6) var(--sp-6);
	}

	.skip-btn {
		position: absolute;
		bottom: var(--sp-3);
		right: var(--sp-3);
		background: none;
		border: none;
		padding: var(--sp-1);
		color: var(--text-muted);
		cursor: pointer;
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--dur-base);
	}

	.skip-btn:hover {
		color: var(--text);
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
		font-size: 1rem;
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
