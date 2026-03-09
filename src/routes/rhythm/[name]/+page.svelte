<!-- src/routes/rhythm/[name]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n.svelte';
	import { RHYTHM_PATTERNS, totalSteps } from '$lib/music/rhythmPatterns';
	import { rhythmPlayer } from '$lib/stores/rhythmPlayer.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Vex from 'vexflow';

	const CHROMATIC_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	const name = $derived($page.params.name);
	const pattern = $derived(RHYTHM_PATTERNS[name as keyof typeof RHYTHM_PATTERNS] ?? null);
	const steps = $derived(pattern ? totalSteps(pattern.timeSignature) : 16);
	const beatSteps = $derived(
		pattern ? (pattern.timeSignature[1] === 8 ? 6 : 16 / pattern.timeSignature[1]) : 4
	);

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
			rhythmPlayer.start(pattern, newKey, bpm);
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

		const { Renderer, Stave, StaveNote, StaveConnector, Voice, Formatter, Beam } = VexFlow;
		const width = Math.max(container.clientWidth || 0, 300);
		const renderer = new Renderer(container, Renderer.Backends.SVG);
		renderer.resize(width, 220);
		const ctx = renderer.getContext();

		const ts = `${pat.timeSignature[0]}/${pat.timeSignature[1]}`;
		const staveWidth = width - 20;

		// Grand staff: treble (chords) on top, bass (bass notes) on bottom
		const staveTop = new Stave(10, 10, staveWidth);
		staveTop.addClef('treble').addTimeSignature(ts);
		staveTop.setContext(ctx).draw();

		const staveBottom = new Stave(10, 110, staveWidth);
		staveBottom.addClef('bass').addTimeSignature(ts);
		staveBottom.setContext(ctx).draw();

		// Brace + left barline connecting both staves
		new StaveConnector(staveTop, staveBottom)
			.setType(StaveConnector.type.BRACE)
			.setContext(ctx)
			.draw();
		new StaveConnector(staveTop, staveBottom)
			.setType(StaveConnector.type.SINGLE_LEFT)
			.setContext(ctx)
			.draw();

		const keyIdx = CHROMATIC_KEYS.indexOf(rootNote);
		// Chord root at C5 (treble range); bass root at C4 (bass notes at octave -1 land on C3/G3)
		const chordRootMidi = 72 + keyIdx;
		const bassRootMidi = 60 + keyIdx;
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

		function buildNotes(
			patSteps: typeof pat.bass,
			stemDir: number,
			color: string,
			restKey: string,
			isChord: boolean,
			clef: string,
			noteRootMidi: number
		) {
			const notes: unknown[] = [];
			const sorted = [...patSteps].sort((a, b) => a.step - b.step);
			let cursor = 0;
			for (const s of sorted) {
				if (s.step < cursor) continue; // skip overlapping steps (future-proof guard)
				if (s.step > cursor) {
					notes.push(
						new StaveNote({
							keys: [restKey],
							duration: `${dur(s.step - cursor)}r`,
							stem_direction: stemDir,
							clef
						})
					);
				}
				// Chord voice: expand to full root-position triad (1-3-5)
				// Bass voice: single note at the step's scale degree
				const keys = isChord
					? [1, 3, 5].map((d) => midiToVfKey(noteRootMidi + (DEGREE_SEMI[d] ?? 0) + s.octave * 12))
					: [midiToVfKey(noteRootMidi + (DEGREE_SEMI[s.degree] ?? 0) + s.octave * 12)];
				const note = new StaveNote({
					keys,
					duration: dur(s.duration),
					stem_direction: stemDir,
					clef
				});
				note.setStyle({ fillStyle: color, strokeStyle: color });
				notes.push(note);
				cursor = s.step + s.duration;
			}
			if (cursor < total) {
				notes.push(
					new StaveNote({
						keys: [restKey],
						duration: `${dur(total - cursor)}r`,
						stem_direction: stemDir,
						clef
					})
				);
			}
			return notes;
		}

		// Explicit stem directions: chord voice stems-up (treble), bass voice stems-down (bass)
		const bassNotes = buildNotes(pat.bass, -1, '#cc2936', 'b/2', false, 'bass', bassRootMidi);
		const chordNotes = buildNotes(pat.chords, 1, '#1d4ed8', 'b/4', true, 'treble', chordRootMidi);

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

		// Generate beams BEFORE drawing voices — sets note.beam so hasFlag() returns false,
		// suppressing individual flags on beamed notes during voice.draw()
		type VfBeam = {
			setStyle: (s: object) => void;
			setContext: (c: unknown) => { draw: () => void };
		};
		const bassBeams: VfBeam[] = Beam.generateBeams(bassNotes, { stem_direction: -1 });
		const chordBeams: VfBeam[] = Beam.generateBeams(chordNotes, { stem_direction: 1 });
		bassBeams.forEach((b) => b.setStyle({ fillStyle: '#cc2936', strokeStyle: '#cc2936' }));
		chordBeams.forEach((b) => b.setStyle({ fillStyle: '#1d4ed8', strokeStyle: '#1d4ed8' }));

		// Format both voices together so same-beat notes align across staves
		new Formatter()
			.joinVoices([voiceChord])
			.joinVoices([voiceBass])
			.format([voiceChord, voiceBass], width - 70);
		voiceChord.draw(ctx, staveTop);
		voiceBass.draw(ctx, staveBottom);

		// Draw beams last (on top of note heads)
		bassBeams.forEach((b) => b.setContext(ctx).draw());
		chordBeams.forEach((b) => b.setContext(ctx).draw());
	}

	$effect(() => {
		const pat = pattern;
		const key = selectedKey;
		if (!pat) return;
		let cancelled = false;
		// Defer to microtask so the DOM node is mounted before reading clientWidth
		Promise.resolve().then(() => {
			if (!cancelled) renderNotation(pat, key);
		});
		return () => {
			cancelled = true;
		};
	});

	function musicalBpm(bpm: number, ts: [number, number]): { value: number; unit: string } {
		// Compound time (6/8, 12/8): scheduler bpm = 1.5 × dotted-quarter bpm
		if (ts[1] === 8) return { value: Math.round(bpm / 1.5), unit: '♩.' };
		return { value: bpm, unit: '♩' };
	}

	onMount(() => {
		if (pattern === null) goto('/rhythm');
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') rhythmPlayer.stop();
	});
</script>

<svelte:head>
	<title>{t(`rhythm.${name}`)} — {t('rhythm.title')} — {t('app.title')}</title>
</svelte:head>

{#if pattern !== null}
	{@const mb = musicalBpm(pattern.bpm, pattern.timeSignature)}
	<main>
		<a class="back-link" href="/rhythm">{t('rhythm.backToAll')}</a>

		<header>
			<p class="eyebrow">
				{pattern.style} · {pattern.timeSignature[0]}/{pattern.timeSignature[1]} · {mb.unit} = {mb.value}
			</p>
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
						class:beat-start={i > 0 && i % beatSteps === 0}
						class:bass-strong={pattern.bass.some((s) => s.step === i && s.velocity > 70)}
						class:bass-weak={pattern.bass.some((s) => s.step === i && s.velocity <= 70)}
						class:bass-sustain={pattern.bass.some((s) => i > s.step && i < s.step + s.duration)}
						class:active={rhythmPlayer.currentStep === i}
					></div>
				{/each}
			</div>

			<div class="track-label">{t('rhythm.chord')}</div>
			<div class="beat-grid chord-track" style="grid-template-columns: repeat({steps}, 1fr)">
				{#each Array(steps) as _, i}
					<div
						class="cell"
						class:beat-start={i > 0 && i % beatSteps === 0}
						class:chord-hit={pattern.chords.some((s) => s.step === i)}
						class:chord-sustain={pattern.chords.some((s) => i > s.step && i < s.step + s.duration)}
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
		min-height: 220px;
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

	.cell.beat-start {
		box-shadow: inset 3px 0 0 color-mix(in srgb, var(--text) 22%, transparent);
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
	.cell.bass-sustain {
		background: color-mix(in srgb, #cc2936 20%, transparent);
	}
	.chord-track .cell.chord-sustain {
		background: color-mix(in srgb, #1d4ed8 20%, transparent);
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
