<!-- src/routes/pattern/[name]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n.svelte';
	import { PATTERN_DEFS, totalSteps } from '$lib/music/patternDefs';
	import { musicalBpm } from '$lib/music/stylePatterns';
	import { stylePlayer } from '$lib/stores/stylePlayer.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Vex from 'vexflow';

	const CHROMATIC_KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

	const name = $derived($page.params.name);
	const pattern = $derived(PATTERN_DEFS[name as keyof typeof PATTERN_DEFS] ?? null);
	const steps = $derived(pattern ? totalSteps(pattern.timeSignature) : 16);
	const beatSteps = $derived(
		pattern
			? pattern.timeSignature[1] === 8 && pattern.timeSignature[0] % 3 === 0
				? 6
				: 16 / pattern.timeSignature[1]
			: 4
	);

	let selectedKey = $state('C');
	let bpm = $state(120);
	let _notationWidth = $state(0);

	// Sync bpm with pattern default when pattern changes
	$effect(() => {
		if (pattern) bpm = pattern.bpm;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		const el = document.getElementById('vf-notation');
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			_notationWidth = entries[0]?.contentRect.width ?? el.clientWidth;
		});
		ro.observe(el);
		return () => ro.disconnect();
	});

	function toggle() {
		if (stylePlayer.playing) {
			stylePlayer.stop();
		} else if (pattern) {
			stylePlayer.start(pattern, selectedKey, bpm);
		}
	}

	function onKeyChange(newKey: string) {
		selectedKey = newKey;
		if (stylePlayer.playing && pattern) {
			stylePlayer.stop();
			stylePlayer.start(pattern, newKey, bpm);
		}
	}

	function onBpmChange(val: number) {
		bpm = val;
		stylePlayer.setBpm(bpm);
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
				16: 'w',
				24: 'w' // full bar in 12/8 (4 dotted-quarter beats); VexFlow has no 'wd', treat as whole
			};
			const result = m[n];
			if (!result) {
				console.error(
					`[pattern notation] unmapped duration: ${n} steps — defaulting to 16th. Extend dur() map.`
				);
				return '16';
			}
			return result;
		}

		function buildNotes(
			patSteps: typeof pat.bass,
			stemDir: number,
			color: string,
			restKey: string,
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
				// Use semitone offsets directly — voicing (inversions, 7ths, open 5ths) is in pattern data
				const keys = s.semitones.map((semi) => midiToVfKey(noteRootMidi + semi + s.octave * 12));
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
		const bassNotes = buildNotes(pat.bass, -1, '#cc2936', 'b/2', 'bass', bassRootMidi);
		const chordNotes = buildNotes(pat.chords, 1, '#1d4ed8', 'b/4', 'treble', chordRootMidi);

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
		void _notationWidth; // reactive dep — re-renders on container resize
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

	onMount(() => {
		if (pattern === null) goto('/pattern');
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') stylePlayer.stop();
	});
</script>

<svelte:head>
	<title>{t(`pattern.${name}`)} — {t('pattern.title')} — {t('app.title')}</title>
</svelte:head>

{#if pattern !== null}
	{@const mb = musicalBpm(pattern.bpm, pattern.timeSignature)}
	<main>
		<a class="back-link" href="/pattern">{t('pattern.backToAll')}</a>

		<header>
			<p class="eyebrow">
				{pattern.origin} · {pattern.timeSignature[0]}/{pattern.timeSignature[1]} · {mb.unit} = {mb.value}
			</p>
			<h1 class="pattern-name">{t(`pattern.${name}`)}</h1>
			<p class="desc">{pattern.description}</p>
		</header>

		<section class="notation-section" aria-label={t('pattern.notation')}>
			<div id="vf-notation"></div>
		</section>

		<section class="grid-section" aria-label={t('pattern.beatGrid')}>
			<div class="track-label">{t('pattern.bass')}</div>
			<div class="beat-grid">
				{#each Array(steps / beatSteps) as _, beatIdx}
					<div class="beat-group" style="grid-template-columns: repeat({beatSteps}, 1fr)">
						{#each Array(beatSteps) as _, stepInBeat}
							{@const i = beatIdx * beatSteps + stepInBeat}
							<div
								class="cell"
								class:bass-strong={pattern.bass.some((s) => s.step === i && s.velocity > 70)}
								class:bass-weak={pattern.bass.some((s) => s.step === i && s.velocity <= 70)}
								class:bass-sustain={pattern.bass.some((s) => i > s.step && i < s.step + s.duration)}
								class:active={stylePlayer.currentStep === i}
							></div>
						{/each}
					</div>
				{/each}
			</div>

			<div class="track-label">{t('pattern.chord')}</div>
			<div class="beat-grid chord-track">
				{#each Array(steps / beatSteps) as _, beatIdx}
					<div class="beat-group" style="grid-template-columns: repeat({beatSteps}, 1fr)">
						{#each Array(beatSteps) as _, stepInBeat}
							{@const i = beatIdx * beatSteps + stepInBeat}
							<div
								class="cell"
								class:chord-hit={pattern.chords.some((s) => s.step === i)}
								class:chord-sustain={pattern.chords.some(
									(s) => i > s.step && i < s.step + s.duration
								)}
								class:active={stylePlayer.currentStep === i}
							></div>
						{/each}
					</div>
				{/each}
			</div>
		</section>

		<section class="controls">
			<div class="action-row">
				<button class="play-btn" class:playing={stylePlayer.playing} onclick={toggle}>
					{stylePlayer.playing ? t('pattern.stop') : t('pattern.play')}
				</button>
				<a class="practice-btn" href="/sandbox?pattern={name}">{t('pattern.practice')} →</a>
			</div>

			<div class="bpm-row">
				<span class="ctrl-label">{t('pattern.bpm')}</span>
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
				<span class="ctrl-label">{t('pattern.key')}</span>
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

	.pattern-name {
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
		display: flex;
		gap: 8px;
	}

	.beat-group {
		display: grid;
		gap: 3px;
		flex: 1;
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

	.action-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}

	.play-btn {
		height: 48px;
		background: var(--text);
		color: var(--background);
		border: none;
		border-radius: var(--radius-card);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background var(--dur-base);
	}
	.play-btn.playing {
		background: oklch(0.35 0.02 0);
	}

	.practice-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 48px;
		background: #cc2936;
		color: #fff;
		border-radius: var(--radius-card);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-decoration: none;
		transition: background var(--dur-base);
	}
	.practice-btn:hover {
		background: oklch(from #cc2936 calc(l - 0.06) c h);
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
