let _current = $state<string | null>(null);

export const exercise = {
	get current() { return _current; },
	set(id: string | null) { _current = id; }
};
