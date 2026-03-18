import type { Style } from './styles';

export interface MoodInfo {
	name: string;
	modes: string[];
	styles: Style[];
}

export const MOODS: MoodInfo[] = [
	{
		name: 'tense',
		modes: ['Phrygian', 'Locrian', 'Harmonic Minor'],
		styles: ['tango', 'flamenco']
	},
	{
		name: 'dark',
		modes: ['Phrygian', 'Locrian', 'Minor'],
		styles: ['ballad', 'shuffle']
	},
	{
		name: 'melancholic',
		modes: ['Dorian', 'Minor', 'Harmonic Minor'],
		styles: ['ballad', 'waltz']
	},
	{
		name: 'bright',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		styles: ['march', 'samba', 'polka']
	},
	{
		name: 'romantic',
		modes: ['Lydian', 'Dorian', 'Major'],
		styles: ['waltz', 'bossa', 'ballad']
	},
	{
		name: 'heroic',
		modes: ['Mixolydian', 'Major', 'Dorian'],
		styles: ['march', 'samba', 'shuffle']
	},
	{
		name: 'playful',
		modes: ['Major', 'Mixolydian', 'Lydian'],
		styles: ['polka', 'shuffle', 'reggae', 'samba']
	},
	{
		name: 'mysterious',
		modes: ['Lydian', 'Phrygian', 'Locrian'],
		styles: ['bossa', 'waltz', 'ballad']
	},
	{
		name: 'dramatic',
		modes: ['Harmonic Minor', 'Phrygian', 'Minor'],
		styles: ['tango', 'flamenco']
	},
	{
		name: 'pastoral',
		modes: ['Major', 'Lydian', 'Mixolydian'],
		styles: ['waltz', 'ballad', 'reggae']
	}
];

export const ALL_MOOD_NAMES = MOODS.map((m) => m.name);
