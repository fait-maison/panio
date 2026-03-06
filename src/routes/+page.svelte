<script lang="ts">
	import { t } from '$lib/i18n.svelte';
	import { EXERCISES } from '$lib/exercises';
</script>

<main class="landing">
	<div class="hero">
		<h1>{t('landing.title')}</h1>
		<p>{t('landing.subtitle')}</p>
	</div>
	<div class="exercise-grid">
		{#each EXERCISES as ex}
			{#if ex.active}
				<a href="/{ex.key}" class="exercise-card">
					<span class="exercise-name">{t('exercise.' + ex.key)}</span>
					<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
				</a>
			{:else}
				<div class="exercise-card disabled">
					<span class="exercise-name">{t('exercise.' + ex.key)}</span>
					<span class="exercise-desc">{t('exercise.' + ex.key + '.desc')}</span>
					<span class="badge-soon">{t('badge.soon')}</span>
				</div>
			{/if}
		{/each}
	</div>
</main>


<style>
	.landing {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100dvh;
		padding-top: 52px;
		gap: var(--sp-8);
	}

	.hero {
		text-align: center;
		padding: var(--sp-8) var(--sp-4) 0;
	}

	.hero h1 {
		font-family: var(--font-display);
		font-size: 2.4rem;
		color: var(--text);
		line-height: 1.2;
		margin-bottom: var(--sp-3);
	}

	.hero p {
		font-size: 1rem;
		color: var(--text-muted);
		max-width: 360px;
		margin: 0 auto;
	}

	.exercise-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-4);
		max-width: 520px;
		width: 100%;
		padding: 0 var(--sp-4);
	}

	.exercise-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--sp-2);
		padding: var(--sp-6) var(--sp-5);
		background: var(--surface);
		border: none;
		border-radius: var(--radius-card);
		box-shadow: var(--shadow-card);
		cursor: pointer;
		text-align: left;
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
		position: relative;
	}

	@media (hover: hover) {
		.exercise-card:not(.disabled):hover {
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-2px);
		}
	}

	.exercise-card.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.exercise-name {
		font-family: var(--font-display);
		font-size: 1.2rem;
		color: var(--text);
	}

	.exercise-desc {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.4;
	}

	.badge-soon {
		position: absolute;
		top: var(--sp-3);
		right: var(--sp-3);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
		background: rgba(0, 0, 0, 0.06);
		padding: 2px 8px;
		border-radius: var(--radius-pill);
	}

	@media (max-width: 480px), (max-height: 500px) and (orientation: landscape) {
		.landing {
			padding-top: var(--sp-2);
		}

		.hero h1 {
			font-size: 1.8rem;
		}

		.exercise-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
