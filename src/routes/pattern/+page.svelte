<!-- src/routes/pattern/+page.svelte -->
<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { PATTERNS } from '$lib/music/patterns';
	import { PATTERN_DEFS } from '$lib/music/patternDefs';
	import { resolve } from '$app/paths';

	function musicalBpm(bpm: number, ts: [number, number]): { value: number; unit: string } {
		// Compound time (6/8, 12/8): scheduler bpm = 1.5 × dotted-quarter bpm
		if (ts[1] === 8) return { value: Math.round(bpm / 1.5), unit: '♩.' };
		return { value: bpm, unit: '♩' };
	}
</script>

<svelte:head>
	<title>{t('pattern.title')} — {t('app.title')}</title>
</svelte:head>

<main>
	<header>
		<p class="eyebrow">{t('exercise.pattern')}</p>
		<h1>{t('pattern.title')}</h1>
		<p class="subtitle">{t('exercise.pattern.desc')}</p>
	</header>

	<div class="grid">
		{#each PATTERNS as key}
			{@const pattern = PATTERN_DEFS[key]}
			{@const mb = musicalBpm(pattern.bpm, pattern.timeSignature)}
			<a class="card" href={resolve(`/pattern/${key}` as '/')}>
				<span class="card-name">{t(`pattern.${key}`)}</span>
				<span class="card-meta">{pattern.origin} · {mb.unit} = {mb.value}</span>
			</a>
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

	.card:hover {
		background: rgba(0, 0, 0, 0.03);
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
</style>
