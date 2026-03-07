<script lang="ts">
	import { t } from '$lib/i18n.svelte';
</script>

<main class="about">
	<!-- hero -->
	<div class="hero">
		<h1>{t('about.tagline')} <span class="accent">{t('about.tagline.accent')}</span></h1>
	</div>

	<hr class="divider" />

	<!-- story -->
	<div class="story">
		<p>{t('about.story.p1')}</p>
		<!-- eslint-disable svelte/no-at-html-tags -- hardcoded translation, safe -->
		<p>
			{@html t('about.story.p2').replace(
				'{lila}',
				'<a href="https://la-lila.org" target="_blank" rel="noopener">la LILA</a>'
			)}
		</p>
		<!-- eslint-enable svelte/no-at-html-tags -->
		<div class="pull-quote">
			{t('about.pullquote')}
		</div>
		<p>{t('about.story.p3')}</p>
	</div>

	<hr class="divider" />

	<!-- contribute -->
	<div class="about-me">
		<h2>{t('about.contribute.title')}</h2>
		<!-- eslint-disable svelte/no-at-html-tags -- hardcoded translation, safe -->
		<p>
			{@html t('about.contribute.text').replace(
				'{github}',
				'<a href="https://github.com/fait-maison/panio" target="_blank" rel="noopener">GitHub</a>'
			)}
		</p>
		<!-- eslint-enable svelte/no-at-html-tags -->
	</div>
</main>

<style>
	.about {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}

	/* ── Hero ── */
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 80px var(--sp-6) var(--sp-6);
	}

	.hero h1 {
		font-family: var(--font-display);
		font-size: 1.8rem;
		line-height: 1.2;
		color: var(--text);
		margin-bottom: 10px;
		max-width: 400px;
	}

	.hero .accent {
		color: var(--red);
	}

	/* ── Divider ── */
	.divider {
		width: 60px;
		height: 2px;
		background: var(--border-subtle);
		margin: 0 auto;
		border: none;
	}

	/* ── Story ── */
	.story {
		max-width: 520px;
		margin: 0 auto;
		padding: 40px var(--sp-6);
	}

	.story p {
		font-size: 1.05rem;
		line-height: 1.8;
		margin-bottom: var(--sp-4);
	}

	.story p:last-child {
		margin-bottom: 0;
	}

	.pull-quote {
		font-family: var(--font-display);
		font-size: 1.5rem;
		line-height: 1.4;
		color: var(--red);
		margin: var(--sp-8) 0;
		padding-left: 20px;
		border-left: 3px solid var(--red);
	}

	/* ── About me ── */
	.about-me {
		max-width: 520px;
		margin: 0 auto;
		padding: 40px var(--sp-6) 64px;
	}

	.about-me h2 {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--red);
		margin-bottom: var(--sp-4);
	}

	.about-me p {
		font-size: 0.95rem;
		line-height: 1.7;
		margin-bottom: var(--sp-2);
	}

	.story :global(a),
	.about-me :global(a) {
		color: var(--red);
		text-decoration: none;
		font-weight: 600;
		transition: opacity var(--dur-base);
	}

	.story :global(a:hover),
	.about-me :global(a:hover) {
		opacity: 0.7;
	}

	/* ── Responsive ── */
	@media (max-width: 480px) {
		.hero {
			padding: 60px var(--sp-4) var(--sp-4);
		}

		.hero h1 {
			font-size: 1.5rem;
		}

		.story {
			padding: 32px var(--sp-4);
		}

		.pull-quote {
			font-size: 1.3rem;
		}

		.about-me {
			padding: 32px var(--sp-4) 48px;
		}
	}
</style>
