<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import SlidersHorizontal from '@lucide/svelte/icons/sliders-horizontal';
	import X from '@lucide/svelte/icons/x';
	import { settings } from '$lib/stores/settings.svelte';
	import type { Difficulty } from '$lib/music/progressions';
	import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';
	import { t } from '$lib/i18n.svelte';

	let sheetOpen = $state(false);

	const INTERVALS: { value: number; label: string }[] = [
		{ value: 0.25, label: '15s' },
		{ value: 1, label: '1 min' },
		{ value: 3, label: '3 min' },
		{ value: 5, label: '5 min' },
		{ value: 10, label: '10 min' }
	];
</script>

<!-- FAB -->
<button class="fab" onclick={() => (sheetOpen = true)} aria-label={t('settings.exercise')}>
	<SlidersHorizontal size={20} />
</button>

<!-- Backdrop -->
{#if sheetOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={() => (sheetOpen = false)} onkeydown={(e) => e.key === 'Escape' && (sheetOpen = false)}></div>
{/if}

<!-- Bottom sheet -->
<div class="bottom-sheet" class:open={sheetOpen}>
	<div class="sheet-header">
		<div class="drag-handle"></div>
		<div class="sheet-title-row">
			<h2>{t('settings.exercise')}</h2>
			<button class="close-btn" onclick={() => (sheetOpen = false)} aria-label={t('settings.close')}>
				<X size={20} />
			</button>
		</div>
	</div>

	<div class="sheet-body">
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

<style>
	.fab {
		display: none;
	}

	@media (max-width: 480px) {
		.fab {
			display: flex;
			position: fixed;
			bottom: 24px;
			right: 16px;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			background: var(--surface);
			border: none;
			box-shadow: var(--shadow-card);
			align-items: center;
			justify-content: center;
			color: var(--text);
			cursor: pointer;
			z-index: var(--z-fab);
		}
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background: var(--backdrop);
		z-index: var(--z-overlay);
	}

	.bottom-sheet {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		max-height: 80vh;
		background: var(--surface);
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
		z-index: var(--z-drawer);
		transform: translateY(100%);
		transition: transform 0.3s ease;
		display: none;
	}

	@media (max-width: 480px) {
		.bottom-sheet {
			display: block;
		}

		.bottom-sheet.open {
			transform: translateY(0);
		}
	}

	.sheet-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--sp-3) var(--sp-4) 0;
	}

	.drag-handle {
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--border-subtle);
		margin-bottom: var(--sp-3);
	}

	.sheet-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.sheet-title-row h2 {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text);
	}

	.close-btn {
		background: none;
		border: none;
		padding: var(--sp-1);
		color: var(--text-muted);
		cursor: pointer;
		border-radius: var(--radius);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		padding: var(--sp-4);
		overflow-y: auto;
		max-height: calc(80vh - 80px);
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
</style>
