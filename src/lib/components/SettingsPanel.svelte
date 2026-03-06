<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { settings } from '$lib/stores/settings.svelte';
	import type { KeyboardSize, ProgressionNotation } from '$lib/stores/settings.svelte';
	import { t, locale, type Locale } from '$lib/i18n.svelte';
	import { exercise } from '$lib/stores/exercise.svelte';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const KEYBOARD_SIZES: { value: KeyboardSize; label: string }[] = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' }
	];

	const exercises = [
		{ key: 'sandbox', active: true },
		{ key: 'scenes', active: false },
		{ key: 'ear', active: false },
		{ key: 'rhythm', active: false }
	] as const;
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="left" class="sidebar-sheet">
		<Sheet.Header>
			<Sheet.Title class="sr-only">{t('nav.menu')}</Sheet.Title>
		</Sheet.Header>

		<div class="sections">
			<!-- Exercise navigation -->
			<section>
				<h3>{t('sidebar.exercises')}</h3>
				<ul class="exercise-list">
					{#each exercises as ex}
						<li
							class="exercise-item"
							class:active={ex.active && exercise.current === ex.key}
							class:disabled={!ex.active}
						>
							<button
								class="exercise-btn"
								disabled={!ex.active}
								onclick={() => { exercise.set(ex.key); open = false; }}
							>
								<div class="exercise-info">
									<span class="exercise-name">{t('exercise.' + ex.key)}</span>
									<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
								</div>
								{#if !ex.active}
									<span class="badge-soon">{t('badge.soon')}</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</section>

			<hr class="sep" />

			<!-- Global settings -->
			<section>
				<h3>{t('sidebar.settings')}</h3>
			</section>

			<section>
				<h3>{t('settings.language')}</h3>
				<ToggleGroup.Root
					type="single"
					value={locale.value}
					onValueChange={(v) => v && locale.set(v as Locale)}
					variant="outline"
					class="w-full flex-wrap"
					data-lock-active
				>
					<ToggleGroup.Item value="fr">FR</ToggleGroup.Item>
					<ToggleGroup.Item value="en">EN</ToggleGroup.Item>
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{t('settings.keyboardSize')}</h3>
				<ToggleGroup.Root
					type="single"
					value={settings.value.keyboardSize}
					onValueChange={(v) => v && settings.update((s) => ({ ...s, keyboardSize: v as KeyboardSize }))}
					variant="outline"
					class="w-full flex-wrap"
					data-lock-active
				>
					{#each KEYBOARD_SIZES as size}
						<ToggleGroup.Item value={size.value}>{size.label}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{t('settings.hints')}</h3>
				<ToggleGroup.Root
					type="single"
					value={settings.value.showHints ? 'on' : 'off'}
					onValueChange={(v) => v && settings.update((s) => ({ ...s, showHints: v === 'on' }))}
					variant="outline"
					class="w-full flex-wrap"
					data-lock-active
				>
					<ToggleGroup.Item value="on">{t('settings.hints.on')}</ToggleGroup.Item>
					<ToggleGroup.Item value="off">{t('settings.hints.off')}</ToggleGroup.Item>
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{t('settings.progressionNotation')}</h3>
				<ToggleGroup.Root
					type="single"
					value={settings.value.progressionNotation}
					onValueChange={(v) => v && settings.update((s) => ({ ...s, progressionNotation: v as ProgressionNotation }))}
					variant="outline"
					class="w-full flex-wrap"
					data-lock-active
				>
					<ToggleGroup.Item value="chord">{t('settings.notation.chord')}</ToggleGroup.Item>
					<ToggleGroup.Item value="roman">{t('settings.notation.roman')}</ToggleGroup.Item>
				</ToggleGroup.Root>
			</section>
		</div>
	</Sheet.Content>
</Sheet.Root>

<style>
	/* Panel layout */
	.sections {
		display: flex;
		flex-direction: column;
		gap: var(--sp-6);
		padding: var(--sp-4);
		overflow-x: hidden;
		overflow-y: auto;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}

	.sep {
		border: none;
		height: 1px;
		background: var(--border-subtle);
	}

	/* Exercise list */
	.exercise-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
	}

	.exercise-item {
		list-style: none;
	}

	.exercise-btn {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--sp-2) var(--sp-3);
		border-radius: 8px;
		border: none;
		background: none;
		cursor: pointer;
		text-align: left;
		transition: background var(--dur-base);
	}

	.exercise-btn:hover:not(:disabled) {
		background: rgba(0, 0, 0, 0.04);
	}

	.exercise-item.active .exercise-btn {
		background: rgba(0, 0, 0, 0.05);
	}

	.exercise-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.exercise-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.exercise-name {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text);
	}

	.exercise-desc {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.badge-soon {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		background: rgba(0, 0, 0, 0.06);
		padding: 2px 8px;
		border-radius: var(--radius-pill);
	}

	:global([data-lock-active] [data-state='on']) {
		pointer-events: none;
	}
</style>
