# About Page — Design Document

## Goal

Add an `/about` page to Panio with a full-width storytelling layout: hero tagline, narrative prose with pull-quote, about-me section, and credits bar. Accessible via sidebar link.

## Design Decisions

- **Layout C (full-width storytelling)** — chosen over simple prose (A) and card sections (B)
- **Hero toned down** — `1.8rem` tagline, tight spacing, informational not dramatic
- **Sidebar navigation** — "About" link added below exercises, above settings separator
- **Placeholder content** — personal details (`[Your name]`, `[city]`, `[N] years`) left as placeholders
- **i18n** — all text via `t()`, EN + FR translations
- **No new dependencies** — pure CSS + existing design tokens

## Mockup

Reference: `docs/mockups/about-C-full-width-story.html` (final version with toned-down hero)

## Content Sections

1. **Hero** — "Score the moment." tagline + italic subtitle
2. **Story** — Why Panio exists (improv piano, live scoring reflex)
3. **Pull-quote** — "A love scene? Tender arpeggios. A chase? Driving octaves."
4. **About me** — Personal placeholder
5. **Credits bar** — Tech stack list (SvelteKit, Tailwind, tonal.js, soundfont-player, Web MIDI, shadcn-svelte) + GitHub link + version
