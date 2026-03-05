export type MidiStatus = 'unsupported' | 'disconnected' | 'connected';

export type MidiInput = { id: string; name: string; manufacturer: string };

function loadPreferredDevice(): string | null {
	if (typeof localStorage === 'undefined') return null;
	return localStorage.getItem('piano-midi-device');
}

let _pressed    = $state<Set<number>>(new Set());
let _status     = $state<MidiStatus>('disconnected');
let _deviceName = $state<string | null>(null);
let _inputList  = $state<MidiInput[]>([]);
let _preferred  = $state<string | null>(loadPreferredDevice());

let access: MIDIAccess | null = null;

function refreshStatus() {
	if (!access) return;
	const inputs = [...access.inputs.values()];
	_inputList = inputs.map((i) => ({ id: i.id, name: i.name ?? '', manufacturer: i.manufacturer ?? '' }));

	const preferred = _preferred ? inputs.find((i) => i.id === _preferred) : undefined;
	const active = preferred ?? null;
	_status = active ? 'connected' : 'disconnected';
	_deviceName = active?.name ?? null;
}

function handleMessage(event: MIDIMessageEvent) {
	const [status, note, velocity] = event.data as unknown as [number, number, number];
	const command = status & 0xf0;

	if (command === 0x90 && velocity > 0) {
		const next = new Set(_pressed);
		next.add(note);
		_pressed = next;
	} else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
		const next = new Set(_pressed);
		next.delete(note);
		_pressed = next;
	}
}

function connectInputs(midiAccess: MIDIAccess) {
	midiAccess.inputs.forEach((input) => {
		input.onmidimessage =
			!_preferred || input.id === _preferred ? handleMessage : null;
	});
	midiAccess.onstatechange = () => {
		connectInputs(midiAccess);
		refreshStatus();
	};
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
		connectInputs(access);
		refreshStatus();
	} catch {
		_status = 'unsupported';
	}
}

function setPreferredDevice(id: string | null) {
	_preferred = id;
	if (typeof localStorage !== 'undefined') {
		id
			? localStorage.setItem('piano-midi-device', id)
			: localStorage.removeItem('piano-midi-device');
	}
	if (access) connectInputs(access);
	refreshStatus();
}

function sendNoteOn(note: number, velocity = 64) {
	const next = new Set(_pressed);
	next.add(note);
	_pressed = next;
	getTargetOutputs().forEach((output) => output.send([0x90, note, velocity]));
}

function sendNoteOff(note: number) {
	const next = new Set(_pressed);
	next.delete(note);
	_pressed = next;
	getTargetOutputs().forEach((output) => output.send([0x80, note, 0]));
}

function destroy() {
	if (access) {
		access.inputs.forEach((input) => {
			input.onmidimessage = null;
		});
	}
}

export const midi = {
	get pressedNotes()     { return _pressed; },
	get status()           { return _status; },
	get deviceName()       { return _deviceName; },
	get inputList()        { return _inputList; },
	get preferredDeviceId(){ return _preferred; },
	init,
	destroy,
	sendNoteOn,
	sendNoteOff,
	setPreferredDevice
};
