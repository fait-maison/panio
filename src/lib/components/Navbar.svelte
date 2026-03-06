<script lang="ts">
	import { t } from '$lib/i18n.svelte';

	let { onMenuClick = () => {} }: { onMenuClick?: () => void } = $props();
</script>

<nav class="navbar">
	<div class="nav-left">
		<button class="hamburger" onclick={onMenuClick} aria-label={t('nav.menu')}>
			<span></span><span></span><span></span>
		</button>
		<span class="logo">{t('app.title')}</span>
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
		padding: 0 var(--sp-4);
		background: var(--bg);
		z-index: var(--z-drawer);
	}

	.nav-left {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.3rem;
		color: var(--text);
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

	@media (max-width: 480px) {
		.navbar {
			background: none;
			height: auto;
			padding: var(--sp-2) var(--sp-2);
			pointer-events: none;
		}

		.hamburger, .logo {
			pointer-events: auto;
		}
	}
</style>
