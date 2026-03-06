export type Locale = 'en' | 'fr';

const translations = {
	en: {
		// app
		'app.title': 'Panio',
		'nav.sandbox': 'Sandbox',
		'nav.menu': 'Menu',
		// sidebar
		'sidebar.exercises': 'Exercises',
		'sidebar.settings': 'Settings',
		'exercise.sandbox': 'Sandbox',
		'exercise.sandbox.desc': 'Free improvisation over modes',
		'exercise.scenes': 'Scene Prompt',
		'exercise.scenes.desc': 'React to scene descriptions',
		'exercise.ear': 'Ear Training',
		'exercise.ear.desc': 'Identify intervals & chords',
		'exercise.rhythm': 'Rhythm & Texture',
		'exercise.rhythm.desc': 'Accompaniment patterns',
		'badge.soon': 'Soon',
		'settings.exercise': 'Exercise settings',
		// settings panel
		'settings.title': 'Settings',
		'settings.close': 'Close',
		'settings.keyboardSize': 'Keyboard size',
		'settings.interval': 'Interval',
		'settings.modes': 'Modes',
		'settings.keys': 'Keys',
		'settings.language': 'Language',
		'settings.progressionNotation': 'Chord notation',
		'settings.notation.chord': 'Chord symbols',
		'settings.notation.roman': 'Roman numerals',
		'settings.hints': 'Display scales',
		'settings.hints.on': 'On',
		'settings.hints.off': 'Off',
		'settings.difficulty': 'Chord complexity',
		'settings.difficulty.simple': 'Simple',
		'settings.difficulty.rich': 'Rich',
		'settings.difficulty.complex': 'Complex',
		// midi status
		'midi.connected': 'MIDI connected',
		'midi.disconnected': 'No MIDI device',
		'midi.unsupported': 'MIDI not supported',
		'midi.denied': 'MIDI permission denied',
		'midi.selectDevice': 'Select MIDI device',
		'midi.noDevices': 'No devices found',
		'midi.clearDevice': 'Clear selection',
		// toast
		'toast.nextIn': 'Next ambiance in',
		'toast.stay': 'Stay here',
		// mode names (display only — internal keys stay English)
		'mode.Major': 'Major',
		'mode.Minor': 'Minor',
		'mode.Harmonic Minor': 'Harmonic Minor',
		'mode.Dorian': 'Dorian',
		'mode.Phrygian': 'Phrygian',
		'mode.Lydian': 'Lydian',
		'mode.Mixolydian': 'Mixolydian',
		'mode.Locrian': 'Locrian',
		// moods
		'mood.Bright, safe': 'Bright, safe',
		'mood.Sad, dramatic': 'Sad, dramatic',
		'mood.Dramatic, exotic': 'Dramatic, exotic',
		'mood.Melancholic, bittersweet': 'Melancholic, bittersweet',
		'mood.Dark, threatening': 'Dark, threatening',
		'mood.Magical, ethereal': 'Magical, ethereal',
		'mood.Heroic, open': 'Heroic, open',
		'mood.Dissonant, dread': 'Dissonant, dread',
		// textures
		'texture.sparse · pedal tone': 'sparse · pedal tone',
		'texture.dense · block chords': 'dense · block chords',
		'texture.flowing · arpeggios': 'flowing · arpeggios',
		'texture.minimal · single notes': 'minimal · single notes',
		'texture.lush · sustained chords': 'lush · sustained chords',
		'texture.rhythmic · ostinato': 'rhythmic · ostinato',
		'texture.trembling · tremolo': 'trembling · tremolo',
		'texture.wide · open voicings': 'wide · open voicings',
		'texture.close · cluster chords': 'close · cluster chords',
		'texture.delicate · high register': 'delicate · high register',
		'texture.rumbling · low register': 'rumbling · low register',
		'texture.expansive · both hands apart': 'expansive · both hands apart',
		'texture.still · long tones': 'still · long tones',
		'texture.restless · short motifs': 'restless · short motifs'
	},
	fr: {
		'app.title': 'Panio',
		'nav.sandbox': 'Sandbox',
		'nav.menu': 'Menu',
		'sidebar.exercises': 'Exercices',
		'sidebar.settings': 'Paramètres',
		'exercise.sandbox': 'Sandbox',
		'exercise.sandbox.desc': 'Improvisation libre sur les modes',
		'exercise.scenes': 'Scène',
		'exercise.scenes.desc': 'Réagir à des descriptions de scènes',
		'exercise.ear': 'Oreille',
		'exercise.ear.desc': 'Identifier intervalles et accords',
		'exercise.rhythm': 'Rythme & Texture',
		'exercise.rhythm.desc': "Patterns d'accompagnement",
		'badge.soon': 'Bientôt',
		'settings.exercise': "Paramètres de l'exercice",
		'settings.title': 'Paramètres',
		'settings.close': 'Fermer',
		'settings.keyboardSize': 'Taille du clavier',
		'settings.interval': 'Intervalle',
		'settings.modes': 'Modes',
		'settings.keys': 'Tonalités',
		'settings.language': 'Langue',
		'settings.progressionNotation': 'Notation des accords',
		'settings.notation.chord': "Symboles d'accords",
		'settings.notation.roman': 'Chiffres romains',
		'settings.hints': 'Afficher les gammes',
		'settings.hints.on': 'Activé',
		'settings.hints.off': 'Désactivé',
		'settings.difficulty': 'Complexité des accords',
		'settings.difficulty.simple': 'Simple',
		'settings.difficulty.rich': 'Riche',
		'settings.difficulty.complex': 'Complexe',
		'midi.connected': 'MIDI connecté',
		'midi.disconnected': 'Aucun appareil MIDI',
		'midi.unsupported': 'MIDI non supporté',
		'midi.denied': 'Permission MIDI refusée',
		'midi.selectDevice': "Choisir l'appareil MIDI",
		'midi.noDevices': 'Aucun appareil trouvé',
		'midi.clearDevice': 'Effacer la sélection',
		'toast.nextIn': 'Prochaine ambiance dans',
		'toast.stay': 'Rester ici',
		'mode.Major': 'Majeur',
		'mode.Minor': 'Mineur',
		'mode.Harmonic Minor': 'Mineur harmonique',
		'mode.Dorian': 'Dorien',
		'mode.Phrygian': 'Phrygien',
		'mode.Lydian': 'Lydien',
		'mode.Mixolydian': 'Mixolydien',
		'mode.Locrian': 'Locrien',
		'mood.Bright, safe': 'Lumineux, stable',
		'mood.Sad, dramatic': 'Triste, dramatique',
		'mood.Dramatic, exotic': 'Dramatique, exotique',
		'mood.Melancholic, bittersweet': 'Mélancolique, doux-amer',
		'mood.Dark, threatening': 'Sombre, menaçant',
		'mood.Magical, ethereal': 'Magique, éthéré',
		'mood.Heroic, open': 'Héroïque, ouvert',
		'mood.Dissonant, dread': 'Dissonant, lugubre',
		'texture.sparse · pedal tone': 'épars · pédale',
		'texture.dense · block chords': 'dense · accords plaqués',
		'texture.flowing · arpeggios': 'fluide · arpèges',
		'texture.minimal · single notes': 'minimal · notes seules',
		'texture.lush · sustained chords': 'riche · accords tenus',
		'texture.rhythmic · ostinato': 'rythmique · ostinato',
		'texture.trembling · tremolo': 'tremblant · trémolo',
		'texture.wide · open voicings': 'large · voix ouvertes',
		'texture.close · cluster chords': 'serré · clusters',
		'texture.delicate · high register': 'délicat · registre aigu',
		'texture.rumbling · low register': 'grondant · registre grave',
		'texture.expansive · both hands apart': 'ample · mains écartées',
		'texture.still · long tones': 'immobile · tenues longues',
		'texture.restless · short motifs': 'agité · courts motifs'
	}
} satisfies Record<Locale, Record<string, string>>;

function loadLocale(): Locale {
	if (typeof localStorage === 'undefined') return 'fr';
	return (localStorage.getItem('piano-locale') as Locale) ?? 'fr';
}

let _locale = $state<Locale>(loadLocale());

$effect.root(() => {
	$effect(() => {
		if (typeof localStorage !== 'undefined') localStorage.setItem('piano-locale', _locale);
	});
});

export const locale = {
	get value() { return _locale; },
	set(l: Locale) { _locale = l; }
};

export function t(key: string): string {
	const dict = translations[_locale] as Record<string, string>;
	return dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
}
