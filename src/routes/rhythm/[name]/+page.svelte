<!-- src/routes/rhythm/[name]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n.svelte';
	import { RHYTHM_PATTERNS, totalSteps } from '$lib/music/rhythmPatterns';
	import { rhythmPlayer } from '$lib/stores/rhythmPlayer.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { onDestroy } from 'svelte';
	import Vex from 'vexflow';

	const CHROMATIC_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	const name = $derived($page.params.name);
	const pattern = $derived(RHYTHM_PATTERNS[name as keyof typeof RHYTHM_PATTERNS] ?? null);
	const steps = $derived(pattern ? totalSteps(pattern.timeSignature) : 16);

	let selectedKey = $state('C');
	let bpm = $state(120);

	// Sync bpm with pattern default when pattern changes
	$effect(() => {
		if (pattern) bpm = pattern.bpm;
	});

	function toggle() {
		if (rhythmPlayer.playing) {
			rhythmPlayer.stop();
		} else if (pattern) {
			rhythmPlayer.start(pattern, selectedKey, bpm);
		}
	}

	function onKeyChange(newKey: string) {
		selectedKey = newKey;
		if (rhythmPlayer.playing && pattern) {
			rhythmPlayer.stop();
			rhythmPlayer.start(pattern, selectedKey, bpm);
		}
	}

	function onBpmChange(val: number) {
		bpm = val;
		rhythmPlayer.setBpm(bpm);
	}

	// VexFlow rendering
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const VexFlow = (Vex as any).Flow;

	function renderNotation(pat: NonNullable<typeof pattern>, rootNote: string): void {
		if (typeof document === 'undefined') return;
		const container = document.getElementById('vf-notation');
		if (!container) return;
		// Safe DOM clear — no innerHTML
		while (container.firstChild) container.removeChild(container.firstChild);

		const { Renderer, Stave, StaveNote, Voice, Formatter, Beam } = VexFlow;
		const width = Math.max(container.clientWidth || 0, 300);
		const renderer = new Renderer(container, Renderer.Backends.SVG);
		renderer.resize(width, 160);
		const ctx = renderer.getContext();

		const stave = new Stave(10, 20, width - 20);
		stave.addClef('bass');
		stave.addTimeSignature(`${pat.timeSignature[0]}/${pat.timeSignature[1]}`);
		stave.setContext(ctx).draw();

		const rootMidi = 48 + CHROMATIC_KEYS.indexOf(rootNote); // C3=48
		const DEGREE_SEMI: Record<number, number> = { 1: 0, 3: 4, 5: 7 };
		const total = totalSteps(pat.timeSignature);

		function midiToVfKey(midi: number): string {
			const names = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
			return `${names[midi % 12]}/${Math.floor(midi / 12) - 1}`;
		}

		function dur(n: number): string {
			const m: Record<number, string> = {
				1: '16',
				2: '8',
				3: '8d',
				4: 'q',
				6: 'qd',
				8: 'h',
				12: 'hd',
				16: 'w'
			};
			return m[n] ?? '16';
		}

		function buildNotes(patSteps: typeof pat.bass, stemDir: number, color: string) {
			const notes: unknown[] = [];
			const sorted = [...patSteps].sort((a, b) => a.step - b.step);
			let cursor = 0;
			for (const s of sorted) {
				if (s.step > cursor) {
					notes.push(
						new StaveNote({
							keys: ['d/3'],
							duration: `${dur(s.step - cursor)}r`,
							stem_direction: stemDir
						})
					);
				}
				const midi = rootMidi + (DEGREE_SEMI[s.degree] ?? 0) + s.octave * 12;
				const note = new StaveNote({
					keys: [midiToVfKey(midi)],
					duration: dur(s.duration),
					stem_direction: stemDir
				});
				note.setStyle({ fillStyle: color, strokeStyle: color });
				notes.push(note);
				cursor = s.step + s.duration;
			}
			if (cursor < total) {
				notes.push(
					new StaveNote({
						keys: ['d/3'],
						duration: `${dur(total - cursor)}r`,
						stem_direction: stemDir
					})
				);
			}
			return notes;
		}

		const bassNotes = buildNotes(pat.bass, -1, '#cc2936');
		const chordNotes = buildNotes(pat.chords, 1, '#1d4ed8');

		const voiceBass = new Voice({
			num_beats: pat.timeSignature[0],
			beat_value: pat.timeSignature[1]
		});
		voiceBass.addTickables(bassNotes);
		const voiceChord = new Voice({
			num_beats: pat.timeSignature[0],
			beat_value: pat.timeSignature[1]
		});
		voiceChord.addTickables(chordNotes);

		const beams = [...Beam.generateBeams(bassNotes), ...Beam.generateBeams(chordNotes)];
		new Formatter().joinVoices([voiceBass, voiceChord]).format([voiceBass, voiceChord], width - 60);
		voiceBass.draw(ctx, stave);
		voiceChord.draw(ctx, stave);
		beams.forEach((b: unknown) =>
			(b as { setContext: (c: unknown) => { draw: () => void } }).setContext(ctx).draw()
		);
	}

	$effect(() => {
		const pat = pattern;
		const key = selectedKey;
		if (!pat) return;
		Promise.resolve().then(() => renderNotation(pat, key));
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') rhythmPlayer.stop();
	});
</script>

<svelte:head>
	<title>{t(`rhythm.${name}`)} — {t('rhythm.title')} — {t('app.title')}</title>
</svelte:head>

{#if pattern === null}
	<main class="error-state">
		<p>{t('rhythm.comingSoon')}</p>
		<a href="/rhythm">{t('rhythm.backToAll')}</a>
	</main>
{:else}
	<main>
		<a class="back-link" href="/rhythm">{t('rhythm.backToAll')}</a>

		<header>
			<p class="eyebrow">{pattern.style} · {pattern.timeSignature[0]}/{pattern.timeSignature[1]}</p>
			<h1 class="rhythm-name">{t(`rhythm.${name}`)}</h1>
			<p class="desc">{pattern.description}</p>
		</header>

		<section class="notation-section" aria-label={t('rhythm.notation')}>
			<div id="vf-notation"></div>
		</section>

		<section class="grid-section" aria-label={t('rhythm.beatGrid')}>
			<div class="track-label">{t('rhythm.bass')}</div>
			<div class="beat-grid" style="grid-template-columns: repeat({steps}, 1fr)">
				{#each Array(steps) as _, i}
					<div
						class="cell"
						class:bass-strong={pattern.bass.some((s) => s.step === i && s.velocity > 70)}
						class:bass-weak={pattern.bass.some((s) => s.step === i && s.velocity <= 70)}
						class:active={rhythmPlayer.currentStep === i}
					></div>
				{/each}
			</div>

			<div class="track-label">{t('rhythm.chord')}</div>
			<div class="beat-grid chord-track" style="grid-template-columns: repeat({steps}, 1fr)">
				{#each Array(steps) as _, i}
					<div
						class="cell"
						class:chord-hit={pattern.chords.some((s) => s.step === i)}
						class:active={rhythmPlayer.currentStep === i}
					></div>
				{/each}
			</div>
		</section>

		<section class="controls">
			<button class="play-btn" class:playing={rhythmPlayer.playing} onclick={toggle}>
				{rhythmPlayer.playing ? t('rhythm.stop') : t('rhythm.play')}
			</button>

			<div class="bpm-row">
				<span class="ctrl-label">{t('rhythm.bpm')}</span>
				<Slider
					type="single"
					min={40}
					max={240}
					step={1}
					value={bpm}
					onValueChange={(v: number) => onBpmChange(v)}
					class="bpm-slider"
				/>
				<span class="bpm-value">{bpm}</span>
			</div>

			<div class="key-row">
				<span class="ctrl-label">{t('rhythm.key')}</span>
				<Select.Root
					type="single"
					value={selectedKey}
					onValueChange={(v: string) => onKeyChange(v)}
				>
					<Select.Trigger class="key-trigger">
						{selectedKey}
					</Select.Trigger>
					<Select.Content>
						{#each CHROMATIC_KEYS as k}
							<Select.Item value={k}>{k}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</section>
	</main>
{/if}

<style>
	main {
		max-width: 520px;
		margin: 0 auto;
		padding: var(--sp-4) var(--sp-4) 3rem;
		display: flex;
		flex-direction: column;
		gap: var(--sp-6);
	}

	.back-link {
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		text-decoration: none;
	}
	.back-link:hover {
		color: var(--text);
	}

	.eyebrow {
		font-size: 0.65rem;
		font-weight: 700;
		color: #cc2936;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.rhythm-name {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(2.4rem, 10vw, 3.8rem);
		line-height: 0.95;
		letter-spacing: -0.01em;
		text-transform: capitalize;
	}

	.desc {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.notation-section {
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		padding: var(--sp-4);
		overflow-x: auto;
	}

	#vf-notation {
		min-height: 120px;
	}

	.grid-section {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}

	.track-label {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.beat-grid {
		display: grid;
		gap: 3px;
	}

	.cell {
		aspect-ratio: 1;
		border-radius: 4px;
		background: var(--border);
		transition: background 0.05s;
	}

	.cell.bass-strong {
		background: #cc2936;
	}
	.cell.bass-weak {
		background: color-mix(in srgb, #cc2936 35%, transparent);
	}
	.chord-track .cell.chord-hit {
		background: #1d4ed8;
	}

	.cell.active {
		outline: 2px solid rgba(255, 255, 255, 0.7);
		outline-offset: -2px;
		filter: brightness(1.2);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}

	.play-btn {
		height: 48px;
		background: var(--text);
		color: #fff;
		border: none;
		border-radius: var(--radius-card);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background var(--dur-base);
	}
	.play-btn.playing {
		background: #cc2936;
	}

	.bpm-row,
	.key-row {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
	}

	.ctrl-label {
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		min-width: 32px;
	}

	:global(.bpm-slider) {
		flex: 1;
	}

	.bpm-value {
		font-size: 0.78rem;
		font-weight: 700;
		min-width: 28px;
		text-align: right;
	}

	:global(.key-trigger) {
		min-width: 80px;
		font-weight: 600;
	}
</style>
