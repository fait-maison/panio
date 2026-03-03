<script lang="ts">
	import type { TimerStore } from '$lib/stores/timer';

	export let timer: TimerStore;
	export let onSnooze: () => void;

	const COUNTDOWN_SECS = 5;
	$: progress = ((COUNTDOWN_SECS - timer.secondsLeft) / COUNTDOWN_SECS) * 100;
</script>

{#if timer.state === 'counting'}
	<div class="toast" role="status" aria-live="polite">
		<div class="toast-body">
			<div class="toast-text">
				<span class="label">Next ambiance in</span>
				<span class="countdown">{timer.secondsLeft}s</span>
			</div>
			<button class="snooze" on:click={onSnooze}>Stay here</button>
		</div>
		<div class="progress-bar">
			<div class="progress-fill" style="width: {progress}%" />
		</div>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: min(420px, calc(100vw - 2rem));
		background: var(--surface);
		border-radius: var(--radius);
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
		overflow: hidden;
		animation: slide-up 0.25s ease;
		z-index: 100;
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	.toast-body {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		gap: 1rem;
	}

	.toast-text {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.countdown {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--text);
		min-width: 2ch;
	}

	.snooze {
		background: none;
		border: 1.5px solid var(--text);
		border-radius: var(--radius);
		padding: 0.4rem 1rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text);
		white-space: nowrap;
		transition: background 0.15s;
	}

	.snooze:hover {
		background: var(--bg);
	}

	.progress-bar {
		height: 4px;
		background: #eee;
	}

	.progress-fill {
		height: 100%;
		background: var(--red);
		transition: width 0.9s linear;
	}
</style>
