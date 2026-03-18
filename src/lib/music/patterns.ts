export const PATTERNS = ['ostinato', 'alberti-bass', 'arpeggio', 'stride'] as const;

export type Pattern = (typeof PATTERNS)[number];
