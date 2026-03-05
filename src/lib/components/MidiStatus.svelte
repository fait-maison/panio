<script lang="ts">
	import { midi } from '$lib/stores/midi.svelte';
	import { t } from '$lib/i18n.svelte';

	let open = $state(false);
</script>

{#if open}
	<!-- Transparent backdrop catches outside clicks -->
	<div class="backdrop" onclick={() => (open = false)} role="presentation"></div>
{/if}

<div class="midi-status" data-status={midi.status}>
	<button class="trigger" onclick={() => (open = !open)} aria-expanded={open}>
		<span class="dot"></span>
		<span class="label">
			{midi.status === 'connected' ? midi.deviceName : t('midi.' + midi.status)}
		</span>
		<span class="chevron" class:rotated={open}>›</span>
	</button>

	{#if open}
		<ul class="picker" role="listbox" aria-label={t('midi.selectDevice')}>
			{#each midi.inputList as device (device.id)}
				<li role="option" aria-selected={midi.preferredDeviceId === device.id}>
					<button
						class="device-option"
						class:active={midi.preferredDeviceId === device.id}
						onclick={() => { midi.setPreferredDevice(device.id); open = false; }}
					>
						<span class="device-name">{device.name}</span>
						{#if device.manufacturer}
							<span class="device-mfr">{device.manufacturer}</span>
						{/if}
					</button>
				</li>
			{/each}
			{#if midi.inputList.length === 0}
				<li class="no-devices">{t('midi.noDevices')}</li>
			{/if}
			{#if midi.preferredDeviceId}
				<li class="separator" role="separator"></li>
				<li role="option" aria-selected={false}>
					<button
						class="device-option clear"
						onclick={() => { midi.setPreferredDevice(null); open = false; }}
					>
						{t('midi.clearDevice')}
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-toast) - 1);
	}

	.midi-status {
		position: fixed;
		bottom: var(--sp-4);
		left: var(--sp-4);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		z-index: var(--z-toast);
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-muted);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		line-height: 1;
	}

	.trigger:hover {
		color: var(--text);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: currentColor;
		flex-shrink: 0;
	}

	.chevron {
		font-size: 0.85rem;
		line-height: 1;
		display: inline-block;
		transform: rotate(90deg);
		transition: transform var(--dur-fast);
	}

	.chevron.rotated {
		transform: rotate(-90deg);
	}

	.midi-status[data-status='connected'] .trigger {
		color: #22c55e;
	}

	.midi-status[data-status='connected'] .trigger:hover {
		color: #16a34a;
	}

	/* Picker opens upward */
	.picker {
		position: absolute;
		bottom: calc(100% + var(--sp-2));
		left: 0;
		min-width: 200px;
		max-width: 280px;
		background: var(--surface);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius);
		box-shadow: var(--shadow-card);
		padding: var(--sp-1) 0;
		list-style: none;
		margin: 0;
		z-index: var(--z-toast);
	}

	.device-option {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		padding: var(--sp-2) var(--sp-3);
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		font-size: 0.8rem;
		color: var(--text-muted);
		text-transform: none;
		letter-spacing: 0;
		font-weight: 400;
		transition: background var(--dur-fast);
	}

	.device-option:hover {
		background: oklch(96% 0 0);
		color: var(--text);
	}

	.device-option.active {
		color: var(--text);
		font-weight: 600;
		padding-left: calc(var(--sp-2) + 6px + var(--sp-2));
		position: relative;
	}

	.device-option.active::before {
		content: '';
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--red);
		position: absolute;
		left: var(--sp-2);
		top: calc(var(--sp-2) + 4px);
	}

	.device-name {
		display: block;
		line-height: 1.2;
		color: inherit;
	}

	.device-mfr {
		display: block;
		font-size: 0.7rem;
		color: var(--text-muted);
		line-height: 1.2;
	}

	.no-devices {
		padding: var(--sp-2) var(--sp-3);
		font-size: 0.75rem;
		color: var(--text-muted);
		font-style: italic;
	}

	.separator {
		height: 1px;
		background: var(--border-subtle);
		margin: var(--sp-1) 0;
	}

	.device-option.clear {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.device-option.clear:hover {
		color: var(--red);
		background: oklch(96% 0 0);
	}
</style>
