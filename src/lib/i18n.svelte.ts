export type Locale = 'en' | 'fr';

const translations = {
	en: {
		// app
		'app.title': 'Panio',
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
		// about page
		'about.tagline': 'About',
		'about.tagline.accent': 'Panio',
		'about.story.p1': 'Panio is a free improv piano training app, made as a hobby project.',
		'about.story.p2':
			'I\u2019m an improviser at {lila}, I play piano, and I develop applications. This project is at the intersection of these three passions.',
		'about.pullquote': 'I\u2019m still searching for a quote to put here.',
		'about.story.p3': 'I wanted a tool to help me vary my style, so I made it.',
		'about.contribute.title': 'Contribute',
		'about.contribute.text':
			'Contributions are welcome. Contact me on {github} to suggest enhancements.',
		'sidebar.about': 'About',
		'settings.exercise': 'Exercise settings',
		// landing page
		'landing.title': 'What are we practicing?',
		'landing.subtitle': 'Pick an exercise and play. Your MIDI keyboard is ready.',
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
		// moods (pool labels)
		'settings.mood': 'Mood',
		'mood.tense': 'Tense',
		'mood.dark': 'Dark',
		'mood.melancholic': 'Melancholic',
		'mood.bright': 'Bright',
		'mood.romantic': 'Romantic',
		'mood.heroic': 'Heroic',
		'mood.playful': 'Playful',
		'mood.mysterious': 'Mysterious',
		'mood.dramatic': 'Dramatic',
		'mood.pastoral': 'Pastoral',
		// rhythms
		'rhythm.waltz': 'waltz',
		'rhythm.march': 'march',
		'rhythm.bossa': 'bossa nova',
		'rhythm.shuffle': 'shuffle',
		'rhythm.ballad': 'ballad',
		'rhythm.rubato': 'rubato',
		'rhythm.ostinato': 'ostinato',
		'rhythm.tango': 'tango',
		'rhythm.lullaby': 'lullaby',
		'rhythm.stride': 'stride',
		'rhythm.reggae': 'reggae',
		'rhythm.blues': 'blues',
		'rhythm.funk': 'funk',
		'rhythm.bolero': 'bolero',
		'rhythm.polka': 'polka',
		'rhythm.funeral-march': 'funeral march',
		'rhythm.minimalist': 'minimalist',
		'rhythm.nocturne': 'nocturne',
		'rhythm.fanfare': 'fanfare',
		'rhythm.barcarolle': 'barcarolle',
		'rhythm.flamenco': 'flamenco',
		'rhythm.tarantella': 'tarantella',
		'rhythm.samba': 'samba'
	},
	fr: {
		'app.title': 'Panio',
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
		// about page
		'about.tagline': 'À propos de',
		'about.tagline.accent': 'Panio',
		'about.story.p1':
			'Panio est une application gratuite d\u2019entraînement au piano impro, créée comme projet perso.',
		'about.story.p2':
			'Je suis improvisateur à {lila}, je joue du piano et je développe des applications. Ce projet est à l\u2019intersection de ces trois passions.',
		'about.pullquote': 'Je cherche encore une citation à mettre ici.',
		'about.story.p3':
			'Je voulais un outil pour m\u2019aider à varier mon style, alors je l\u2019ai fait.',
		'about.contribute.title': 'Contribuer',
		'about.contribute.text':
			'Les contributions sont les bienvenues. Contactez-moi sur {github} pour proposer des améliorations.',
		'sidebar.about': 'À propos',
		'settings.exercise': "Paramètres de l'exercice",
		'landing.title': 'On travaille quoi ?',
		'landing.subtitle': 'Choisis un exercice et joue. Ton clavier MIDI est prêt.',
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
		// moods (pool labels)
		'settings.mood': 'Ambiance',
		'mood.tense': 'Tendu',
		'mood.dark': 'Sombre',
		'mood.melancholic': 'Mélancolique',
		'mood.bright': 'Lumineux',
		'mood.romantic': 'Romantique',
		'mood.heroic': 'Héroïque',
		'mood.playful': 'Enjoué',
		'mood.mysterious': 'Mystérieux',
		'mood.dramatic': 'Dramatique',
		'mood.pastoral': 'Pastoral',
		// rhythms
		'rhythm.waltz': 'valse',
		'rhythm.march': 'marche',
		'rhythm.bossa': 'bossa nova',
		'rhythm.shuffle': 'shuffle',
		'rhythm.ballad': 'ballade',
		'rhythm.rubato': 'rubato',
		'rhythm.ostinato': 'ostinato',
		'rhythm.tango': 'tango',
		'rhythm.lullaby': 'berceuse',
		'rhythm.stride': 'stride',
		'rhythm.reggae': 'reggae',
		'rhythm.blues': 'blues',
		'rhythm.funk': 'funk',
		'rhythm.bolero': 'bolero',
		'rhythm.polka': 'polka',
		'rhythm.funeral-march': 'marche funebre',
		'rhythm.minimalist': 'minimaliste',
		'rhythm.nocturne': 'nocturne',
		'rhythm.fanfare': 'fanfare',
		'rhythm.barcarolle': 'barcarolle',
		'rhythm.flamenco': 'flamenco',
		'rhythm.tarantella': 'tarentelle',
		'rhythm.samba': 'samba'
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
	get value() {
		return _locale;
	},
	set(l: Locale) {
		_locale = l;
	}
};

export function t(key: string): string {
	const dict = translations[_locale] as Record<string, string>;
	return dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
}
