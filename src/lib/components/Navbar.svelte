<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import Volume2 from '@lucide/svelte/icons/volume-2';
	import Volume1 from '@lucide/svelte/icons/volume-1';
	import VolumeOff from '@lucide/svelte/icons/volume-off';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Minimize from '@lucide/svelte/icons/minimize';

	let { onMenuClick = () => {} }: { onMenuClick?: () => void } = $props();

	let volumeOpen = $state(false);
	let isFullscreen = $state(false);

	function toggleFullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
	}

	$effect(() => {
		function onFsChange() { isFullscreen = !!document.fullscreenElement; }
		document.addEventListener('fullscreenchange', onFsChange);
		return () => document.removeEventListener('fullscreenchange', onFsChange);
	});
</script>

{#if volumeOpen}
	<div class="volume-backdrop" onclick={() => (volumeOpen = false)} role="presentation"></div>
{/if}

<nav class="navbar">
	<div class="nav-left">
		<button class="hamburger" onclick={onMenuClick} aria-label={t('nav.menu')}>
			<span></span><span></span><span></span>
		</button>
		<span class="logo">{t('app.title')}</span>
	</div>
	<div class="nav-right">
		<div class="volume-group">
			<button class="icon-btn" onclick={() => (volumeOpen = !volumeOpen)} aria-label="Volume">
				{#if settings.value.volume === 0}
					<VolumeOff size={16} />
				{:else if settings.value.volume < 0.5}
					<Volume1 size={16} />
				{:else}
					<Volume2 size={16} />
				{/if}
			</button>
			{#if volumeOpen}
				<div class="volume-popover">
					<Slider
						type="single"
						min={0}
						max={1}
						step={0.01}
						value={settings.value.volume}
						onValueChange={(v) => settings.update((s) => ({ ...s, volume: v }))}
						class="volume-slider"
					/>
				</div>
			{/if}
		</div>
		<button class="icon-btn fullscreen-btn" onclick={toggleFullscreen} aria-label="Fullscreen">
			{#if isFullscreen}
				<Minimize size={16} />
			{:else}
				<Maximize size={16} />
			{/if}
		</button>
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
		gap: var(--sp-1);
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--text);
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		color: var(--text-muted);
		transition: background var(--dur-base), color var(--dur-base);
	}

	.icon-btn:hover {
		background: rgba(0, 0, 0, 0.05);
		color: var(--text);
	}

	/* Volume popover */
	.volume-group {
		position: relative;
	}

	.volume-backdrop {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-drawer) - 1);
	}

	.volume-popover {
		position: absolute;
		top: 50%;
		right: calc(100% + var(--sp-2));
		transform: translateY(-50%);
		background: var(--surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		padding: var(--sp-2) var(--sp-3);
		z-index: var(--z-drawer);
	}

	.volume-popover :global(.volume-slider) {
		width: 100px;
	}

	.volume-popover :global([data-slot='slider-range']) {
		background: var(--red);
	}

	.volume-popover :global([data-slot='slider-thumb']) {
		border-color: var(--red);
	}

	/* Fullscreen: hide on desktop where it's less useful */
	.fullscreen-btn {
		display: none;
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

		.fullscreen-btn {
			display: flex;
		}
	}
</style>
