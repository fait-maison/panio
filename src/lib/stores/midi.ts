import { writable } from 'svelte/store';

function createMidiStore() {
	// Set of currently pressed MIDI note numbers
	const { subscribe, update } = writable<Set<number>>(new Set());

	let access: MIDIAccess | null = null;

	function handleMessage(event: MIDIMessageEvent) {
		const [status, note, velocity] = event.data as unknown as [number, number, number];
		const command = status & 0xf0;

		// note-on with velocity > 0 = press; note-on with velocity 0 or note-off = release
		if (command === 0x90 && velocity > 0) {
			update((s) => {
				const next = new Set(s);
				next.add(note);
				return next;
			});
		} else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
			update((s) => {
				const next = new Set(s);
				next.delete(note);
				return next;
			});
		}
	}

	function connectInputs(midiAccess: MIDIAccess) {
		midiAccess.inputs.forEach((input) => {
			input.onmidimessage = handleMessage;
		});
		midiAccess.onstatechange = () => {
			midiAccess.inputs.forEach((input) => {
				input.onmidimessage = handleMessage;
			});
		};
	}

	async function init() {
		if (typeof navigator === 'undefined' || !navigator.requestMIDIAccess) return;
		try {
			access = await navigator.requestMIDIAccess();
			connectInputs(access);
		} catch {
			// No MIDI access — keyboard stays silent, on-screen keyboard is the fallback
		}
	}

	function destroy() {
		if (access) {
			access.inputs.forEach((input) => {
				input.onmidimessage = null;
			});
		}
	}

	return { subscribe, init, destroy };
}

export const midiStore = createMidiStore();
