<script lang="ts">
	import { settingsStore } from '$lib/stores/settings';
	import type { KeyboardSize } from '$lib/stores/settings';
	import { ALL_MODE_NAMES, KEYS } from '$lib/music/modes';
	import { t, localeStore } from '$lib/i18n';

	let open = false;

	const INTERVALS = [
		{ value: 0.25, label: '15s' },
		{ value: 1,    label: '1 min' },
		{ value: 3,    label: '3 min' },
		{ value: 5,    label: '5 min' },
		{ value: 10,   label: '10 min' }
	];
	const KEYBOARD_SIZES: { value: KeyboardSize; label: string }[] = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' }
	];

	function toggleMode(mode: string) {
		settingsStore.update((s) => {
			const pool = s.modePool.includes(mode)
				? s.modePool.filter((m) => m !== mode)
				: [...s.modePool, mode];
			// Always keep at least one mode
			return { ...s, modePool: pool.length > 0 ? pool : s.modePool };
		});
	}

	function toggleKey(key: string) {
		settingsStore.update((s) => {
			const pool = s.keyPool.includes(key)
				? s.keyPool.filter((k) => k !== key)
				: [...s.keyPool, key];
			return { ...s, keyPool: pool.length > 0 ? pool : s.keyPool };
		});
	}

	function setInterval(min: number) {
		settingsStore.update((s) => ({ ...s, intervalMin: min }));
	}
</script>

<!-- Gear icon button -->
<button class="gear-btn" on:click={() => (open = !open)} aria-label={$t('settings.title')}>
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
		<circle cx="12" cy="12" r="3" />
		<path
			d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
		/>
	</svg>
</button>

{#if open}
	<!-- Backdrop -->
	<button class="backdrop" on:click={() => (open = false)} aria-label={$t('settings.close')} />

	<div class="panel" role="dialog" aria-label={$t('settings.title')}>
		<div class="panel-header">
			<h2>{$t('settings.title')}</h2>
			<button class="close-btn" on:click={() => (open = false)} aria-label={$t('settings.close')}>✕</button>
		</div>

		<section>
			<h3>{$t('settings.keyboardSize')}</h3>
			<div class="chip-group">
				{#each KEYBOARD_SIZES as size}
					<button
						class="chip"
						class:active={$settingsStore.keyboardSize === size.value}
						on:click={() => settingsStore.update((s) => ({ ...s, keyboardSize: size.value }))}
					>
						{size.label}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3>{$t('settings.interval')}</h3>
			<div class="chip-group">
				{#each INTERVALS as interval}
					<button
						class="chip"
						class:active={$settingsStore.intervalMin === interval.value}
						on:click={() => setInterval(interval.value)}
					>
						{interval.label}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3>{$t('settings.modes')}</h3>
			<div class="chip-group">
				{#each ALL_MODE_NAMES as mode}
					<button
						class="chip"
						class:active={$settingsStore.modePool.includes(mode)}
						on:click={() => toggleMode(mode)}
					>
						{$t('mode.' + mode)}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3>{$t('settings.keys')}</h3>
			<div class="chip-group">
				{#each KEYS as key}
					<button
						class="chip"
						class:active={$settingsStore.keyPool.includes(key)}
						on:click={() => toggleKey(key)}
					>
						{key}
					</button>
				{/each}
			</div>
		</section>

		<section>
			<h3>{$t('settings.language')}</h3>
			<div class="chip-group">
				<button class="chip" class:active={$localeStore === 'fr'} on:click={() => localeStore.set('fr')}>FR</button>
				<button class="chip" class:active={$localeStore === 'en'} on:click={() => localeStore.set('en')}>EN</button>
			</div>
		</section>
	</div>
{/if}

<style>
	.gear-btn {
		position: fixed;
		top: 1rem;
		right: 1rem;
		background: var(--surface);
		border: 1px solid #ddd;
		border-radius: 50%;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		z-index: 50;
		transition: color 0.15s;
	}

	.gear-btn:hover {
		color: var(--text);
	}

	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 60;
		border: none;
		cursor: default;
	}

	.panel {
		position: fixed;
		top: 0;
		right: 0;
		width: min(340px, 100vw);
		height: 100dvh;
		background: var(--surface);
		z-index: 70;
		overflow-y: auto;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 700;
	}

	h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 0.6rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.1rem;
		color: var(--text-muted);
		padding: 0.25rem;
	}

	section {
		display: flex;
		flex-direction: column;
	}

	.chip-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		border: 1.5px solid #ddd;
		background: none;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text);
		transition: background 0.12s, border-color 0.12s;
	}

	.chip.active {
		background: var(--red);
		border-color: var(--red);
		color: #fff;
	}

	.chip:hover:not(.active) {
		border-color: var(--text-muted);
	}
</style>
