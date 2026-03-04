import { writable } from 'svelte/store';

export type MidiStatus = 'unsupported' | 'disconnected' | 'connected';
export const midiStatus = writable<MidiStatus>('disconnected');
export const midiDeviceName = writable<string | null>(null);

// All currently detected MIDI inputs — reactive, updates on hotplug
export const midiInputList = writable<Array<{ id: string; name: string; manufacturer: string }>>(
	[]
);

// User-selected device ID — persisted in localStorage under 'piano-midi-device'
export const midiPreferredDeviceId = writable<string | null>(loadPreferredDevice());

function loadPreferredDevice(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('piano-midi-device');
}

function createMidiStore() {
	// Set of currently pressed MIDI note numbers
	const { subscribe, update } = writable<Set<number>>(new Set());

	let access: MIDIAccess | null = null;

	function refreshStatus() {
		if (!access) return;
		const inputs = [...access.inputs.values()];
		midiInputList.set(
			inputs.map((i) => ({ id: i.id, name: i.name ?? '', manufacturer: i.manufacturer ?? '' }))
		);

		let preferredId: string | null = null;
		midiPreferredDeviceId.subscribe((id) => {
			preferredId = id;
		})();

		const preferred = preferredId ? inputs.find((i) => i.id === preferredId) : undefined;
		const active = preferred ?? null;
		midiStatus.set(active ? 'connected' : 'disconnected');
		midiDeviceName.set(active?.name ?? null);
	}

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
		let preferredId: string | null = null;
		midiPreferredDeviceId.subscribe((id) => {
			preferredId = id;
		})();

		midiAccess.inputs.forEach((input) => {
			input.onmidimessage =
				!preferredId || input.id === preferredId ? handleMessage : null;
		});
		midiAccess.onstatechange = () => {
			connectInputs(midiAccess);
			refreshStatus();
		};
	}

	function getTargetOutputs(): MIDIOutput[] {
		if (!access) return [];
		const outputs = [...access.outputs.values()];
		let preferredId: string | null = null;
		midiPreferredDeviceId.subscribe((id) => {
			preferredId = id;
		})();
		if (!preferredId) return outputs;
		const preferredName = [...access.inputs.values()].find((i) => i.id === preferredId)?.name;
		const match = preferredName ? outputs.filter((o) => o.name === preferredName) : [];
		return match.length ? match : outputs;
	}

	async function init() {
		if (typeof navigator === 'undefined' || !navigator.requestMIDIAccess) {
			midiStatus.set('unsupported');
			return;
		}
		try {
			access = await navigator.requestMIDIAccess();
			connectInputs(access);
			refreshStatus();
		} catch {
			midiStatus.set('unsupported');
		}
	}

	function setPreferredDevice(id: string | null) {
		midiPreferredDeviceId.set(id);
		if (typeof localStorage !== 'undefined') {
			id
				? localStorage.setItem('piano-midi-device', id)
				: localStorage.removeItem('piano-midi-device');
		}
		if (access) connectInputs(access);
		refreshStatus();
	}

	function sendNoteOn(note: number, velocity = 64) {
		update((s) => {
			const next = new Set(s);
			next.add(note);
			return next;
		});
		getTargetOutputs().forEach((output) => output.send([0x90, note, velocity]));
	}

	function sendNoteOff(note: number) {
		update((s) => {
			const next = new Set(s);
			next.delete(note);
			return next;
		});
		getTargetOutputs().forEach((output) => output.send([0x80, note, 0]));
	}

	function destroy() {
		if (access) {
			access.inputs.forEach((input) => {
				input.onmidimessage = null;
			});
		}
	}

	return { subscribe, init, destroy, sendNoteOn, sendNoteOff, setPreferredDevice };
}

export const midiStore = createMidiStore();
