<!-- src/routes/rhythm/+page.svelte -->
<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { RHYTHMS } from '$lib/music/rhythms';
	import { RHYTHM_PATTERNS } from '$lib/music/rhythmPatterns';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>{t('rhythm.title')} — {t('app.title')}</title>
</svelte:head>

<main>
	<header>
		<p class="eyebrow">{t('exercise.rhythm')}</p>
		<h1>{t('rhythm.title')}</h1>
		<p class="subtitle">{t('exercise.rhythm.desc')}</p>
	</header>

	<div class="grid">
		{#each RHYTHMS as key}
			{@const pattern = RHYTHM_PATTERNS[key]}
			{#if pattern !== null}
				<a class="card" href={resolve(`/rhythm/${key}` as '/')}>
					<span class="card-name">{t(`rhythm.${key}`)}</span>
					<span class="card-meta">{pattern.style} · ♩ = {pattern.bpm}</span>
				</a>
			{:else}
				<div class="card coming-soon" aria-disabled="true">
					<span class="card-name">{t(`rhythm.${key}`)}</span>
					<span class="badge-soon">{t('rhythm.comingSoon')}</span>
				</div>
			{/if}
		{/each}
	</div>
</main>

<style>
	main {
		max-width: 640px;
		margin: 0 auto;
		padding: var(--sp-6) var(--sp-4) 3rem;
		display: flex;
		flex-direction: column;
		gap: var(--sp-6);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
	}

	.eyebrow {
		font-size: 0.65rem;
		font-weight: 700;
		color: #cc2936;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	h1 {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(2rem, 8vw, 3rem);
		line-height: 1;
		letter-spacing: -0.01em;
	}

	.subtitle {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--sp-3);
	}

	@media (min-width: 480px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		padding: var(--sp-4);
		text-align: left;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
		transition: background var(--dur-base);
		text-decoration: none;
		color: inherit;
	}

	.card:hover:not(.coming-soon) {
		background: rgba(0, 0, 0, 0.03);
	}

	.card.coming-soon {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.card-name {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: 1.15rem;
		line-height: 1.1;
		color: var(--text);
		text-transform: capitalize;
	}

	.card-meta {
		font-size: 0.7rem;
		color: var(--text-muted);
	}

	.badge-soon {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}
</style>
