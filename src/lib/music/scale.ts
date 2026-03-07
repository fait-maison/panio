import { Scale, Note } from 'tonal';
import type { Ambiance } from './generator';

// Returns pitch-class integers (0–11) so enharmonic equivalents always match.
export function getScaleNotes(ambiance: Ambiance): Set<number> {
	const scale = Scale.get(`${ambiance.key} ${ambiance.mode.tonalName}`);
	return new Set(scale.notes.map((n) => Note.chroma(n)));
}
