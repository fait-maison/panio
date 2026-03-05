import { MODES, KEYS, type ModeInfo } from './modes';
import { TEXTURES } from './textures';
import type { RomanProgression, Difficulty } from './progressions';
import { pickProgression } from './progressions';

export interface Ambiance {
	mode: ModeInfo;
	key: string;
	texture: string;
	progression: RomanProgression;
}

function pickRandom<T>(arr: T[], exclude?: T): T {
	const candidates = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
	const pool = candidates.length > 0 ? candidates : arr;
	return pool[Math.floor(Math.random() * pool.length)];
}

export function generateAmbiance(
	modePool: string[],
	keyPool: string[],
	difficultyPool: Difficulty[],
	previous?: Ambiance
): Ambiance {
	const availableModes = MODES.filter((m) => modePool.includes(m.name));
	const resolvedModes = availableModes.length > 0 ? availableModes : MODES;
	const resolvedKeys = keyPool.length > 0 ? keyPool : KEYS;
	const resolvedDifficulties = difficultyPool.length > 0 ? difficultyPool : (['simple'] as Difficulty[]);

	const mode = pickRandom(resolvedModes, previous?.mode);
	const key = pickRandom(resolvedKeys, previous?.key);
	const texture = pickRandom(TEXTURES, previous?.texture);
	const difficulty = pickRandom(resolvedDifficulties);
	const progression = pickProgression(mode.name, difficulty, previous?.progression);

	return { mode, key, texture, progression };
}
