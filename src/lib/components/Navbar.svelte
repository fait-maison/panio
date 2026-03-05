<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { t } from '$lib/i18n.svelte';
	import Settings from '@lucide/svelte/icons/settings';

	let { onGearClick = () => {} }: { onGearClick?: () => void } = $props();
</script>

<nav class="navbar">
	<span class="logo">{t('app.title')}</span>
	<div class="nav-items">
		<span class="nav-item active">{t('nav.sandbox')}</span>
	</div>
	<Button variant="ghost" size="icon" class="gear" onclick={onGearClick} aria-label={t('settings.title')}>
		<Settings size={20} />
	</Button>
</nav>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--sp-4);
		background: var(--surface);
		border-bottom: 1px solid var(--border-subtle);
		z-index: var(--z-drawer);
	}

	.logo {
		font-size: 1.1rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		color: var(--text);
	}

	.nav-items {
		display: flex;
		align-items: center;
		gap: var(--sp-4);
	}

	.nav-item {
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.nav-item.active {
		color: var(--text);
		font-weight: 700;
	}
</style>
