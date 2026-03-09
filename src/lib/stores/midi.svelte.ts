import { SvelteSet } from 'svelte/reactivity';
import { playNote } from '$lib/audio';
import { settings } from '$lib/stores/settings.svelte';

export type MidiStatus = 'unsupported' | 'denied' | 'disconnected' | 'connected';

export type MidiInput = { id: string; name: string; manufacturer: string };

function loadPreferredDevice(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('piano-midi-device');
}

const _pressed: SvelteSet<number> = new SvelteSet();
let _status = $state<MidiStatus>('disconnected');
let _deviceName = $state<string | null>(null);
let _inputList = $state<MidiInput[]>([]);
let _preferred = $state<string | null>(loadPreferredDevice());

let access: MIDIAccess | null = null;

function refreshStatus() {
	if (!access) return;
	const inputs = [...access.inputs.values()];
	// Filter out Chrome/ALSA virtual routing ports (Linux: "Output connection" artifacts)
	const realInputs = inputs.filter((i) => (i.name ?? '') !== 'Output connection');
	_inputList = realInputs.map((i) => ({
		id: i.id,
		name: i.name ?? '',
		manufacturer: i.manufacturer ?? ''
	}));

	const preferred = _preferred ? inputs.find((i) => i.id === _preferred) : undefined;
	const active = preferred ?? null;
	_status = active ? 'connected' : 'disconnected';
	_deviceName = active?.name ?? null;
}

function handleMessage(event: MIDIMessageEvent) {
	// Auto-select: first device to send a message wins (transient, not persisted)
	if (!_preferred && event.target) {
		_preferred = (event.target as MIDIInput).id;
		if (access) connectInputs(access);
		refreshStatus();
	}

	const [status, note, velocity] = event.data as unknown as [number, number, number];
	const command = status & 0xf0;

	if (command === 0x90 && velocity > 0) {
		_pressed.add(note);
	} else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
		_pressed.delete(note);
	}
}

function connectInputs(midiAccess: MIDIAccess) {
	midiAccess.inputs.forEach((input) => {
		input.removeEventListener('midimessage', handleMessage);
		if (!_preferred || input.id === _preferred) {
			input.addEventListener('midimessage', handleMessage);
		}
	});
}

function onStateChange() {
	if (!access) return;
	connectInputs(access);
	refreshStatus();
}

function getTargetOutputs(): MIDIOutput[] {
	if (!access) return [];
	const outputs = [...access.outputs.values()];
	if (!_preferred) return outputs;
	const preferredName = [...access.inputs.values()].find((i) => i.id === _preferred)?.name;
	const match = preferredName ? outputs.filter((o) => o.name === preferredName) : [];
	return match.length ? match : outputs;
}

async function init() {
	if (typeof navigator === 'undefined' || !navigator.requestMIDIAccess) {
		_status = 'unsupported';
		return;
	}
	try {
		access = await navigator.requestMIDIAccess();
		access.addEventListener('statechange', onStateChange);
		connectInputs(access);
		refreshStatus();
	} catch (err) {
		_status =
			err instanceof DOMException && err.name === 'SecurityError' ? 'denied' : 'unsupported';
	}
}

function setPreferredDevice(id: string | null) {
	_preferred = id;
	if (typeof localStorage !== 'undefined') {
		if (id) {
			localStorage.setItem('piano-midi-device', id);
		} else {
			localStorage.removeItem('piano-midi-device');
		}
	}
	if (access) connectInputs(access);
	refreshStatus();
}

function sendNoteOn(note: number, velocity = 64) {
	_pressed.add(note);
	playNote(note, settings.value.volume);
	getTargetOutputs().forEach((output) => output.send([0x90, note, velocity]));
}

function sendNoteOff(note: number) {
	_pressed.delete(note);
	getTargetOutputs().forEach((output) => output.send([0x80, note, 0]));
}

function destroy() {
	if (access) {
		access.removeEventListener('statechange', onStateChange);
		access.inputs.forEach((input) => {
			input.removeEventListener('midimessage', handleMessage);
		});
	}
}

export const midi = {
	get pressedNotes() {
		return _pressed;
	},
	get status() {
		return _status;
	},
	get deviceName() {
		return _deviceName;
	},
	get inputList() {
		return _inputList;
	},
	get preferredDeviceId() {
		return _preferred;
	},
	init,
	destroy,
	sendNoteOn,
	sendNoteOff,
	setPreferredDevice
};
