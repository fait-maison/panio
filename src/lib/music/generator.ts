import { MODES, KEYS, type ModeInfo } from './modes';
import { TEXTURES } from './textures';

export interface Ambiance {
	mode: ModeInfo;
	key: string;
	texture: string;
}

function pickRandom<T>(arr: T[], exclude?: T): T {
	const candidates = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
	return candidates[Math.floor(Math.random() * candidates.length)];
}

export function generateAmbiance(
	modePool: string[],
	keyPool: string[],
	previous?: Ambiance
): Ambiance {
	const availableModes = MODES.filter((m) => modePool.includes(m.name));
	const resolvedModes = availableModes.length > 0 ? availableModes : MODES;
	const resolvedKeys = keyPool.length > 0 ? keyPool : KEYS;

	const mode = pickRandom(resolvedModes, previous?.mode);
	const key = pickRandom(resolvedKeys, previous?.key);
	const texture = pickRandom(TEXTURES, previous?.texture);

	return { mode, key, texture };
}
