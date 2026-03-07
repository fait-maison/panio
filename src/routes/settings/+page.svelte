<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { settings } from '$lib/stores/settings.svelte';
	import type { KeyboardSize, ProgressionNotation } from '$lib/stores/settings.svelte';
	import { t, locale, type Locale } from '$lib/i18n.svelte';
	import MidiStatus from '$lib/components/MidiStatus.svelte';

	const KEYBOARD_SIZES: { value: KeyboardSize; label: string }[] = [
		{ value: 's', label: 'S' },
		{ value: 'm', label: 'M' },
		{ value: 'l', label: 'L' }
	];
</script>

<main class="settings-page">
	<!-- hero -->
	<div class="hero">
		<h1>{t('settings.title')}</h1>
	</div>

	<!-- content -->
	<div class="content">
		<section>
			<h2>{t('settings.language')}</h2>
			<ToggleGroup.Root
				type="single"
				value={locale.value}
				onValueChange={(v: string) => v && locale.set(v as Locale)}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="fr">FR</ToggleGroup.Item>
				<ToggleGroup.Item value="en">EN</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<section>
			<h2>{t('settings.keyboardSize')}</h2>
			<ToggleGroup.Root
				type="single"
				value={settings.value.keyboardSize}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, keyboardSize: v as KeyboardSize }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				{#each KEYBOARD_SIZES as size}
					<ToggleGroup.Item value={size.value}>{size.label}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
		</section>

		<section>
			<h2>{t('settings.hints')}</h2>
			<ToggleGroup.Root
				type="single"
				value={settings.value.showHints ? 'on' : 'off'}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, showHints: v === 'on' }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="on">{t('settings.hints.on')}</ToggleGroup.Item>
				<ToggleGroup.Item value="off">{t('settings.hints.off')}</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<section>
			<h2>{t('settings.progressionNotation')}</h2>
			<ToggleGroup.Root
				type="single"
				value={settings.value.progressionNotation}
				onValueChange={(v: string) =>
					v && settings.update((s) => ({ ...s, progressionNotation: v as ProgressionNotation }))}
				variant="outline"
				class="w-full flex-wrap"
				data-lock-active
			>
				<ToggleGroup.Item value="chord">{t('settings.notation.chord')}</ToggleGroup.Item>
				<ToggleGroup.Item value="roman">{t('settings.notation.roman')}</ToggleGroup.Item>
			</ToggleGroup.Root>
		</section>

		<hr class="divider" />

		<section class="midi-section">
			<MidiStatus />
		</section>
	</div>
</main>

<style>
	.settings-page {
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
	}

	/* ── Content ── */
	.content {
		max-width: 520px;
		margin: 0 auto;
		padding: 0 var(--sp-6) 64px;
		display: flex;
		flex-direction: column;
		gap: var(--sp-6);
		width: 100%;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	h2 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}

	/* ── Divider ── */
	.divider {
		width: 60px;
		height: 2px;
		background: var(--border-subtle);
		margin: 0 auto;
		border: none;
	}

	/* ── MIDI ── */
	.midi-section {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* ── Responsive ── */
	@media (max-width: 480px) {
		.hero {
			padding: 60px var(--sp-4) var(--sp-4);
		}

		.content {
			padding: 0 var(--sp-4) 48px;
		}
	}
</style>
