export const STYLES = [
	'tango',
	'waltz',
	'bossa',
	'march',
	'shuffle',
	'reggae',
	'ballad',
	'polka',
	'samba',
	'flamenco'
] as const;

export type Style = (typeof STYLES)[number];
