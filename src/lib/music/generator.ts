import { MODES, KEYS, type ModeInfo } from './modes';
import { MOODS, type MoodInfo } from './moods';
import type { RomanProgression, Difficulty } from './progressions';
import { pickProgression } from './progressions';

export interface Ambiance {
	mood: MoodInfo;
	mode: ModeInfo;
	key: string;
	rhythm: string;
	progression: RomanProgression;
}

function pickRandom<T>(arr: T[], exclude?: T): T {
	const candidates = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
	const pool = candidates.length > 0 ? candidates : arr;
	return pool[Math.floor(Math.random() * pool.length)];
}

export function generateAmbiance(
	moodPool: string[],
	modePool: string[],
	keyPool: string[],
	difficultyPool: Difficulty[],
	previous?: Ambiance
): Ambiance {
	const resolvedKeys = keyPool.length > 0 ? keyPool : KEYS;
	const resolvedDifficulties =
		difficultyPool.length > 0 ? difficultyPool : (['simple'] as Difficulty[]);

	// Filter moods by user pool
	const availableMoods = MOODS.filter((m) => moodPool.includes(m.name));
	const resolvedMoods = availableMoods.length > 0 ? availableMoods : MOODS;

	// Pick a mood (avoid repeating previous) — compare by name, $state wraps in Proxy
	const prevMoodName = previous?.mood.name;
	const moodCandidates = prevMoodName
		? resolvedMoods.filter((m) => m.name !== prevMoodName)
		: resolvedMoods;
	const moodsToTry = moodCandidates.length > 0 ? moodCandidates : resolvedMoods;

	// Find first mood whose modes intersect with user's mode pool (shuffled for variety)
	const shuffled = [...moodsToTry].sort(() => Math.random() - 0.5);
	let mood: MoodInfo = shuffled[0];
	let compatibleModes = MODES.filter(
		(m) => modePool.includes(m.name) && mood.modes.includes(m.name)
	);
	for (const candidate of shuffled) {
		const intersection = MODES.filter(
			(m) => modePool.includes(m.name) && candidate.modes.includes(m.name)
		);
		if (intersection.length > 0) {
			mood = candidate;
			compatibleModes = intersection;
			break;
		}
	}

	// Fallback: if no mood's modes overlap with user's pool, use any mode from the pool
	if (compatibleModes.length === 0) {
		compatibleModes = MODES.filter((m) => modePool.includes(m.name));
		if (compatibleModes.length === 0) compatibleModes = [...MODES];
	}

	// Pick mode from compatible set (avoid repeating previous) — compare by name
	const prevModeName = previous?.mode.name;
	const modeCandidates = prevModeName
		? compatibleModes.filter((m) => m.name !== prevModeName)
		: compatibleModes;
	const modesToPick = modeCandidates.length > 0 ? modeCandidates : compatibleModes;
	const mode = modesToPick[Math.floor(Math.random() * modesToPick.length)];

	const key = pickRandom(resolvedKeys, previous?.key);
	// Rhythm is picked from the chosen mood's compatible rhythms
	const rhythm = pickRandom(mood.rhythms as string[], previous?.rhythm);
	const difficulty = pickRandom(resolvedDifficulties);
	const progression = pickProgression(mode.name, difficulty, previous?.progression);

	return { mood, mode, key, rhythm, progression };
}
