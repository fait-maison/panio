<script lang="ts">
	import { resolve } from '$app/paths';
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';
</script>

<a href={resolve('/settings' as '/')} class="midi-status" data-status={midi.status}>
	<span class="dot"></span>
	<span class="label">
		{midi.status === 'connected' ? midi.deviceName : t('midi.' + midi.status)}
	</span>
</a>

<style>
	.midi-status {
		position: fixed;
		bottom: var(--sp-4);
		left: var(--sp-4);
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		text-decoration: none;
		z-index: var(--z-toast);
		line-height: 1;
	}

	.midi-status:hover {
		color: var(--text);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		flex-shrink: 0;
	}

	.midi-status[data-status='connected'] {
		color: #22c55e;
	}

	.midi-status[data-status='connected']:hover {
		color: #16a34a;
	}

	.midi-status[data-status='denied'] {
		color: var(--red);
	}
</style>
