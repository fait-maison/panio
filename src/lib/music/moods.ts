import type { Rhythm } from './rhythms';

export interface MoodInfo {
	name: string;
	modes: string[];
	rhythms: Rhythm[];
}

export const MOODS: MoodInfo[] = [
	{
		name: 'tense',
		modes: ['Phrygian', 'Locrian', 'Harmonic Minor'],
		rhythms: ['ostinato', 'tango', 'tarantella', 'flamenco']
	},
	{
		name: 'dark',
		modes: ['Phrygian', 'Locrian', 'Minor'],
		rhythms: ['funeral-march', 'nocturne', 'minimalist', 'ostinato']
	},
	{
		name: 'melancholic',
		modes: ['Dorian', 'Minor', 'Harmonic Minor'],
		rhythms: ['ballad', 'nocturne', 'waltz', 'blues', 'barcarolle']
	},
	{
		name: 'bright',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		rhythms: ['march', 'samba', 'polka', 'stride', 'fanfare']
	},
	{
		name: 'romantic',
		modes: ['Lydian', 'Dorian', 'Major'],
		rhythms: ['waltz', 'bossa', 'bolero', 'ballad', 'barcarolle']
	},
	{
		name: 'heroic',
		modes: ['Mixolydian', 'Major', 'Dorian'],
		rhythms: ['march', 'fanfare', 'ostinato', 'stride']
	},
	{
		name: 'playful',
		modes: ['Major', 'Mixolydian', 'Lydian'],
		rhythms: ['polka', 'shuffle', 'stride', 'reggae', 'samba', 'funk']
	},
	{
		name: 'mysterious',
		modes: ['Lydian', 'Phrygian', 'Locrian'],
		rhythms: ['rubato', 'minimalist', 'nocturne', 'barcarolle']
	},
	{
		name: 'dramatic',
		modes: ['Harmonic Minor', 'Phrygian', 'Minor'],
		rhythms: ['tango', 'flamenco', 'bolero', 'funeral-march']
	},
	{
		name: 'pastoral',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		rhythms: ['waltz', 'lullaby', 'ballad', 'reggae']
	}
];

export const ALL_MOOD_NAMES = MOODS.map((m) => m.name);
