<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import type { Ambiance } from '$lib/music/generator';
	import { timer } from '$lib/stores/timer.svelte';
	import { t } from '$lib/i18n.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import type { Difficulty } from '$lib/music/progressions';
	import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';
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

	let settingsOpen = $state(false);

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

	const INTERVALS: { value: number; label: string }[] = [
		{ value: 0.25, label: '15s' },
		{ value: 1, label: '1 min' },
		{ value: 3, label: '3 min' },
		{ value: 5, label: '5 min' },
		{ value: 10, label: '10 min' }
	];
</script>

<Card.Root class="ambiance-card">
	<Card.Content class="p-0">
		<div class="card-content">
		<div class="card-actions">
			<button
				class="action-btn"
				onclick={() => (settingsOpen = !settingsOpen)}
				aria-label={t('settings.exercise')}
				class:active={settingsOpen}
			>
				<SlidersHorizontal size={16} />
			</button>
			<button class="action-btn" onclick={onSkip} aria-label="Next ambiance">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="5 4 15 12 5 20 5 4"/>
					<line x1="19" y1="5" x2="19" y2="19"/>
				</svg>
			</button>
		</div>
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

		<!-- In-card exercise settings (desktop only) -->
		<div class="exercise-settings" class:open={settingsOpen}>
			<div class="settings-inner">
				<div class="settings-section">
					<h4>{t('settings.interval')}</h4>
					<ToggleGroup.Root
						type="single"
						value={String(settings.value.intervalMin)}
						onValueChange={(v) => v && settings.update((s) => ({ ...s, intervalMin: Number(v) }))}
						variant="outline"
						class="w-full flex-wrap"
						data-lock-active
					>
						{#each INTERVALS as interval}
							<ToggleGroup.Item value={String(interval.value)}>{interval.label}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>

				<div class="settings-section">
					<h4>{t('settings.difficulty')}</h4>
					<ToggleGroup.Root
						type="multiple"
						value={settings.value.difficultyPool}
						onValueChange={(v) => v.length > 0 && settings.update((s) => ({ ...s, difficultyPool: v as Difficulty[] }))}
						variant="outline"
						class="w-full flex-wrap"
						data-lock-active={settings.value.difficultyPool.length === 1 ? '' : undefined}
					>
						{#each (['simple', 'rich', 'complex'] as const) as d}
							<ToggleGroup.Item value={d}>{t('settings.difficulty.' + d)}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>

				<div class="settings-section">
					<h4>{t('settings.modes')}</h4>
					<ToggleGroup.Root
						type="multiple"
						value={settings.value.modePool}
						onValueChange={(v) => v.length > 0 && settings.update((s) => ({ ...s, modePool: v }))}
						variant="outline"
						class="w-full flex-wrap"
						data-lock-active={settings.value.modePool.length === 1 ? '' : undefined}
					>
						{#each ALL_MODE_NAMES as mode}
							<ToggleGroup.Item value={mode}>{t('mode.' + mode)}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>

				<div class="settings-section">
					<h4>{t('settings.keys')}</h4>
					<ToggleGroup.Root
						type="multiple"
						value={settings.value.keyPool}
						onValueChange={(v) => v.length > 0 && settings.update((s) => ({ ...s, keyPool: v }))}
						variant="outline"
						class="w-full flex-wrap"
						data-lock-active={settings.value.keyPool.length === 1 ? '' : undefined}
					>
						{#each KEYS as key}
							<ToggleGroup.Item value={key}>{key}</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>
			</div>
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
		border: none;
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card);
		min-width: 460px;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
	}

	@media (hover: hover) {
		:global(.ambiance-card:hover) {
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-2px);
		}
	}

	@media (max-width: 480px) {
		:global(.ambiance-card) {
			min-width: unset;
			width: calc(100vw - 2rem);
		}

		.key { font-size: 1.25rem; }
		.mode { font-size: 1.4rem; }
		.separator { font-size: 1rem; }
		.texture { font-size: 0.875rem; }

		.card-content {
			padding: var(--sp-6) var(--sp-4) var(--sp-4);
		}
	}

	.card-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-8) var(--sp-6) var(--sp-6);
	}

	.card-actions {
		position: absolute;
		top: var(--sp-3);
		right: var(--sp-3);
		display: flex;
		gap: var(--sp-1);
	}

	.action-btn {
		background: none;
		border: none;
		padding: var(--sp-1);
		color: var(--text-muted);
		cursor: pointer;
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--dur-base), background var(--dur-base);
	}

	.action-btn:hover {
		color: var(--text);
	}

	.action-btn.active {
		color: var(--red);
		background: rgba(204, 41, 54, 0.08);
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
		font-family: var(--font-display);
		font-size: 1.5rem;
		color: var(--red);
	}

	.separator {
		font-size: 1.25rem;
		color: var(--text-muted);
	}

	.mode {
		font-family: var(--font-display);
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

	/* Exercise settings collapsible */
	.exercise-settings {
		width: 100%;
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease;
	}

	.exercise-settings.open {
		max-height: 600px;
	}

	.settings-inner {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		padding: var(--sp-4) 0 0;
		border-top: 1px solid var(--border-subtle);
		margin-top: var(--sp-2);
	}

	.settings-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	.settings-section h4 {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		font-weight: 500;
	}

	:global([data-lock-active] [data-state='on']) {
		pointer-events: none;
	}

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
