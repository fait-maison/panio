import { writable, derived } from 'svelte/store';

type Locale = 'en' | 'fr';

const translations = {
	en: {
		// app
		'app.title': 'improv piano',
		// settings panel
		'settings.title': 'Settings',
		'settings.close': 'Close',
		'settings.keyboardSize': 'Keyboard size',
		'settings.interval': 'Interval',
		'settings.modes': 'Modes',
		'settings.keys': 'Keys',
		'settings.language': 'Language',
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
		'app.title': "piano d'impro",
		'settings.title': 'Paramètres',
		'settings.close': 'Fermer',
		'settings.keyboardSize': 'Taille du clavier',
		'settings.interval': 'Intervalle',
		'settings.modes': 'Modes',
		'settings.keys': 'Tonalités',
		'settings.language': 'Langue',
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

export const localeStore = writable<Locale>(loadLocale());
localeStore.subscribe((l) => {
	if (typeof localStorage !== 'undefined') localStorage.setItem('piano-locale', l);
});

export const t = derived(localeStore, ($locale) => (key: string): string => {
	const dict = translations[$locale] as Record<string, string>;
	return dict[key] ?? (translations.en as Record<string, string>)[key] ?? key;
});
