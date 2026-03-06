<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import VolumeOff from '@lucide/svelte/icons/volume-off';

	let { onMenuClick = () => {} }: { onMenuClick?: () => void } = $props();
</script>

<nav class="navbar">
	<div class="nav-left">
		<button class="hamburger" onclick={onMenuClick} aria-label={t('nav.menu')}>
			<span></span><span></span><span></span>
		</button>
		<span class="logo">{t('app.title')}</span>
	</div>
	<div class="nav-right">
		{#if settings.value.volume === 0}
			<VolumeOff size={16} class="volume-icon" />
		{:else}
			<Volume2 size={16} class="volume-icon" />
		{/if}
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			value={settings.value.volume}
			oninput={(e) => settings.update((s) => ({ ...s, volume: +e.currentTarget.value }))}
			class="volume-slider"
			aria-label="Volume"
		/>
	</div>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--sp-4);
		background: var(--bg);
		z-index: var(--z-drawer);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--text);
	}

	:global(.volume-icon) {
		color: var(--text-muted);
		flex-shrink: 0;
	}

	.volume-slider {
		width: 80px;
		accent-color: var(--red);
		cursor: pointer;
	}

	.hamburger {
		background: none;
		border: none;
		width: 40px;
		height: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		cursor: pointer;
		border-radius: 8px;
		transition: background var(--dur-base);
	}

	.hamburger:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	.hamburger span {
		display: block;
		width: 18px;
		height: 2px;
		background: var(--text);
		border-radius: 1px;
	}

	@media (max-width: 480px), (max-height: 500px) and (orientation: landscape) {
		.navbar {
			background: none;
			height: auto;
			padding: var(--sp-2) var(--sp-2);
			pointer-events: none;
		}

		.logo {
			display: none;
		}

		.hamburger {
			pointer-events: auto;
		}

		.nav-right {
			pointer-events: auto;
		}
	}
</style>
