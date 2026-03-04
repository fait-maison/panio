<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { settingsStore } from '$lib/stores/settings';
	import type { KeyboardSize } from '$lib/stores/settings';
	import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';
	import { t, localeStore, type Locale } from '$lib/i18n';

	const INTERVALS: { value: number; label: string }[] = [
		{ value: 0.25, label: '15s' },
		{ value: 1, label: '1 min' },
		{ value: 3, label: '3 min' },
		{ value: 5, label: '5 min' },
		{ value: 10, label: '10 min' }
	];
	const KEYBOARD_SIZES: { value: KeyboardSize; label: string }[] = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' }
	];
</script>

<Sheet.Root>
	<Sheet.Trigger class="gear-btn" aria-label={$t('settings.title')}>
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="12" cy="12" r="3" />
			<path
				d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
			/>
		</svg>
	</Sheet.Trigger>

	<Sheet.Content side="right" class="settings-sheet">
		<Sheet.Header>
			<Sheet.Title>{$t('settings.title')}</Sheet.Title>
		</Sheet.Header>

		<div class="sections">
			<section>
				<h3>{$t('settings.keyboardSize')}</h3>
				<ToggleGroup.Root
					type="single"
					value={$settingsStore.keyboardSize}
					onValueChange={(v) => v && settingsStore.update((s) => ({ ...s, keyboardSize: v as KeyboardSize }))}
					variant="outline"
					class="w-full flex-wrap"
				>
					{#each KEYBOARD_SIZES as size}
						<ToggleGroup.Item value={size.value}>{size.label}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{$t('settings.interval')}</h3>
				<ToggleGroup.Root
					type="single"
					value={String($settingsStore.intervalMin)}
					onValueChange={(v) => v && settingsStore.update((s) => ({ ...s, intervalMin: Number(v) }))}
					variant="outline"
					class="w-full flex-wrap"
				>
					{#each INTERVALS as interval}
						<ToggleGroup.Item value={String(interval.value)}>{interval.label}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{$t('settings.modes')}</h3>
				<ToggleGroup.Root
					type="multiple"
					value={$settingsStore.modePool}
					onValueChange={(v) => v.length > 0 && settingsStore.update((s) => ({ ...s, modePool: v }))}
					variant="outline"
					class="w-full flex-wrap"
				>
					{#each ALL_MODE_NAMES as mode}
						<ToggleGroup.Item value={mode}>{$t('mode.' + mode)}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{$t('settings.keys')}</h3>
				<ToggleGroup.Root
					type="multiple"
					value={$settingsStore.keyPool}
					onValueChange={(v) => v.length > 0 && settingsStore.update((s) => ({ ...s, keyPool: v }))}
					variant="outline"
					class="w-full flex-wrap"
				>
					{#each KEYS as key}
						<ToggleGroup.Item value={key}>{key}</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</section>

			<section>
				<h3>{$t('settings.language')}</h3>
				<ToggleGroup.Root
					type="single"
					value={$localeStore}
					onValueChange={(v) => v && localeStore.set(v as Locale)}
					variant="outline"
					class="w-full flex-wrap"
				>
					<ToggleGroup.Item value="fr">FR</ToggleGroup.Item>
					<ToggleGroup.Item value="en">EN</ToggleGroup.Item>
				</ToggleGroup.Root>
			</section>
		</div>
	</Sheet.Content>
</Sheet.Root>

<style>
	/* Gear trigger — Sheet.Trigger is the button itself */
	:global(.gear-btn) {
		position: fixed;
		top: var(--sp-4);
		right: var(--sp-4);
		background: var(--surface);
		border: 1px solid var(--border-key);
		border-radius: 50%;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		z-index: var(--z-drawer);
		transition: color var(--dur-base);
	}

	:global(.gear-btn:hover) {
		color: var(--text);
	}

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
</style>
