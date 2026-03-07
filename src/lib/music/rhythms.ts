export const RHYTHMS = [
	'waltz',
	'march',
	'bossa',
	'shuffle',
	'ballad',
	'rubato',
	'ostinato',
	'tango',
	'lullaby',
	'stride',
	'reggae',
	'blues',
	'funk',
	'bolero',
	'polka',
	'funeral-march',
	'minimalist',
	'nocturne',
	'fanfare',
	'barcarolle',
	'flamenco',
	'tarantella',
	'samba'
] as const;

export type Rhythm = (typeof RHYTHMS)[number];
