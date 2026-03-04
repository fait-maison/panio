<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Ambiance } from '$lib/music/generator';
	import type { TimerStore } from '$lib/stores/timer';
	import { t } from '$lib/i18n';

	export let ambiance: Ambiance;
	export let timer: TimerStore;

	$: progress = timer.state === 'counting'
		? 100
		: timer.totalSeconds > 0
			? ((timer.totalSeconds - timer.secondsLeft) / timer.totalSeconds) * 100
			: 0;
</script>

<Card.Root class="ambiance-card">
	<Card.Content class="p-0">
		<div class="card-content">
			<div class="badge">
				<span class="key">{ambiance.key}</span>
				<span class="separator">·</span>
				<span class="mode">{$t('mode.' + ambiance.mode.name).toUpperCase()}</span>
			</div>
			<div class="texture">{$t('texture.' + ambiance.texture)}</div>
			<div class="mood">{$t('mood.' + ambiance.mode.mood)}</div>
		</div>
	</Card.Content>
	<div class="progress-bar">
		<div class="progress-fill" style="width:{progress}%"></div>
	</div>
</Card.Root>

<style>
	/* Override shadcn Card defaults to match original layout */
	:global(.ambiance-card) {
		overflow: hidden;
		gap: 0;
		padding: 0;
		box-shadow: var(--shadow-card);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--sp-2);
		padding: var(--sp-8) var(--sp-6) var(--sp-6);
	}

	.badge {
		display: flex;
		align-items: baseline;
		gap: var(--sp-2);
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.key {
		font-size: 2.5rem;
		color: var(--red);
	}

	.separator {
		font-size: 2rem;
		color: var(--text-muted);
	}

	.mode {
		font-size: 2.5rem;
		color: var(--text);
	}

	.texture {
		font-size: 1rem;
		color: var(--text-muted);
		font-style: italic;
		letter-spacing: 0.02em;
	}

	.mood {
		font-size: 0.85rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.progress-bar {
		height: var(--progress-h);
		background: var(--border-subtle);
	}

	.progress-fill {
		height: 100%;
		background: var(--red);
		transition: width 0.1s linear;
	}
</style>
